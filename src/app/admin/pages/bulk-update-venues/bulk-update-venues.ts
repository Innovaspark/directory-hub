import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VenueService, VenueUpdateInput } from '@core/services/venue.service';

@Component({
  selector: 'app-bulk-update-venues',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Bulk Update Venues</h2>

      <form [formGroup]="bulkUpdateForm" (ngSubmit)="onSubmit()" class="space-y-6">
        <div>
          <label for="jsonInput" class="block text-sm font-medium text-gray-700 mb-2">
            JSON Array Input
          </label>
          <textarea
            id="jsonInput"
            formControlName="jsonInput"
            rows="20"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
            [placeholder]="placeholderText">
          </textarea>
          <p class="mt-2 text-sm text-gray-500">
            Paste your JSON array of venue objects here. Each venue must have at least an "id" and "approved" field.
          </p>

          <div *ngIf="bulkUpdateForm.get('jsonInput')?.invalid && bulkUpdateForm.get('jsonInput')?.touched"
               class="mt-1 text-sm text-red-600">
            Valid JSON array is required
          </div>
        </div>

        <div *ngIf="message"
             [class]="messageClass">
          {{ message }}
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            [disabled]="bulkUpdateForm.invalid || isSubmitting"
            [class]="buttonClass">
            {{ isSubmitting ? 'Updating...' : 'Bulk Update Venues' }}
          </button>
        </div>
      </form>
    </div>
  `
})
export class BulkUpdateVenuesComponent {
  private fb = inject(FormBuilder);
  private venueService = inject(VenueService);

  bulkUpdateForm: FormGroup;
  isSubmitting = false;
  message = '';
  messageType: 'success' | 'error' | '' = '';

  placeholderText = `[
  {
    "id": "venue-uuid-here",
    "approved": true,
    "description": "Venue description...",
    "venueTypes": ["bar", "cafe"],
    "primary_type": "bar",
    "keywords": ["live music", "jazz"],
    "content": "<div>HTML content...</div>"
  }
]`;

  constructor() {
    this.bulkUpdateForm = this.fb.group({
      jsonInput: ['', [Validators.required, this.jsonValidator]]
    });
  }

  get messageClass(): string {
    const baseClasses = 'p-4 rounded-md';
    if (this.messageType === 'success') {
      return `${baseClasses} bg-green-50 border border-green-200 text-green-700`;
    } else if (this.messageType === 'error') {
      return `${baseClasses} bg-red-50 border border-red-200 text-red-700`;
    }
    return baseClasses;
  }

  get buttonClass(): string {
    const baseClasses = 'px-6 py-2 rounded-md text-white font-medium';
    if (this.bulkUpdateForm.invalid || this.isSubmitting) {
      return `${baseClasses} bg-gray-400 cursor-not-allowed`;
    }
    return `${baseClasses} bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`;
  }

  jsonValidator(control: any) {
    if (!control.value) {
      return null;
    }

    try {
      const parsed = JSON.parse(control.value);
      if (!Array.isArray(parsed)) {
        return { invalidJson: { message: 'Must be a JSON array' } };
      }

      // Validate each venue has required fields
      for (let i = 0; i < parsed.length; i++) {
        const venue = parsed[i];
        if (!venue.id || !venue.hasOwnProperty('approved')) {
          return { invalidJson: { message: `Venue at index ${i} is missing required fields (id, approved)` } };
        }
      }

      return null;
    } catch (e) {
      return { invalidJson: { message: 'Invalid JSON format' } };
    }
  }

  async onSubmit() {
    if (this.bulkUpdateForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.message = '';
    this.messageType = '';

    try {
      const jsonInput = this.bulkUpdateForm.get('jsonInput')?.value;
      const venues: VenueUpdateInput[] = JSON.parse(jsonInput);

      const result = await this.venueService.bulkUpdateVenues(venues);

      if (result.success) {
        this.message = `Successfully updated ${result.affected_rows} venues!`;
        this.messageType = 'success';
        this.bulkUpdateForm.reset(); // Clear form on success
      } else {
        this.message = `Update failed: ${result.error}`;
        this.messageType = 'error';
      }
    } catch (error: any) {
      this.message = `Error: ${error.message}`;
      this.messageType = 'error';
    } finally {
      this.isSubmitting = false;
    }
  }
}
