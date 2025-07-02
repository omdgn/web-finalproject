export interface Hotel {
  id: string;
  name: string;
  price: number;
  rating: number;
  commentCount: number;
  city: string;
  country: string;
  imageUrl: string;
  galleryImages?: string[];
  amenities: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  discount?: {
    percentage: number;
    originalPrice: number;
  };
  comments: Comment[];
  availableForWeekend: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
  user: {
    name: string;
  };
}
