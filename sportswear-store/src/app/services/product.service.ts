import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

export interface Product {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  sizes: string[];
  colors: string[];
  inStock: boolean;
  createdAt: Date;
  selectedSize?: string;
  selectedColor?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private firestore: Firestore) {}

  async addProduct(
    product: Omit<Product, 'id' | 'createdAt'>
  ): Promise<string> {
    try {
      const productData = {
        ...product,
        createdAt: new Date(),
      };
      const docRef = await addDoc(
        collection(this.firestore, 'products'),
        productData
      );
      return docRef.id;
    } catch (error) {
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      const querySnapshot = await getDocs(
        collection(this.firestore, 'products')
      );
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      throw error;
    }
  }

  async getProductById(id: string): Promise<Product | null> {
    try {
      const docSnap = await getDoc(doc(this.firestore, 'products', id));
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data(),
        } as Product;
      }
      return null;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(id: string, product: Partial<Product>): Promise<void> {
    try {
      await updateDoc(doc(this.firestore, 'products', id), product);
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(id: string): Promise<void> {
    try {
      await deleteDoc(doc(this.firestore, 'products', id));
    } catch (error) {
      throw error;
    }
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    try {
      const q = query(
        collection(this.firestore, 'products'),
        where('category', '==', category)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Product[];
    } catch (error) {
      throw error;
    }
  }
}
