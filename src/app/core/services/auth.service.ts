import { Injectable } from '@angular/core';
import { NhostClient } from '@nhost/nhost-js';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private nhost = new NhostClient({
    subdomain: environment.nhostSubdomain,
    region: environment.nhostRegion
  });

  private userSubject = new BehaviorSubject<any>(null);
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);

  public user$: Observable<any> = this.userSubject.asObservable();
  public isLoggedIn$: Observable<boolean> = this.isLoggedInSubject.asObservable();

  constructor() {
    // Initialize with existing session if available
    const session = this.nhost.auth.getSession();
    if (session?.user) {
      this.userSubject.next(session.user);
    }

    // Listen for auth state changes (no type annotations to avoid conflicts)
    this.nhost.auth.onAuthStateChanged((event, session) => {
      this.userSubject.next(session?.user || null);
    });
  }

  async signUp(email: string, password: string, displayName?: string) {
    const { session, error } = await this.nhost.auth.signUp({
      email,
      password,
      options: displayName ? { displayName } : undefined
    });

    if (error) {
      throw new Error(error.message);
    }

    return { session, error };
  }

  async signIn(email: string, password: string) {
    const { session, error } = await this.nhost.auth.signIn({
      email,
      password
    });

    if (error) {
      throw new Error(error.message);
    }

    return { session, error };
  }

  async signOut() {
    const { error } = await this.nhost.auth.signOut();
    if (error) {
      console.error('Sign out error:', error);
    }
  }

  isAuthenticated(): boolean {
    return this.nhost.auth.isAuthenticated();
  }

  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getUser() {
    return this.userSubject.value;
  }

  getAccessToken(): string | null {
    return this.nhost.auth.getAccessToken() || null;
  }

  async refreshToken() {
    return await this.nhost.auth.refreshSession();
  }
}
