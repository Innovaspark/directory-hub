// user-state.service.ts - Now orchestrates auth
import { Injectable, signal, computed, inject } from '@angular/core';
import { BehaviorSubject, map, distinctUntilChanged } from 'rxjs';
import {AuthService} from '@core/services/auth.service';
import {NavigationService} from '@core/services/navigation.service';

export interface User {
  id: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  emailVerified: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserStateService {
  private authService = inject(AuthService);
  private userSignal = signal<User | null>(null);
  private navigationService = inject(NavigationService);

  // Add subject alongside signal - don't change anything else
  private userSubject = new BehaviorSubject<User | null>(null);
  public isLoggedIn$ = this.userSubject.pipe(
    map(user => !!user),
    distinctUntilChanged()
  );

  // Public readonly signals - unchanged
  public $user = this.userSignal.asReadonly();
  public $isLoggedIn = computed(() => !!this.userSignal());
  public $displayName = computed(() => {
    const user = this.userSignal();
    return user?.displayName || user?.email?.split('@')[0] || '';
  });
  public $userInitials = computed(() => {
    const user = this.userSignal();
    if (!user) return '';

    if (user.displayName) {
      return user.displayName.split(' ')
        .map(name => name.charAt(0))
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }

    return user.email.charAt(0).toUpperCase();
  });
  public $email = computed(() => this.userSignal()?.email || '');
  public $avatarUrl = computed(() => this.userSignal()?.avatarUrl);

  constructor() {
    this.initializeFromSession();
    this.setupAuthStateListener();
  }

  private initializeFromSession() {
    const session = this.authService.getSession();
    if (session?.user) {
      this.updateUser(this.mapNhostUser(session.user));
    }
  }

  private setupAuthStateListener() {
    this.authService.onAuthStateChanged((event, session) => {
      const user = session?.user || null;
      if (user) {
        this.updateUser(this.mapNhostUser(user));
      } else {
        this.updateUser(null);
      }
    });
  }

  // Helper method to update both signal and subject
  private updateUser(user: User | null) {
    this.userSignal.set(user);
    this.userSubject.next(user);
  }

  private mapNhostUser(nhostUser: any): User {
    return {
      id: nhostUser.id,
      email: nhostUser.email,
      displayName: nhostUser.displayName || nhostUser.metadata?.displayName,
      avatarUrl: nhostUser.avatarUrl || nhostUser.metadata?.avatarUrl,
      emailVerified: nhostUser.emailVerified,
      createdAt: nhostUser.createdAt,
    };
  }

  // Auth operations
  async signUp(email: string, password: string, displayName?: string) {
    const { session, error } = await this.authService.signUp(email, password, displayName);

    if (error) {
      throw new Error(error.message);
    }

    if (session?.user) {
      this.updateUser(this.mapNhostUser(session.user));
    }

    return { session, error };
  }

  async signIn(email: string, password: string) {
    const { session, error } = await this.authService.signIn(email, password);

    if (error) {
      throw new Error(error.message);
    }

    if (session?.user) {
      this.updateUser(this.mapNhostUser(session.user));
    }

    return { session, error };
  }

  async signOut() {
    await this.authService.signOut();
    this.updateUser(null);
    this.navigationService.navigateToHome();
  }

  // Convenience methods
  getCurrentUser(): User | null {
    return this.userSignal();
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getAccessToken(): string | null {
    return this.authService.getAccessToken();
  }

  async refreshToken() {
    return await this.authService.refreshToken();
  }
}
