// login-page.component.ts
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalService } from '@core/services/modal.service';
import { NavigationService } from '@core/services/navigation.service';
import { LoginDialogComponent } from '@components/auth/login-dialog/login-dialog.component';

@Component({
  selector: 'app-login-page',
  standalone: true,
  template: `<div></div>` // Empty - modal handles UI
})
export class LoginPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private modalService = inject(ModalService);
  private navigationService = inject(NavigationService);

  ngOnInit() {
    // Open modal immediately
    const dialogRef = this.modalService.open(LoginDialogComponent);

    dialogRef?.afterClosed().subscribe(success => {
      if (success) {
        // Redirect to intended route or home
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          // Parse the return URL and navigate appropriately
          this.navigateToReturnUrl(returnUrl);
        } else {
          this.navigationService.navigateToHome();
        }
      } else {
        this.navigationService.navigateToHome();
      }
    });
  }

  private navigateToReturnUrl(returnUrl: string) {
    this.navigationService.navigateToReturnUrl(returnUrl);
  }
}
