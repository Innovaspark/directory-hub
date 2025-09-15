// auth-api.service.ts - Low-level API service
import { Injectable } from '@angular/core';
import { NhostClient } from '@nhost/nhost-js';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private nhost = new NhostClient({
    subdomain: environment.nhostSubdomain,
    region: environment.nhostRegion
  });

  // Session management
  getSession() {
    return this.nhost.auth.getSession();
  }

  onAuthStateChanged(callback: (event: string, session: any) => void) {
    return this.nhost.auth.onAuthStateChanged(callback);
  }

  isAuthenticated(): boolean {
    return this.nhost.auth.isAuthenticated();
  }

  getAccessToken(): string | null {
    return this.nhost.auth.getAccessToken() || null;
  }

  // Auth operations
  async signUp(email: string, password: string, displayName?: string) {
    return await this.nhost.auth.signUp({
      email,
      password,
      options: displayName ? { displayName } : undefined
    });
  }

  async signIn(email: string, password: string) {
    return await this.nhost.auth.signIn({
      email,
      password
    });
  }

  async signOut() {
    return await this.nhost.auth.signOut();
  }

  async refreshToken() {
    return await this.nhost.auth.refreshSession();
  }

  async sendPasswordReset(email: string) {
    return await this.nhost.auth.resetPassword({ email });
  }

}
