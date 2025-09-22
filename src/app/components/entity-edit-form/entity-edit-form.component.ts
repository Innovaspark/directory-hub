import {Component, Input, Output, EventEmitter, signal, input} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormlyModule, FormlyFieldConfig } from '@ngx-formly/core';
import { FormsModule, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { HasuraCrudService } from '@core/hasura/hasura-crud.service';
import {EntityPacket} from '@core/models/entity-packet.model';

@Component({
  selector: 'app-entity-edit-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, FormlyModule],
  templateUrl: './entity-edit-form.component.html'
})
export class EntityEditFormComponent {
  entityPacket = input.required<EntityPacket>();

  form = new FormGroup({});
  fields: FormlyFieldConfig[] = [];
  model: any = {};
  loading = signal(false);
  error = signal<string | null>(null);

  private _mutation: string = '';
  private _allowedKeys: string[] = [];

  constructor(private hasuraCrud: HasuraCrudService) {}

  ngAfterViewInit() {
    this.loadData();
  }

  private async loadData() {
    this.loading.set(true);
    this.error.set(null);
    try {
      // 1️⃣ Build upsert form and get allowedKeys (scalar fields)
      const { fields, mutation, allowedKeys }
        = await this.hasuraCrud.buildUpsertForm(this.entityPacket().tableName);

      this.fields = fields;
      this._mutation = mutation;
      this._allowedKeys = allowedKeys;

      // 2️⃣ Fetch the record including all scalar fields
      const data = await this.hasuraCrud.fetchById(
        this.entityPacket().tableName,
        'id',
        this.entityPacket().id,
        allowedKeys
      );

      this.model = { ...data };

    } catch (err: any) {
      this.error.set(err.message || 'Failed to load item');
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

  public async submit() {
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

    } catch (err: any) {
      this.error.set(err.message || 'Failed to save item');
    } finally {
      this.loading.set(false);
    }
  }

}
