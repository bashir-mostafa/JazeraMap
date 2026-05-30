// src/mock/data.ts
export const categories = [
  { id: 'all', name: 'الكل', icon: '📍' },
  { id: 'restaurants', name: 'مطاعم', icon: '🍽️' },
  { id: 'cafes', name: 'مقاهي', icon: '☕' },
  { id: 'shopping', name: 'تسوق', icon: '🛍️' },
  { id: 'entertainment', name: 'ترفيه', icon: '🎬' },
  { id: 'hotels', name: 'فنادق', icon: '🏨' },
];

export const mockPlaces = [
  {
    id: '1',
    name: 'مطعم الأندلس',
    category: 'مطاعم',
    rating: 4.8,
    reviews: 234,
    image: 'https://picsum.photos/id/20/400/300',
    address: 'الرياض، المملكة العربية السعودية',
  },
  {
    id: '2',
    name: 'مقهى ستاربكس',
    category: 'مقاهي',
    rating: 4.5,
    reviews: 189,
    image: 'https://picsum.photos/id/22/400/300',
    address: 'جدة، المملكة العربية السعودية',
  },
  {
    id: '3',
    name: 'الزاوية مول',
    category: 'تسوق',
    rating: 4.7,
    reviews: 567,
    image: 'https://picsum.photos/id/24/400/300',
    address: 'الدمام، المملكة العربية السعودية',
  },
  // أضف المزيد من الأماكن...
];