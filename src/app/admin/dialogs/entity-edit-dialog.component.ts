import {Component, inject, viewChild} from '@angular/core';
import {DialogRef} from '@services/modal/modal.service';
import {FormsModule} from '@angular/forms';
import {EntityEditFormComponent} from '@components/entity-edit-form/entity-edit-form.component';
import {MODAL_DATA} from '@services/modal/modal-data.token';
import {EntityPacket} from '@core/models/entity-packet.model';

@Component({
  selector: 'app-entity-edit-dialog',
  imports: [FormsModule, EntityEditFormComponent],
  template: `
    <div class="edit-dialog">

      <app-entity-edit-form #entityEditForm [entityPacket]="data.data"></app-entity-edit-form>

      <div class="button-panel flex justify-end gap-3 mt-6">
        <button class="btn btn-outline-primary"
                (click)="submit()"
        >
          OK
        </button>
        <button class="btn btn-outline-secondary" (click)="cancel()">
          Cancel
        </button>
      </div>


    </div>
  `,
})
export class EntityEditDialogComponent {
  entityEditForm = viewChild.required<EntityEditFormComponent>('entityEditForm');
  private dialogRef = inject(DialogRef);
  data = inject<any>(MODAL_DATA);

  async submit() {
    await this.entityEditForm().submit();
    this.dialogRef.close();
  }

  cancel() {
    this.dialogRef.close();
  }

}
