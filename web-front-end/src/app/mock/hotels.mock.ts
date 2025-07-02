import { Hotel } from '../models/hotel.model';

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'hotel-1',
    name: 'Grand Istanbul Palace',
    price: 1200,
    rating: 4.8,
    commentCount: 324,
    city: 'Istanbul',
    country: 'Turkey',
    imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Restaurant', 'Gym', 'Room Service', 'Airport Shuttle'],
    coordinates: {
      lat: 41.0082,
      lng: 28.9784
    },
    discount: {
      percentage: 15,
      originalPrice: 1400
    },
    comments: [
      {
        id: 'comment-1',
        userId: 'user-1',
        userName: 'Ahmet Yılmaz',
        rating: 5,
        text: 'Mükemmel bir otel! Hizmet kalitesi harika, oda temizliği çok iyi.',
        date: '2024-12-15',
                user: {
          name: 'Selin Özkan'
        }
      },
      {
        id: 'comment-2',
        userId: 'user-2',
        userName: 'Fatma Kaya',
        rating: 4,
        text: 'Konum çok güzel, İstanbul manzarası harika. Kahvaltı zengin.',
        date: '2024-12-10',
                user: {
          name: 'Selin Özkan'
        }
      }
    ],
    availableForWeekend: true
  },
  {
    id: 'hotel-2',
    name: 'Ankara Business Hotel',
    price: 800,
    rating: 4.2,
    commentCount: 156,
    city: 'Ankara',
    country: 'Turkey',
    imageUrl: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    amenities: ['Free WiFi', 'Business Center', 'Restaurant', 'Gym', 'Meeting Rooms'],
    coordinates: {
      lat: 39.9334,
      lng: 32.8597
    },
    comments: [
      {
        id: 'comment-3',
        userId: 'user-3',
        userName: 'Mehmet Öz',
        rating: 4,
        text: 'İş seyahati için ideal. Temiz ve konforlu.',
        date: '2024-12-08',
                user: {
          name: 'Selin Özkan'
        }
      }
    ],
    availableForWeekend: true
  },
  {
    id: 'hotel-3',
    name: 'Izmir Seaside Resort',
    price: 950,
    rating: 4.6,
    commentCount: 289,
    city: 'Izmir',
    country: 'Turkey',
    imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    amenities: ['Free WiFi', 'Beach Access', 'Pool', 'Spa', 'Restaurant', 'Bar'],
    coordinates: {
      lat: 38.4237,
      lng: 27.1428
    },
    discount: {
      percentage: 20,
      originalPrice: 1190
    },
    comments: [
      {
        id: 'comment-4',
        userId: 'user-4',
        userName: 'Zeynep Demir',
        rating: 5,
        text: 'Deniz manzarası muhteşem! Spa hizmetleri çok kaliteli.',
        date: '2024-12-12',
                user: {
          name: 'Selin Özkan'
        }
      },
      {
        id: 'comment-5',
        userId: 'user-5',
        userName: 'Can Arslan',
        rating: 4,
        text: 'Havuz alanı çok güzel, çocuklar çok eğlendi.',
        date: '2024-12-09',
                user: {
          name: 'Selin Özkan'
        }
      }
    ],
    availableForWeekend: true
  },
  {
    id: 'hotel-4',
    name: 'Antalya Luxury Resort',
    price: 1800,
    rating: 4.9,
    commentCount: 512,
    city: 'Antalya',
    country: 'Turkey',
    imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    amenities: ['Free WiFi', 'Private Beach', 'Multiple Pools', 'Spa', 'Fine Dining', 'Kids Club', 'Water Sports'],
    coordinates: {
      lat: 36.8969,
      lng: 30.7133
    },
    comments: [
      {
        id: 'comment-6',
        userId: 'user-6',
        userName: 'Elif Yıldız',
        rating: 5,
        text: 'Lüks bir tatil için mükemmel! Her şey harika.',
        date: '2024-12-14',
                user: {
          name: 'Selin Özkan'
        }
      }
    ],
    availableForWeekend: true
  },
  {
    id: 'hotel-5',
    name: 'Bursa Mountain Lodge',
    price: 600,
    rating: 4.1,
    commentCount: 87,
    city: 'Bursa',
    country: 'Turkey',
    imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    amenities: ['Free WiFi', 'Mountain View', 'Restaurant', 'Hiking Trails', 'Fireplace'],
    coordinates: {
      lat: 40.1826,
      lng: 29.0669
    },
    comments: [
      {
        id: 'comment-7',
        userId: 'user-7',
        userName: 'Oğuz Kaan',
        rating: 4,
        text: 'Doğa içinde huzurlu bir konaklama.',
        date: '2024-12-11',
                user: {
          name: 'Selin Özkan'
        }
      }
    ],
    availableForWeekend: false
  },
  {
    id: 'hotel-6',
    name: 'Cappadocia Cave Hotel',
    price: 1100,
    rating: 4.7,
    commentCount: 203,
    city: 'Nevsehir',
    country: 'Turkey',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
    amenities: ['Free WiFi', 'Cave Rooms', 'Terrace', 'Restaurant', 'Hot Air Balloon Tours', 'Traditional Spa'],
    coordinates: {
      lat: 38.6431,
      lng: 34.8289
    },
    discount: {
      percentage: 10,
      originalPrice: 1220
    },
    comments: [
      {
        id: 'comment-8',
        userId: 'user-8',
        userName: 'Selin Özkan',
        rating: 5,
        text: 'Kapadokya deneyimi için harika bir otel! Mağara odaları çok özel.',
        date: '2024-12-13',
        user: {
          name: 'Selin Özkan'
        }
      }
    ],
    availableForWeekend: true
  }
];
