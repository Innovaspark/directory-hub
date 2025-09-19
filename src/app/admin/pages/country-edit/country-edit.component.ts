import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import {CountryEditFormComponent} from '@components/country-edit-form/country-edit-form.component';

@Component({
  selector: 'app-country-edit',
  standalone: true,
  imports: [CommonModule, CountryEditFormComponent],
  template: `
    <div class="p-4">
      <h2 class="text-xl font-bold mb-4">
        {{ pageTitle() }}
      </h2>

      <app-country-edit-form
        [tableName]="tableName"
        [pkConstraint]="pkConstraint"
        [updateColumns]="updateColumns"
        [id]="id()"
      />
    </div>
  `,
})
export class CountryEditComponent {
  // Static config for this entity
  tableName = 'countries';
  pkConstraint = 'country_pkey';
  updateColumns = ['name', 'code', 'continent']; // adjust to your schema

  // Reactive signals
  private idSignal = signal<number | null>(null);

  id = this.idSignal.asReadonly();

  pageTitle = computed(() =>
    this.id() ? 'Edit Country' : 'Create Country'
  );

  constructor(private route: ActivatedRoute) {
    debugger;
    const idParam = this.route.snapshot.paramMap.get('id');
    this.idSignal.set(idParam ? +idParam : null);
  }
}
