import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ColumnDef } from '@tanstack/table-core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HasuraCrudService {
  private systemFieldNames = ['id', 'created_at', 'updated_at'];
  constructor(
    private apollo: Apollo,
    private formlyJsonschema: FormlyJsonschema
  ) {}

  // ===== Helpers =====
  private friendlyLabel(name: string) {
    return name.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
  }

  private parseDescription(description?: string) {
    if (!description) return { label: undefined, tooltip: undefined };
    const [label, tooltip] = description.split('|').map(s => s.trim());
    return { label, tooltip };
  }

  private buildFormlyFieldsFromHasura(tableName: string, fields: any[]): FormlyFieldConfig[] {
    return fields.map(f => {
      const { label, tooltip } = this.parseDescription(f.description);
      const finalLabel = label || this.friendlyLabel(f.name);

      let type: string;

      // Detect type based on metadata
      if (f.type.kind === 'ENUM' || f.type.name?.endsWith('_enum')) {
        type = 'select';
      } else if (f.type.name === 'Boolean') {
        type = 'checkbox';
      } else if (f.type.name === 'String') {
        const desc = (f.description || '').toLowerCase();
        const memoKeywords = ['memo', 'notes', 'description', 'comments'];
        type = memoKeywords.some(k => f.name.includes(k)) ? 'textarea' : '';
        if (type === '') {
          type = memoKeywords.some(k => desc.includes(k)) ? 'textarea' : 'input';
        }
      } else {
        type = 'input'; // fallback
      }

      return {
        key: f.name,
        type,
        templateOptions: {
          label: finalLabel,
          description: tooltip,
          required: f.type.kind === 'NON_NULL',
          readonly: this.systemFieldNames.includes(f.name)
        },
        className: `input-admin input-${tableName}-${f.name}`
      } as FormlyFieldConfig;
    });
  }

  // Strip child/relationship values from the object before submit
  private stripChildValues(
    obj: Record<string, any>,
    allowedKeys: string[]
  ): Record<string, any> {
    return Object.fromEntries(
      Object.entries(obj)
        .filter(([key, value]) => allowedKeys.includes(key))
        .map(([key, value]) => {
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            return [key, this.stripChildValues(value, allowedKeys)];
          }
          return [key, value];
        })
    );
  }

  // ===== Upsert =====
  async buildUpsertForm(
    tableName: string
  ): Promise<{ fields: FormlyFieldConfig[]; mutation: string; allowedKeys: string[] }> {
    const introspectionQuery = gql`
      query {
        __type(name: "${tableName}_insert_input") {
          inputFields {
            name
            description
            type {
              kind
              name
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    `;

    const result = await firstValueFrom(
      this.apollo.query<any>({ query: introspectionQuery })
    );

    const fields = result.data?.__type?.inputFields ?? [];

    const scalarFields = fields.filter(
      (f: any) =>
        f.type.kind !== 'INPUT_OBJECT' &&
        f.type.ofType?.kind !== 'INPUT_OBJECT'
    );

    const formlyFields = this.buildFormlyFieldsFromHasura(tableName, scalarFields);
    const allowedKeys = scalarFields.map((f: any) => f.name);

    // Derive updateColumns from allowedKeys, excluding system fields
    const updateColumns = allowedKeys.filter((key: string) =>
      !this.systemFieldNames.includes(key)
    );

    // PK constraint derived from table name
    const pkConstraint = `${tableName}_pkey`;

    const mutation = `
      mutation upsert_${tableName}($object: ${tableName}_insert_input!) {
        insert_${tableName}_one(
          object: $object,
          on_conflict: {
            constraint: ${pkConstraint},
            update_columns: [${updateColumns.join(', ')}]
          }
        ) {
          id
        }
      }
    `;

    return { fields: formlyFields, mutation, allowedKeys };
  }

  async runUpsert<T>(
    mutation: string,
    object: Record<string, any>,
    allowedKeys: string[]
  ): Promise<T> {
    const cleanObject = this.stripChildValues(object, allowedKeys);

    const mutationDoc = gql`${mutation}`;
    const result = await firstValueFrom(
      this.apollo.mutate<T>({ mutation: mutationDoc, variables: { object: cleanObject } })
    );
    if (!result.data) throw new Error(`Upsert failed, no data returned`);
    return result.data;
  }

  // ===== Delete =====
  buildDeleteMutation(tableName: string, pkColumn: string): string {
    return `
      mutation delete_${tableName}($id: ${pkColumn}_bool_exp!) {
        delete_${tableName}(where: { id: { _eq: $id } }) {
          affected_rows
        }
      }
    `;
  }

  async runDelete<T>(mutation: string, id: any): Promise<T> {
    const mutationDoc = gql`${mutation}`;
    const result = await firstValueFrom(
      this.apollo.mutate<T>({ mutation: mutationDoc, variables: { id } })
    );
    if (!result.data) throw new Error(`Delete failed, no data returned`);
    return result.data;
  }

  // ===== TanStack Table Config (FLAT) =====
  async buildTableConfig(
    tableName: string,
    options?: { limit?: number; offset?: number }
  ): Promise<{
    columns: ColumnDef<any, any>[];
    query: string;
    variables: Record<string, any>;
  }> {
    const introspectionQuery = gql`
      query {
        __type(name: "${tableName}") {
          fields {
            name
            type {
              kind
              name
              ofType {
                name
                kind
              }
            }
          }
        }
      }
    `;

    const result = await firstValueFrom(
      this.apollo.query<any>({ query: introspectionQuery })
    );

    const fields = result.data?.__type?.fields ?? [];

    const scalarFields = fields.filter(
      (f: any) =>
        f.type.kind === 'SCALAR' ||
        f.type.kind === 'ENUM' ||
        f.type.ofType?.kind === 'SCALAR' ||
        f.type.ofType?.kind === 'ENUM'
    );

    const fieldNames = scalarFields.map((f: any) => f.name);
    if (fieldNames.length === 0) {
      throw new Error(`No scalar fields found for table ${tableName}`);
    }

    const columns: ColumnDef<any, any>[] = scalarFields.map((f: any) => ({
      accessorKey: f.name,
      header: this.friendlyLabel(f.name),
      cell: (info: any) => info.getValue(),
    }));

    const query = `
      query ${tableName}_list($limit: Int, $offset: Int) {
        ${tableName}(limit: $limit, offset: $offset) {
          ${fieldNames.join('\n')}
        }
      }
    `;

    const variables = {
      limit: options?.limit ?? null,
      offset: options?.offset ?? 0,
    };

    return { columns, query, variables };
  }

  async fetchById<T = any>(
    tableName: string,
    idColumn: string,
    idValue: string | number,
    selectColumns?: string[]
  ): Promise<T | null> {
    let columns: string[];

    if (selectColumns && selectColumns.length) {
      columns = selectColumns;
    } else {
      const introspectionQuery = gql`
        query {
          __type(name: "${tableName}") {
            fields {
              name
              type {
                kind
                name
                ofType {
                  name
                  kind
                }
              }
            }
          }
        }
      `;

      const result = await firstValueFrom(
        this.apollo.query<any>({ query: introspectionQuery })
      );

      const fields = result.data?.__type?.fields ?? [];

      const scalarFields = fields.filter(
        (f: any) =>
          f.type.kind === 'SCALAR' ||
          f.type.kind === 'ENUM' ||
          f.type.ofType?.kind === 'SCALAR' ||
          f.type.ofType?.kind === 'ENUM'
      );

      columns = scalarFields.map((f: any) => f.name);
    }

    const query = gql`
      query fetch_${tableName}_by_id($id: uuid!) {
      item: ${tableName}(where: { ${idColumn}: { _eq: $id } }) {
      ${columns.join('\n')}
      }
      }
    `;

    const result = await firstValueFrom(
      this.apollo.query<{ item: T[] }>({ query, variables: { id: idValue } })
    );

    return result.data?.item?.[0] ?? null;
  }
}
