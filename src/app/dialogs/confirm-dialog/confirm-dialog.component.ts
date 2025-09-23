import {Component, inject, input, output} from '@angular/core';
import {DialogRef} from '@services/modal/modal.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
})
export class ConfirmDialogComponent {
  // Inputs as signals
  title = input<string>('Confirm');
  message = input<string>('Are you sure you want to continue?');
  okText = input<string>('OK');
  cancelText = input<string>('Cancel');

  // Outputs as event emitters
  confirm = output<void>();
  cancel = output<void>();

  private dialogRef = inject(DialogRef);

  onConfirm() {
    this.confirm.emit();
    this.dialogRef.close('okdbutt');
  }

  onCancel() {
    this.cancel.emit();
    this.dialogRef.close('Canceldbutt');
  }
}
