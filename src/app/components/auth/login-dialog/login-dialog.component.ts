import { Component, inject } from '@angular/core';
import {DialogRef} from '@services/modal/modal.service';
import {FormsModule} from '@angular/forms';
import {UserStateService} from '@core/state/user-state.service';

@Component({
  selector: 'app-login-dialog',
  imports: [FormsModule],
  template: `
    <div class="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl transform scale-95 transition-transform duration-200">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>

      <form (ngSubmit)="login()" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-1">Username</label>
          <input
            type="text"
            [(ngModel)]="username"
            name="username"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Password</label>
          <input
            type="password"
            [(ngModel)]="password"
            name="password"
            class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <button
          type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Log In
        </button>
      </form>

      <button
        class="mt-4 w-full text-gray-500 hover:text-gray-700 text-sm"
        (click)="close()"
      >
        Cancel
      </button>
    </div>
  `,
})
export class LoginDialogComponent {
  private dialogRef = inject(DialogRef);
  userStateService = inject(UserStateService);

  username = '';
  password = '';

  close() {
    this.dialogRef.close();
  }

  login() {
    this.userStateService.signIn(this.username, this.password);
    this.dialogRef.close(true);
  }
}
