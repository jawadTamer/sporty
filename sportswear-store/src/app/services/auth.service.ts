import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
} from '@angular/fire/auth';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';
import { Observable, map } from 'rxjs';

export interface User {
  uid: string;
  email: string;
  role: 'user' | 'admin';
  displayName?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user$ = user(this.auth);

  constructor(private auth: Auth, private firestore: Firestore) {}

  async signUp(
    email: string,
    password: string,
    displayName: string
  ): Promise<void> {
    try {
      const credential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password
      );
      const user: User = {
        uid: credential.user.uid,
        email: credential.user.email!,
        role: 'user',
        displayName,
      };

      await setDoc(doc(this.firestore, 'users', credential.user.uid), user);
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      await signInWithEmailAndPassword(this.auth, email, password);
    } catch (error) {
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      throw error;
    }
  }

  getUserRole(uid: string): Observable<'user' | 'admin' | null> {
    return new Observable((observer) => {
      getDoc(doc(this.firestore, 'users', uid))
        .then((docSnap) => {
          if (docSnap.exists()) {
            const userData = docSnap.data() as User;
            observer.next(userData.role);
          } else {
            observer.next(null);
          }
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  isAdmin(): Observable<boolean> {
    return this.user$.pipe(
      map((user) => {
        if (!user) return false;
        return user.email === 'admin@sportswear.com'; // You can change this logic
      })
    );
  }
}
