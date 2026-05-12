import { useState, useEffect } from 'react';
import { auth, db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp, query, getDocs } from 'firebase/firestore';
import { toast } from 'react-hot-toast';

const SEED_PRODUCTS = [
  {
    name: 'Minimalist Velvet Sofa',
    price: 12500000,
    category: 'living',
    description: 'A luxurious velvet sofa designed for modern apartments. Features deep seating and premium fabric.',
    stock: 15,
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200'],
    rating: 4.8,
  },
  {
    name: 'Walnut Dining Table',
    price: 8900000,
    category: 'dining',
    description: 'Solid walnut dining table with a natural oil finish. Comfortably seats six.',
    stock: 8,
    images: ['https://images.unsplash.com/photo-1577140915160-1771585449d1?auto=format&fit=crop&q=80&w=1200'],
    rating: 4.9,
  },
  {
    name: 'Industrial Bookcase',
    price: 3450000,
    category: 'office',
    description: 'A robust blend of steel and reclaimed wood. Perfect for your home library or office.',
    stock: 20,
    images: ['https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=1200'],
    rating: 4.7,
  },
  {
    name: 'Linen Accent Chair',
    price: 2400000,
    category: 'living',
    description: 'Ergonomic accent chair upholstered in breathable linen. Modern oak legs.',
    stock: 30,
    images: ['https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=1200'],
    rating: 4.5,
  },
  {
    name: 'Abstract Silk Rug',
    price: 5200000,
    category: 'living',
    description: 'Hand-woven silk rug with a contemporary abstract pattern. Soft sheen texture.',
    stock: 12,
    images: ['https://images.unsplash.com/photo-1576016773942-3344d5cf31f7?auto=format&fit=crop&q=80&w=1200'],
    rating: 4.9,
  },
  {
    name: 'Teak Bed Frame',
    price: 9800000,
    category: 'bedroom',
    description: 'Premium teak wood bed frame with a minimalist silhouette. Includes slatted base.',
    stock: 5,
    images: ['https://images.unsplash.com/photo-1505691938895-1758d7eaa511?auto=format&fit=crop&q=80&w=1200'],
    rating: 5.0,
  }
];

export async function seedProducts() {
  const q = query(collection(db, 'products'));
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    console.log("Seeding database with products...");
    for (const product of SEED_PRODUCTS) {
      await addDoc(collection(db, 'products'), {
        ...product,
        createdAt: serverTimestamp(),
      });
    }
    toast.success('Database seeded with premium items.');
  }
}
