import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Hotel } from '../models/hotel.model';
import { MOCK_HOTELS } from '../mock/hotels.mock';

@Injectable({
  providedIn: 'root'
})
export class HotelService {
  private readonly API_URL = 'https://web-finalproject-ub2x.onrender.com';

  constructor(private http: HttpClient) { }

  // Map API response to Hotel model
  private mapApiHotelToModel(apiHotel: any): Hotel {
    const originalPrice = parseFloat(apiHotel.price_per_night);
    const memberPrice = apiHotel.memberPrice || originalPrice;
    
    return {
      id: apiHotel.id.toString(),
      name: apiHotel.name,
      city: apiHotel.city,
      country: apiHotel.country,
      price: memberPrice,
      rating: apiHotel.averageRating || 0,
      commentCount: apiHotel.commentCount || 0,
      imageUrl: apiHotel.hotel_image_url || '',
      galleryImages: apiHotel.hotel_image_url ? [apiHotel.hotel_image_url] : [],
      amenities: apiHotel.amenities || [],
      coordinates: {
        lat: parseFloat(apiHotel.y_latitude) || 0,
        lng: parseFloat(apiHotel.x_longitude) || 0
      },
      discount: apiHotel.discount_percentage > 0 ? {
        percentage: apiHotel.discount_percentage,
        originalPrice: originalPrice
      } : undefined,
      comments: apiHotel.comments || [],
      availableForWeekend: true
    };
  }

  // Get all hotels
  getAllHotels(): Observable<Hotel[]> {
    return this.http.get<any[]>(`${this.API_URL}/hotels`)
      .pipe(
        map((response: any[]) => {
          return response.map(hotel => this.mapApiHotelToModel(hotel));
        }),
        catchError((error) => {
          console.error('Get all hotels error:', error);
          // Fallback to mock data in case of error
          return of(MOCK_HOTELS).pipe(delay(500));
        })
      );
  }

  // Get hotels by city (using search API)
  getHotelsByCity(city: string): Observable<Hotel[]> {
    // For city search, we need to provide default dates
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const startDate = today.toISOString().split('T')[0];
    const endDate = tomorrow.toISOString().split('T')[0];

    return this.searchHotels({
      city: city,
      startDate: startDate,
      endDate: endDate
    });
  }

  // Get hotel by ID
  getHotelById(id: string): Observable<Hotel | undefined> {
    return this.http.get<any>(`${this.API_URL}/hotels/${id}`)
      .pipe(
        map((response: any) => {
          return this.mapApiHotelToModel(response);
        }),
        catchError((error) => {
          console.error('Get hotel by ID error:', error);
          // Fallback to mock data in case of error
          const hotel = MOCK_HOTELS.find(hotel => hotel.id === id);
          return of(hotel).pipe(delay(300));
        })
      );
  }

  // Get hotels by country (using local filtering from all hotels)
  getHotelsByCountry(country: string): Observable<Hotel[]> {
    return this.getAllHotels()
  }

  // Get available hotels for weekend (using search API for next weekend)
  getAvailableHotelsForWeekend(): Observable<Hotel[]> {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // Calculate next Friday and Sunday
    const daysUntilFriday = (5 - dayOfWeek + 7) % 7;
    const nextFriday = new Date(today);
    nextFriday.setDate(today.getDate() + (daysUntilFriday === 0 ? 7 : daysUntilFriday));
    
    const nextSunday = new Date(nextFriday);
    nextSunday.setDate(nextFriday.getDate() + 2);
    
    const startDate = nextFriday.toISOString().split('T')[0];
    const endDate = nextSunday.toISOString().split('T')[0];

    return this.searchHotels({
      startDate: startDate,
      endDate: endDate
    });
  }

  // Search hotels with filters (using API)
  searchHotels(filters: {
    city?: string;
    startDate?: string;
    endDate?: string;
    guestNumber?: number;
    minPrice?: number;
    maxPrice?: number;
  }): Observable<Hotel[]> {
    // For the API search, startDate and endDate are required
    if (!filters.startDate || !filters.endDate) {
      // If dates are not provided, fallback to local filtering
      return this.searchHotelsLocal({
        city: filters.city,
        availableForWeekend: false,
        sortByRating: false,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice
      });
    }

    let params = new HttpParams();
    if (filters.city) params = params.set('city', filters.city);
    if (filters.startDate) params = params.set('startDate', filters.startDate);
    if (filters.endDate) params = params.set('endDate', filters.endDate);
    if (filters.guestNumber) params = params.set('guestNumber', filters.guestNumber.toString());
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());

    return this.http.get<any[]>(`${this.API_URL}/hotels/search`, { params })
      .pipe(
        map((response: any[]) => {
          return response.map(hotel => this.mapApiHotelToModel(hotel));
        }),
        catchError((error) => {
          console.error('Search hotels error:', error);
          // Fallback to mock data search
          return this.searchHotelsLocal({
            city: filters.city,
            availableForWeekend: false,
            sortByRating: false,
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice
          });
        })
      );
  }

  // Search hotels with filters (local/mock version)
  searchHotelsLocal(filters: {
    city?: string;
    country?: string;
    availableForWeekend?: boolean;
    sortByRating?: boolean;
    minPrice?: number;
    maxPrice?: number;
  }): Observable<Hotel[]> {
    let filteredHotels = [...MOCK_HOTELS];

    if (filters.city) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.city.toLowerCase().includes(filters.city!.toLowerCase())
      );
    }

    if (filters.country) {
      filteredHotels = filteredHotels.filter(hotel => 
        hotel.country.toLowerCase() === filters.country!.toLowerCase()
      );
    }

    if (filters.availableForWeekend) {
      filteredHotels = filteredHotels.filter(hotel => hotel.availableForWeekend);
    }

    if (filters.minPrice !== undefined) {
      filteredHotels = filteredHotels.filter(hotel => hotel.price >= filters.minPrice!);
    }

    if (filters.maxPrice !== undefined) {
      filteredHotels = filteredHotels.filter(hotel => hotel.price <= filters.maxPrice!);
    }

    if (filters.sortByRating) {
      filteredHotels.sort((a, b) => b.rating - a.rating);
    }

    return of(filteredHotels).pipe(delay(500));
  }

  // Get featured hotels (high rating) - using all hotels and filtering locally
  getFeaturedHotels(): Observable<Hotel[]> {
    return this.getAllHotels().pipe(
      map(hotels => hotels
        .filter(hotel => hotel.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
      )
    );
  }

  // Get hotels with discounts - using all hotels and filtering locally
  getHotelsWithDiscounts(): Observable<Hotel[]> {
    return this.getAllHotels().pipe(
      map(hotels => hotels.filter(hotel => hotel.discount && hotel.discount.percentage > 0))
    );
  }
}
