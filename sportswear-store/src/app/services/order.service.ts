import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from '@angular/fire/firestore';
import { Observable, from, map } from 'rxjs';
import { CartItem } from './cart.service';

export interface Order {
  id?: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    phone: string;
  };
  createdAt: any;
  updatedAt: any;
}

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private firestore: Firestore) {}

  async createOrder(
    orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<string> {
    try {
      const order = {
        ...orderData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(collection(this.firestore, 'orders'), order);
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  getAllOrders(): Observable<Order[]> {
    return from(getDocs(collection(this.firestore, 'orders'))).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Order)
        )
      )
    );
  }

  getOrdersByUser(userId: string): Observable<Order[]> {
    const q = query(
      collection(this.firestore, 'orders'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return from(getDocs(q)).pipe(
      map((querySnapshot) =>
        querySnapshot.docs.map(
          (doc) => ({ id: doc.id, ...doc.data() } as Order)
        )
      )
    );
  }

  async updateOrderStatus(
    orderId: string,
    status: Order['status']
  ): Promise<void> {
    try {
      await updateDoc(doc(this.firestore, 'orders', orderId), {
        status,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      throw error;
    }
  }

  getOrderById(orderId: string): Observable<Order | null> {
    return from(getDocs(collection(this.firestore, 'orders'))).pipe(
      map((querySnapshot) => {
        const orderDoc = querySnapshot.docs.find((doc) => doc.id === orderId);
        return orderDoc
          ? ({ id: orderDoc.id, ...orderDoc.data() } as Order)
          : null;
      })
    );
  }
}
