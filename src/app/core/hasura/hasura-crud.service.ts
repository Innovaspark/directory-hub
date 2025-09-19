import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormlyFieldConfig } from '@ngx-formly/core';
import { ColumnDef } from '@tanstack/table-core';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class HasuraCrudService {
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

  private buildFormlyFieldsFromHasura(fields: any[]): FormlyFieldConfig[] {
    return fields.map(f => {
      const { label, tooltip } = this.parseDescription(f.description);
      const finalLabel = label || this.friendlyLabel(f.name);

      let type = 'input';
      if (f.type.kind === 'ENUM' || f.type.name?.endsWith('_enum')) type = 'select';
      else if (f.type.name === 'Boolean') type = 'checkbox';

      return {
        key: f.name,
        type,
        templateOptions: {
          label: finalLabel,
          description: tooltip,
          required: f.type.kind === 'NON_NULL',
        },
      } as FormlyFieldConfig;
    });
  }

  // ===== Upsert =====
  async buildUpsertForm(
    tableName: string,
    pkConstraint: string,
    updateColumns: string[],
  ): Promise<{ fields: FormlyFieldConfig[]; mutation: string }> {
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
    const formlyFields = this.buildFormlyFieldsFromHasura(fields);

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

    return { fields: formlyFields, mutation };
  }

  async runUpsert<T>(
    mutation: string,
    object: Record<string, any>
  ): Promise<T> {
    const mutationDoc = gql`${mutation}`;
    const result = await firstValueFrom(
      this.apollo.mutate<T>({ mutation: mutationDoc, variables: { object } })
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

    // Only scalars or enums
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

    // Build parameterized query with limit/offset
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

  // ===== Fetch a single record by primary key =====
// ===== Fetch a single record by primary key =====
  async fetchById<T = any>(
    tableName: string,          // e.g., 'countries'
    idColumn: string,           // e.g., 'id'
    idValue: string | number,   // e.g., 5
    selectColumns?: string[]    // optional list of fields, fallback below
  ): Promise<T | null> {
    const columns = selectColumns && selectColumns.length ? selectColumns : ['id', 'name'];

    // Use GraphQL alias 'item' to guarantee a known key
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

    // Optional chaining ensures no crash if the response is empty
    return result.data?.item?.[0] ?? null;
  }



}
