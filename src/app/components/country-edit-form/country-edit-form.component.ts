import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
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
    this._countryId = value;
    if (this._countryId != null) {
      this.loadCountry(this._countryId);
    } else {
      this.model = {};
      this.buildForm();
    }
  }

  @Input() tableName: string = 'countries';

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  model: any = {};
  loading = signal(false);
  error = signal<string | null>(null);

  private _mutation: string = '';
  private _allowedKeys: string[] = [];

  constructor(private hasuraCrud: HasuraCrudService) {}

  private async loadCountry(id: string) {
    this.loading.set(true);
    this.error.set(null);
    try {
      // 1️⃣ Fetch the record first
      const countryData = await this.hasuraCrud.fetchById(this.tableName, 'id', id);

      // 2️⃣ Determine updateColumns entirely from the record keys
      const updateColumns = Object.keys(countryData).filter(key => key !== '__typename');

      // 3️⃣ Build upsert form and get allowedKeys (scalar fields)
      const { fields, mutation, allowedKeys } = await this.hasuraCrud.buildUpsertForm(
        this.tableName,
        updateColumns // use only record-derived keys
      );

      this.fields = fields;
      this._mutation = mutation;
      this._allowedKeys = allowedKeys;

      // 4️⃣ Fetch the record again including all scalar fields
      const countryDataFetched = await this.hasuraCrud.fetchById(
        this.tableName,
        'id',
        id,
        allowedKeys // ensures required scalars like 'code' are populated
      );

      this.model = { ...countryDataFetched };

    } catch (err: any) {
      this.error.set(err.message || 'Failed to load country');
    } finally {
      this.loading.set(false);
    }
  }

  private buildForm() {
    this.form = new FormGroup({});
    this.fields = [];
    this._mutation = '';
    this._allowedKeys = [];
  }

  async submit() {
    if (!this._mutation) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const modelWithoutTypename = { ...this.model };
      delete modelWithoutTypename.__typename;

      // Strip child types using allowedKeys
      await this.hasuraCrud.runUpsert(
        this._mutation,
        modelWithoutTypename,
        this._allowedKeys
      );

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
