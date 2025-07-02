import { Comment } from '../models/hotel.model';

export const MOCK_COMMENTS: Comment[] = [
  // Grand Istanbul Palace comments
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
  },
  {
    id: 'comment-9',
    userId: 'user-6',
    userName: 'Elif Yıldız',
    rating: 5,
    text: 'Personel çok ilgili ve güler yüzlü. Tekrar tercih ederim.',
    date: '2024-12-05',
            user: {
          name: 'Selin Özkan'
        }
  },
  
  // Ankara Business Hotel comments
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
  },
  {
    id: 'comment-10',
    userId: 'user-7',
    userName: 'Oğuz Kaan',
    rating: 4,
    text: 'Merkezi konumda, toplantı salonları çok kullanışlı.',
    date: '2024-12-03',
            user: {
          name: 'Selin Özkan'
        }
  },
  
  // Izmir Seaside Resort comments
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
  },
  {
    id: 'comment-11',
    userId: 'user-1',
    userName: 'Ahmet Yılmaz',
    rating: 5,
    text: 'Plaj temiz, aktiviteler çeşitli. Aile için harika.',
    date: '2024-12-01',
            user: {
          name: 'Selin Özkan'
        }
  },
  
  // Antalya Luxury Resort comments
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
  },
  {
    id: 'comment-12',
    userId: 'user-2',
    userName: 'Fatma Kaya',
    rating: 5,
    text: 'Otel gerçekten çok lüks, hizmet kalitesi mükemmel.',
    date: '2024-12-07',
            user: {
          name: 'Selin Özkan'
        }
  },
  {
    id: 'comment-13',
    userId: 'user-4',
    userName: 'Zeynep Demir',
    rating: 4,
    text: 'Yemekler çok lezzetli, çocuk kulübü harika.',
    date: '2024-12-02',
            user: {
          name: 'Selin Özkan'
        }
  },
  
  // Bursa Mountain Lodge comments
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
  },
  {
    id: 'comment-14',
    userId: 'user-3',
    userName: 'Mehmet Öz',
    rating: 4,
    text: 'Şehir stresinden uzaklaşmak için ideal.',
    date: '2024-12-06',
            user: {
          name: 'Selin Özkan'
        }
  },
  
  // Cappadocia Cave Hotel comments
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
  },
  {
    id: 'comment-15',
    userId: 'user-5',
    userName: 'Can Arslan',
    rating: 5,
    text: 'Balon turu unutulmaz bir deneyimdi! Otel de çok güzel.',
    date: '2024-12-04',
            user: {
          name: 'Selin Özkan'
        }
  },
  {
    id: 'comment-16',
    userId: 'user-1',
    userName: 'Ahmet Yılmaz',
    rating: 4,
    text: 'Otantik bir deneyim, mağara odaları çok ilginç.',
    date: '2024-11-28',
            user: {
          name: 'Selin Özkan'
        }
  }
];
