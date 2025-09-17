import {ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormlyFieldConfig, FormlyForm} from '@ngx-formly/core';
import {FormGroup, ReactiveFormsModule} from '@angular/forms';
import {TenantService} from '@services/tenant.service';
import {Tenant} from '@core/models/tenant.model';
import {ToastService} from '@services/toaster.service';

@Component({
  selector: 'app-tenant-edit',
  imports: [ReactiveFormsModule, FormlyForm],
  template: `
    <div class="container mt-4">
      <h2>Edit Tenant</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <formly-form [form]="form" [fields]="fields" [model]="model"></formly-form>
        <div class="mt-3">
          <button type="submit" class="btn btn-primary me-2" [disabled]="!form.valid">
            Save
          </button>
          <button type="button" class="btn btn-secondary" (click)="cancel()">
            Cancel
          </button>
        </div>
      </form>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TenantEditComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private tenantService = inject(TenantService);
  private cdr = inject(ChangeDetectorRef);
  private toast = inject(ToastService);

  form = new FormGroup({});
  model: Partial<Tenant> = {};
  tenantId: string = '';

  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Tenant Name',
        placeholder: 'Enter tenant name',
        required: true,
      }
    },
    {
      key: 'slug',
      type: 'input',
      props: {
        label: 'Slug',
        placeholder: 'Enter slug',
        required: true,
      }
    },
    {
      key: 'description',
      type: 'textarea',
      props: {
        label: 'Description',
        placeholder: 'Enter description',
        rows: 3,
      }
    },
    {
      key: 'domain_names',
      type: 'input',
      props: {
        label: 'Domain Names (comma-separated)',
        placeholder: 'example.com, www.example.com',
      }
    },
    {
      key: 'search_terms',
      type: 'input',
      props: {
        label: 'Search Terms (comma-separated)',
        placeholder: 'live music, concerts, venues',
      }
    },
    {
      key: 'keywords',
      type: 'input',
      props: {
        label: 'Keywords (comma-separated)',
        placeholder: 'jazz, rock, classical',
      }
    },
    {
      key: 'venue_types',
      type: 'repeat',
      props: {
        label: 'Venue Types',
        addText: 'Add Venue Type',
      },
      fieldArray: {
        fieldGroup: [
          {
            key: 'slug',
            type: 'input',
            props: {
              label: 'Slug',
              required: true,
              placeholder: 'e.g. music_venue'
            }
          },
          {
            key: 'label',
            type: 'input',
            props: {
              label: 'Label',
              required: true,
              placeholder: 'e.g. Music Venue'
            }
          },
          {
            key: 'icon',
            type: 'input',
            props: {
              label: 'Icon',
              placeholder: 'e.g. music, microphone'
            }
          },
          {
            key: 'color',
            type: 'input',
            props: {
              label: 'Color',
              placeholder: '#ff0000'
            }
          },
          {
            key: 'description',
            type: 'textarea',
            props: {
              label: 'Description',
              rows: 2,
              placeholder: 'Describe this venue type'
            }
          }
        ]
      }
    }
  ];
  ngOnInit() {
    this.tenantId = this.route.snapshot.params['id'];
    if (this.tenantId) {
      this.loadTenant();
    }
  }

  private loadTenant() {
    this.tenantService.getTenantById(this.tenantId).subscribe({
      next: (tenant) => {
        if (tenant) {
          this.model = { ...tenant };
          this.cdr.markForCheck();
        }
      },
      error: (error) => {
        console.error('Error loading tenant:', error);
      }
    });
  }

  onSubmit() {
    if (this.form.valid) {
      this.tenantService.saveTenant(this.model).subscribe({
        next: (savedTenant) => {
          console.log('Tenant saved:', savedTenant);
          this.toast.showSuccess('Tenant saved!');
          this.router.navigate(['/admin/tenants']);
        },
        error: (error) => {
          this.toast.showError('Error saving tenant');
          console.error('Error saving tenant:', error);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/tenants']);
  }
}
