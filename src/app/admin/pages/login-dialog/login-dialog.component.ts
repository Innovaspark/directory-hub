import { Component } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { DxFormModule } from 'devextreme-angular';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'app-login-dialog',
  standalone: false,
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss']
})
export class LoginDialogComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;

  constructor(private auth: AuthService) {}

  async login() {
    if (!this.email || !this.password) {
      notify('Email and password are required.', 'warning', 3000);
      return;
    }

    this.loading = true;
    try {
      await this.auth.signIn(this.email, this.password);
      notify('Login successful!', 'success', 3000);
      // Close dialog or navigate to admin dashboard here
    } catch (err: any) {
      notify(err.message || 'Login failed', 'error', 4000);
    } finally {
      this.loading = false;
    }
  }
}
