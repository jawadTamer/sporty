import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { map, take } from 'rxjs/operators';
import { of } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  return authService.currentUser$.pipe(
    take(1),
    map((user) => {
      if (user && user.uid) {
        return true;
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
