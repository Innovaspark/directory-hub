import { Injectable, signal, computed } from '@angular/core';
import { NhostClient } from '@nhost/nhost-js';
import {BehaviorSubject, map, Observable} from 'rxjs';
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
  private userSignal = signal<any>(null);

  // Observables for existing code
  public user$: Observable<any> = this.userSubject.asObservable();
  public isLoggedIn$: Observable<boolean> = this.userSubject.pipe(
    map(user => !!user)
  );

  // Signals for modern Angular
  public $user = this.userSignal.asReadonly();
  public $isLoggedIn = computed(() => !!this.userSignal());

  constructor() {
    this.initializeAuth();
    this.setupAuthStateListener();
  }

  private initializeAuth() {
    const session = this.nhost.auth.getSession();
    if (session?.user) {
      this.updateUser(session.user);
    }
  }

  private setupAuthStateListener() {
    this.nhost.auth.onAuthStateChanged((event, session) => {
      const user = session?.user || null;
      this.updateUser(user);
    });
  }

  private updateUser(user: any) {
    this.userSubject.next(user);
    this.userSignal.set(user);
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

    if (session?.user) {
      this.updateUser(session.user);
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

    if (session?.user) {
      this.updateUser(session.user);
    }

    return { session, error };
  }

  async signOut() {
    const { error } = await this.nhost.auth.signOut();
    this.updateUser(null);

    if (error) {
      console.error('Sign out error:', error);
    }
  }

  isAuthenticated(): boolean {
    return this.nhost.auth.isAuthenticated();
  }

  isLoggedIn(): boolean {
    return !!this.userSignal();
  }

  getUser() {
    return this.userSignal();
  }

  getAccessToken(): string | null {
    return this.nhost.auth.getAccessToken() || null;
  }

  async refreshToken() {
    return await this.nhost.auth.refreshSession();
  }
}
