import { Injectable } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  user,
  deleteUser,
  onAuthStateChanged,
} from '@angular/fire/auth';
import {
  Firestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from '@angular/fire/firestore';
import {
  Observable,
  map,
  switchMap,
  of,
  from,
  BehaviorSubject,
  take,
} from 'rxjs';

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user';
  displayName?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();
  private isAuthInitializing = new BehaviorSubject<boolean>(true);
  isAuthInitializing$ = this.isAuthInitializing.asObservable();

  constructor(private firestore: Firestore, private auth: Auth) {
    onAuthStateChanged(this.auth, (user) => {
      if (user) {
        this.currentUserSubject.next({
          uid: user.uid,
          email: user.email!,
          role: 'user',
          displayName: user.displayName,
        });
      } else {
        this.currentUserSubject.next(null);
      }
      this.isAuthInitializing.next(false);
    });
  }

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
    return this.currentUser$.pipe(
      switchMap((user) => {
        if (!user) return of(false);
        return from(getDoc(doc(this.firestore, 'users', user.uid))).pipe(
          map((docSnap) => {
            if (!docSnap.exists()) return false;
            const userData = docSnap.data() as User;
            return userData.role === 'admin';
          })
        );
      })
    );
  }

  getAllUsers(): Observable<User[]> {
    return from(getDocs(collection(this.firestore, 'users'))).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map((doc) => doc.data() as User)
      )
    );
  }

  async getCurrentUser(): Promise<any> {
    return this.auth.currentUser;
  }

  async deleteUser(uid: string): Promise<void> {
    try {
      // Delete user document from Firestore
      await deleteDoc(doc(this.firestore, 'users', uid));

      // Note: Deleting the actual Firebase Auth user requires admin privileges
      // and should be done server-side for security reasons
      // This method only deletes the user document from Firestore
    } catch (error) {
      throw error;
    }
  }

  async updateUserRole(uid: string, newRole: 'user' | 'admin'): Promise<void> {
    try {
      const userRef = doc(this.firestore, 'users', uid);
      await setDoc(userRef, { role: newRole }, { merge: true });
    } catch (error) {
      throw error;
    }
  }
}
