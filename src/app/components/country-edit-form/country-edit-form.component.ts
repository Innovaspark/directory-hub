import { Component, Input, Output, EventEmitter, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormlyJsonschema } from '@ngx-formly/core/json-schema';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import {HasuraCrudService} from '@core/hasura/hasura-crud.service';

@Component({
  selector: 'app-country-edit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormlyModule],
  templateUrl: './country-edit-form.component.html'
})
export class CountryEditFormComponent implements OnInit {
  @Input() countryId!: number;       // primary key of the country to edit
  @Input() tableName: string = 'countries';
  @Input() pkConstraint: string = 'countries_pkey';
  @Input() updateColumns: string[] = []; // optional, defaults to all

  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  model: any = {};
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private hasuraCrud: HasuraCrudService, private formlyJsonschema: FormlyJsonschema) {}

  async ngOnInit() {
    this.loading.set(true);
    try {
      // Fetch existing country data from Hasura
      debugger;
      const countryData = await this.hasuraCrud.fetchById(this.tableName, 'id', this.countryId);

      // Build form configuration using existing buildUpsertForm
      const { fields, mutation } = await this.hasuraCrud.buildUpsertForm(
        this.tableName,
        this.pkConstraint,
        this.updateColumns.length ? this.updateColumns : Object.keys(countryData)
      );

      this.fields = fields;
      this.model = { ...countryData }; // prefill form

      // Store the mutation for submit
      this._mutation = mutation;

    } catch (err: any) {
      this.error.set(err.message || 'Failed to load form');
    } finally {
      this.loading.set(false);
    }
  }

  private _mutation: string = '';

  async submit() {
    this.loading.set(true);
    this.error.set(null);
    try {

      // await this.hasuraCrud.runUpsert(this.tableName, this._mutation, { object: this.model });
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
