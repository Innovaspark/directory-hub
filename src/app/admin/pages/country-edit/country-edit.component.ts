import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CountryEditFormComponent } from '@components/country-edit-form/country-edit-form.component';

@Component({
  selector: 'app-country-edit',
  standalone: true,
  imports: [CommonModule, CountryEditFormComponent],
  template: `
      <div class="row">
        <div class="col-md-3"></div>
        <div class="col-md-6 bg-gray-300 text-white edit-page">
            <h2 class="text-xl font-bold mb-4">{{ pageTitle() }}</h2>

            <app-country-edit-form
              [tableName]="tableName"
              [pkConstraint]="pkConstraint"
              [countryId]="id()"
              (saved)="onSaved()"
              (cancelled)="onCancelled()"
            ></app-country-edit-form>
        </div>
        <div class="col-md-3"></div>
      </div>


  `
})
export class CountryEditComponent {
  tableName = 'countries';
  pkConstraint = 'countries_pkey';

  // signal to store the ID from route
  // private idSignal = signal<number | null>(null);
  // id = this.idSignal.asReadonly();
  id = signal<string | null>(null);

  pageTitle = computed(() =>
    this.id() ? 'Edit Country' : 'Create Country'
  );

  constructor(private route: ActivatedRoute) {
    // Use paramMap subscription to handle async routing
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      // this.idSignal.set(idParam ? +idParam : null);
      this.id.set(idParam);
    });
  }

  onSaved() {
    console.log('Country saved');
    // navigate away or show success message
  }

  onCancelled() {
    console.log('Edit cancelled');
    // navigate away if needed
  }
}
