import { Component, inject } from '@angular/core';
import {DialogRef} from '@services/modal/modal.service';
import {FormsModule} from '@angular/forms';
import {EntityEditFormComponent} from '@components/entity-edit-form/entity-edit-form.component';
import {MODAL_DATA} from '@services/modal/modal-data.token';

@Component({
  selector: 'app-entity-edit-dialog',
  imports: [FormsModule, EntityEditFormComponent],
  template: `
    <div class="edit-dialog">

      <app-entity-edit-form></app-entity-edit-form>

      <div class="button-panel flex justify-end gap-3 mt-6">
        <button class="btn btn-outline-primary"
        >
          OK
        </button>
        <button class="btn btn-outline-secondary" (click)="close()">
          Cancel
        </button>
      </div>


    </div>
  `,
})
export class EntityEditDialogComponent {
  private dialogRef = inject(DialogRef);
  private data = inject<{ name: string }>(MODAL_DATA);

  ngAfterViewInit() {
    alert(JSON.stringify(this.data));
  }

  close() {
    this.dialogRef.close();
  }

  login() {
    alert('login')
  }

}
