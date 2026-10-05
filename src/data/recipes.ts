import { Recipe } from '../types/recipe';

/**
 * DATA RESEP (Array of Objects)
 *
 * Semua data resep disimpan di satu file agar mudah dibaca dan mudah
 * dimodifikasi saat demo (tambah / hapus resep, ganti jumlah like, dll).
 */
export const recipes: Recipe[] = [
  {
    id: 1,
    title: 'Seblak Bandung',
    author: 'Amanda',
    description:
      'Seblak pedas khas Bandung dengan kerupuk, telur, dan berbagai topping.',
    category: 'Makanan',
    cookTime: 25,
    difficulty: 'Mudah',
    likes: 120,
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  },
  {
    id: 2,
    title: 'Nasi Goreng Spesial',
    author: 'Szoboszlai',
    description: 'Nasi goreng sederhana dengan telur, ayam, dan bayam.',
    category: 'Makanan',
    cookTime: 15,
    difficulty: 'Mudah',
    likes: 95,
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
  },
  {
    id: 3,
    title: 'Ayam Geprek',
    author: 'Sinta',
    description: 'Ayam goreng crispy dengan sambal geprek yang pedasnya nagih.',
    category: 'Makanan',
    cookTime: 30,
    difficulty: 'Sedang',
    likes: 210,
    image: 'https://images.unsplash.com/photo-1562967916-eb82221dfb92?w=800',
  },
  {
    id: 4,
    title: 'Pancake Cokelat',
    author: 'Dewi',
    description: 'Pancake lembut dengan saus cokelat manis di atasnya.',
    category: 'Dessert',
    cookTime: 20,
    difficulty: 'Mudah',
    likes: 150,
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800',
  },
  {
    id: 5,
    title: 'Es Teh Lemon',
    author: 'Budi',
    description: 'Es teh lemon segar dengan potongan limau dan es batu.',
    category: 'Minuman',
    cookTime: 10,
    difficulty: 'Mudah',
    likes: 75,
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
  },
  {
    id: 6,
    title: 'Kentang Goreng',
    author: 'Nanda',
    description: 'Kentang goreng renyah dengan saus sambal pedas.',
    category: 'Snack',
    cookTime: 20,
    difficulty: 'Mudah',
    likes: 88,
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800',
  },
];