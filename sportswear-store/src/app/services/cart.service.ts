import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Product } from './product.service';
import { AuthService } from './auth.service';
import { Firestore, doc, setDoc, getDoc } from '@angular/fire/firestore';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  cart$ = this.cartSubject.asObservable();
  private userId: string | null = null;
  private userEmail: string | null = null;
  private userSub: Subscription;

  constructor(private authService: AuthService, private firestore: Firestore) {
    this.userSub = this.authService.currentUser$.subscribe(async (user) => {
      if (user && user.uid) {
        this.userId = user.uid;
        this.userEmail = user.email || null;
        const cart = await this.loadCartFromFirestore();
        this.cartSubject.next(cart);
      } else {
        this.userId = null;
        this.userEmail = null;
        this.cartSubject.next([]);
      }
    });
  }

  private async loadCartFromFirestore(): Promise<CartItem[]> {
    if (!this.userId) return [];
    const cartDoc = await getDoc(doc(this.firestore, 'carts', this.userId));
    if (cartDoc.exists()) {
      const data = cartDoc.data();
      return data['items'] || [];
    }
    return [];
  }

  private async saveCartToFirestore(cart: CartItem[]) {
    if (!this.userId || !this.userEmail) return;
    const data = {
      userId: this.userId,
      userEmail: this.userEmail,
      items: cart,
      updatedAt: new Date(),
    };
    await setDoc(doc(this.firestore, 'carts', this.userId), data);
  }

  getCart(): CartItem[] {
    return this.cartSubject.value;
  }

  async addToCart(product: Product, quantity: number = 1) {
    if (!this.userId) return;
    const cart = [...this.getCart()];
    const idx = cart.findIndex((item) => item.product.id === product.id);
    if (idx > -1) {
      cart[idx].quantity += quantity;
    } else {
      cart.push({ product, quantity });
    }
    this.cartSubject.next(cart);
    await this.saveCartToFirestore(cart);
  }

  async updateQuantity(productId: string, quantity: number) {
    if (!this.userId) return;
    const cart = [...this.getCart()];
    const idx = cart.findIndex((item) => item.product.id === productId);
    if (idx > -1) {
      cart[idx].quantity = quantity;
      if (cart[idx].quantity <= 0) cart.splice(idx, 1);
      this.cartSubject.next(cart);
      await this.saveCartToFirestore(cart);
    }
  }

  async removeItem(productId: string) {
    if (!this.userId) return;
    const cart = this.getCart().filter((item) => item.product.id !== productId);
    this.cartSubject.next(cart);
    await this.saveCartToFirestore(cart);
  }

  async clearCart() {
    if (!this.userId) return;
    this.cartSubject.next([]);
    await this.saveCartToFirestore([]);
  }

  getTotal(): number {
    return this.getCart().reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
}
