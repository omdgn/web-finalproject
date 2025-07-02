import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { AuthService } from '../../services/auth.service';
import { HotelService } from '../../services/hotel.service';
import { User } from '../../models/user.model';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, GoogleMapsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  searchForm: FormGroup;
  hotels: Hotel[] = [];
  filteredHotels: Hotel[] = [];
  loading = false;
  showMapView = false;
  
  cities = ['Istanbul', 'Ankara', 'Izmir', 'Antalya', 'Bursa', 'Nevsehir'];

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

  markerPositions: google.maps.LatLngLiteral[] = [];
  hotelMarkers: { position: google.maps.LatLngLiteral; hotel: Hotel }[] = [];

  constructor(
    private authService: AuthService, 
    private hotelService: HotelService,
    private fb: FormBuilder,
    private router: Router
  ) {
    const today = new Date().toISOString().split('T')[0];
    this.searchForm = this.fb.group({
      city: [''],
      checkInDate: [today],
      checkOutDate: [today],
      guestCount: [1],
      minPrice: [''],
      maxPrice: ['']
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.loadHotels();
  }

  loadHotels(): void {
    this.loading = true;
    
    // Get hotels based on user's country, then filter for weekend availability
    if (this.currentUser?.country) {
      this.hotelService.getHotelsByCountry(this.currentUser.country).subscribe(hotels => {
        console.log("sago",hotels)
        this.hotels = hotels.sort((a, b) => b.rating - a.rating); // Sort by rating
        console.log('Hotels loaded for country:', this.hotels);
        this.filteredHotels = this.hotels;
        this.updateMapMarkers();
        this.loading = false;
      });
    } else {
      // If no country info, get weekend hotels
      this.hotelService.getAvailableHotelsForWeekend().subscribe(hotels => {
        this.hotels = hotels.sort((a, b) => b.rating - a.rating); // Sort by rating
        this.filteredHotels = this.hotels;
        this.updateMapMarkers();
        this.loading = false;
      });
    }
  }

  updateMapMarkers(): void {
    this.hotelMarkers = this.filteredHotels.map(hotel => ({
      position: {
        lat: hotel.coordinates.lat,
        lng: hotel.coordinates.lng
      },
      hotel: hotel
    }));
    this.markerPositions = this.hotelMarkers.map(marker => marker.position);
  }

  onMarkerClick(marker: { position: google.maps.LatLngLiteral; hotel: Hotel }): void {
    this.goToHotelDetail(marker.hotel.id);
  }

  onSearch(): void {
    const formValue = this.searchForm.value;
    
    // Navigate to search results page with query parameters
    this.router.navigate(['/search-results'], {
      queryParams: {
        city: formValue.city || undefined,
        checkInDate: formValue.checkInDate || undefined,
        checkOutDate: formValue.checkOutDate || undefined,
        guestCount: formValue.guestCount || undefined,
        minPrice: formValue.minPrice || undefined,
        maxPrice: formValue.maxPrice || undefined
      }
    });
  }

  toggleMapView(): void {
    this.showMapView = !this.showMapView;
  }

  onLogout(): void {
    this.authService.logout();
  }

  goToHotelDetail(hotelId: string): void {
    this.router.navigate(['/hotel', hotelId]);
  }
}
