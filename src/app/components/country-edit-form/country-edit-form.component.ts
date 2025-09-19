import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HasuraCrudService } from '@core/hasura/hasura-crud.service';

@Component({
  selector: 'app-country-edit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormlyModule],
  templateUrl: './country-edit-form.component.html'
})
export class CountryEditFormComponent {
  private _countryId: string | null = null;

  @Input()
  set countryId(value: string | null) {
    debugger;
    this._countryId = value;
    if (this._countryId != null) {
      this.loadCountry(this._countryId);
    } else {
      this.model = {};
      this.buildForm();
    }
  }

  // get countryId(): string | null {
  //   return this._countryId;
  // }

  @Input() tableName: string = 'countries';
  @Input() pkConstraint: string = 'countries_pkey';
  @Input() updateColumns: string[] = [];

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  model: any = {};
  loading = signal(false);
  error = signal<string | null>(null);

  private _mutation: string = '';

  constructor(private hasuraCrud: HasuraCrudService, private formlyJsonschema: FormlyJsonschema) {}

  private async loadCountry(id: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      const countryData = await this.hasuraCrud.fetchById(this.tableName, 'id', id);
      const updateColumns = Object.keys(countryData).filter(key => key !== '__typename');

      const { fields, mutation } = await this.hasuraCrud.buildUpsertForm(
        this.tableName,
        this.pkConstraint,
        this.updateColumns.length ? updateColumns : Object.keys(countryData)
      );

      this.fields = fields;
      this.model = { ...countryData };
      this._mutation = mutation;
    } catch (err: any) {
      this.error.set(err.message || 'Failed to load country');
    } finally {
      this.loading.set(false);
    }
  }

  private buildForm() {
    // optional: build empty form for create scenario
    this.form = new FormGroup({});
    this.fields = [];
    this._mutation = '';
  }

  async submit() {
    if (!this._mutation) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      await this.hasuraCrud.runUpsert(this._mutation, { object: this.model });
      this.saved.emit();
    } catch (err: any) {
      this.error.set(err.message || 'Failed to save country');
    } finally {
      this.loading.set(false);
    }
  }

  cancel() {
    this.cancelled.emit();
  }
}
