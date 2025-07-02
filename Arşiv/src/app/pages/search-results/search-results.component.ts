import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { AuthService } from '../../services/auth.service';
import { HotelService } from '../../services/hotel.service';
import { User } from '../../models/user.model';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [CommonModule, RouterModule, GoogleMapsModule],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent implements OnInit {
  currentUser: User | null = null;
  hotels: Hotel[] = [];
  loading = false;
  showMapView = false;
  searchParams: any = {};

  // Google Maps properties
  mapOptions: google.maps.MapOptions = {
    center: { lat: 39.9334, lng: 32.8597 }, // Turkey center
    zoom: 6,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    styles: [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ]
  };
  
  markerOptions: google.maps.MarkerOptions = {
    draggable: false
  };

  hotelMarkers: { position: google.maps.LatLngLiteral; hotel: Hotel }[] = [];

  constructor(
    private authService: AuthService,
    private hotelService: HotelService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    // Get search parameters from query params
    this.route.queryParams.subscribe(params => {
      this.searchParams = params;
      this.searchHotels();
    });
  }

  searchHotels(): void {
    this.loading = true;

    // Check if we have the required parameters for API search
    if (this.searchParams.checkInDate && this.searchParams.checkOutDate) {
      // Use the API search endpoint with required parameters
      const filters = {
        city: this.searchParams.city || undefined,
        startDate: this.searchParams.checkInDate,
        endDate: this.searchParams.checkOutDate,
        guestNumber: this.searchParams.guestCount ? parseInt(this.searchParams.guestCount) : undefined,
        minPrice: this.searchParams.minPrice ? parseFloat(this.searchParams.minPrice) : undefined,
        maxPrice: this.searchParams.maxPrice ? parseFloat(this.searchParams.maxPrice) : undefined
      };

      this.hotelService.searchHotels(filters).subscribe(hotels => {
        this.hotels = hotels.sort((a, b) => b.rating - a.rating); // Sort by rating
        this.updateMapMarkers();
        this.loading = false;
      });
    } else if (this.searchParams.city || this.searchParams.minPrice || this.searchParams.maxPrice) {
      // If no dates but other filters are provided, use local search
      const filters = {
        city: this.searchParams.city || undefined,
        minPrice: this.searchParams.minPrice ? parseFloat(this.searchParams.minPrice) : undefined,
        maxPrice: this.searchParams.maxPrice ? parseFloat(this.searchParams.maxPrice) : undefined,
        availableForWeekend: false,
        sortByRating: true
      };

      this.hotelService.searchHotelsLocal(filters).subscribe(hotels => {
        this.hotels = hotels;
        this.updateMapMarkers();
        this.loading = false;
      });
    } else {
      // Fallback to all hotels or user's country hotels
      if (this.currentUser?.country) {
        this.hotelService.getHotelsByCountry(this.currentUser.country).subscribe(hotels => {
          this.hotels = hotels.sort((a, b) => b.rating - a.rating); // Sort by rating
          this.updateMapMarkers();
          this.loading = false;
        });
      } else {
        this.hotelService.getAllHotels().subscribe(hotels => {
          this.hotels = hotels.sort((a, b) => b.rating - a.rating); // Sort by rating
          this.updateMapMarkers();
          this.loading = false;
        });
      }
    }
  }

  updateMapMarkers(): void {
    this.hotelMarkers = this.hotels.map(hotel => ({
      position: {
        lat: hotel.coordinates.lat,
        lng: hotel.coordinates.lng
      },
      hotel: hotel
    }));

    // Update map center if hotels found
    if (this.hotels.length > 0) {
      const firstHotel = this.hotels[0];
      this.mapOptions = {
        ...this.mapOptions,
        center: {
          lat: firstHotel.coordinates.lat,
          lng: firstHotel.coordinates.lng
        },
        zoom: 10
      };
    }
  }

  onMarkerClick(marker: { position: google.maps.LatLngLiteral; hotel: Hotel }): void {
    this.onHotelClick(marker.hotel.id);
  }

  toggleMapView(): void {
    this.showMapView = !this.showMapView;
  }

  goBackToSearch(): void {
    this.router.navigate(['/']);
  }

  onHotelClick(hotelId: string): void {
    this.router.navigate(['/hotel', hotelId]);
  }

  getFormattedSearchSummary(): string {
    const parts = [];
    
    if (this.searchParams.city) {
      parts.push(this.searchParams.city);
    }
    
    if (this.searchParams.checkInDate && this.searchParams.checkOutDate) {
      const checkIn = new Date(this.searchParams.checkInDate).toLocaleDateString('tr-TR');
      const checkOut = new Date(this.searchParams.checkOutDate).toLocaleDateString('tr-TR');
      parts.push(`${checkIn} - ${checkOut}`);
    }
    
    if (this.searchParams.guestCount) {
      parts.push(`${this.searchParams.guestCount} Misafir`);
    }
    
    return parts.length > 0 ? parts.join(' • ') : 'Tüm Oteller';
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < Math.floor(rating) ? 1 : 0);
  }
}
