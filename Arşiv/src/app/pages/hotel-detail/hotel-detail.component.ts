import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { HotelService } from '../../services/hotel.service';
import { AuthService } from '../../services/auth.service';
import { CommentService } from '../../services/comment.service';
import { Hotel, Comment } from '../../models/hotel.model';

@Component({
  selector: 'app-hotel-detail',
  standalone: true,
  imports: [CommonModule, GoogleMapsModule, ReactiveFormsModule],
  templateUrl: './hotel-detail.component.html',
  styleUrl: './hotel-detail.component.css'
})
export class HotelDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private hotelService = inject(HotelService);
  private authService = inject(AuthService);
  private commentService = inject(CommentService);
  private formBuilder = inject(FormBuilder);

  hotel: Hotel | null = null;
  hotelComments: Comment[] = [];
  loading = true;
  commentLoading = false;
  showRatingChart = false;
  showFullGallery = false;
  showCommentForm = false;
  currentImageIndex = 0;
  relatedHotels: Hotel[] = [];
  
  // Comment form
  commentForm: FormGroup = this.formBuilder.group({
    rating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    text: ['', [Validators.required, Validators.minLength(10)]]
  });
  
  // Mock additional images for gallery
  galleryImages: string[] = [];
  
  // Rating distribution for chart
  ratingDistribution = [
    { stars: 5, count: 0, percentage: 0 },
    { stars: 4, count: 0, percentage: 0 },
    { stars: 3, count: 0, percentage: 0 },
    { stars: 2, count: 0, percentage: 0 },
    { stars: 1, count: 0, percentage: 0 }
  ];

  isAuthenticated = false;

  // Google Maps properties
  mapOptions: google.maps.MapOptions = {
    zoom: 15,
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

  hotelPosition: google.maps.LatLngLiteral = { lat: 0, lng: 0 };

  ngOnInit() {
    this.isAuthenticated = this.authService.isLoggedIn();
    
    this.route.params.subscribe(params => {
      const hotelId = params['id'];
      if (hotelId) {
        this.loadHotelDetails(hotelId);
      }
    });
  }

  private loadHotelDetails(hotelId: string, showLoader: boolean = true) {
    if (showLoader) {
      this.loading = true;
    }
    
    this.hotelService.getHotelById(hotelId).subscribe({
      next: (hotel) => {
        if (hotel) {
          this.hotel = hotel;
          this.setupMap();
          this.generateGalleryImages();
          this.calculateRatingDistribution();
          this.loadRelatedHotels();
          console.log('Hotel details loaded:', this.hotel, hotelId);
          this.hotelComments = this.hotel.comments || [];
        } else {
          this.router.navigate(['/']);
        }
        if (showLoader) {
          this.loading = false;
        }
      },
      error: () => {
        if (showLoader) {
          this.loading = false;
        }
        this.router.navigate(['/']);
      }
    });
  }

  private setupMap(): void {
    if (this.hotel) {
      this.hotelPosition = {
        lat: this.hotel.coordinates.lat,
        lng: this.hotel.coordinates.lng
      };
      
      this.mapOptions = {
        ...this.mapOptions,
        center: this.hotelPosition
      };
    }
  }

  private generateGalleryImages() {
    if (!this.hotel) return;
    
    // Use hotel's gallery images if available, otherwise generate mock images
    if (this.hotel.galleryImages && this.hotel.galleryImages.length > 0) {
      this.galleryImages = [this.hotel.imageUrl, ...this.hotel.galleryImages];
    } else {
      // Generate additional images for gallery
      this.galleryImages = [
        this.hotel.imageUrl,
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1578774204375-4b1678e50eb8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
      ];
    }
  }

  private calculateRatingDistribution() {
    // Use hotel comments from API or fallback to embedded comments
    const comments = this.hotelComments.length > 0 ? this.hotelComments : (this.hotel?.comments || []);
    
    if (comments.length === 0) return;
    
    const total = comments.length;
    const counts = [0, 0, 0, 0, 0]; // for 1-5 stars
    
    comments.forEach(comment => {
      counts[comment.rating - 1]++;
    });
    
    this.ratingDistribution = [
      { stars: 5, count: counts[4], percentage: total > 0 ? (counts[4] / total) * 100 : 0 },
      { stars: 4, count: counts[3], percentage: total > 0 ? (counts[3] / total) * 100 : 0 },
      { stars: 3, count: counts[2], percentage: total > 0 ? (counts[2] / total) * 100 : 0 },
      { stars: 2, count: counts[1], percentage: total > 0 ? (counts[1] / total) * 100 : 0 },
      { stars: 1, count: counts[0], percentage: total > 0 ? (counts[0] / total) * 100 : 0 }
    ];
  }

  private loadRelatedHotels() {
    if (!this.hotel) return;
    
    this.hotelService.getHotelsByCity(this.hotel.city).subscribe(hotels => {
      this.relatedHotels = hotels
        .filter(h => h.id !== this.hotel?.id)
        .slice(0, 3);
    });
  }

  toggleRatingChart() {
    this.showRatingChart = !this.showRatingChart;
  }

  openGallery(index: number = 0) {
    this.currentImageIndex = index;
    this.showFullGallery = true;
  }

  closeGallery() {
    this.showFullGallery = false;
  }

  nextImage() {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
  }

  prevImage() {
    this.currentImageIndex = this.currentImageIndex > 0 
      ? this.currentImageIndex - 1 
      : this.galleryImages.length - 1;
  }

  getStars(rating: number): boolean[] {
    return Array(5).fill(false).map((_, i) => i < Math.floor(rating));
  }

  shareHotel() {
    if (navigator.share && this.hotel) {
      navigator.share({
        title: this.hotel.name,
        text: `Check out this amazing hotel: ${this.hotel.name}`,
        url: window.location.href
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  }

  bookHotel() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Mock booking functionality
  }

  goToSearchResults() {
    this.router.navigate(['/search-results']);
  }

  goToHotelDetail(hotelId: string) {
    this.router.navigate(['/hotel', hotelId]);
  }

  // Comment functionality
  toggleCommentForm() {
    if (!this.isAuthenticated) {
      this.router.navigate(['/login']);
      return;
    }
    this.showCommentForm = !this.showCommentForm;
  }

  submitComment() {
    if (!this.commentForm.valid || !this.hotel) {
      return;
    }

    this.commentLoading = true;
    const commentData = {
      rating: this.commentForm.value.rating,
      text: this.commentForm.value.text
    };

    this.commentService.addComment(this.hotel.id, commentData).subscribe({
      next: (newComment) => {
        // Reset form and hide it
        this.commentForm.reset({ rating: 5, text: '' });
        this.showCommentForm = false;
        this.commentLoading = false;
        
        // Reload hotel details to get updated comments and rating
        if (this.hotel) {
          this.loadHotelDetails(this.hotel.id, false);
        }
        
      },
      error: () => {
        this.commentLoading = false;
        alert('Yorum eklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    });
  }

  // Star rating helper for form
  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  setRating(rating: number) {
    this.commentForm.patchValue({ rating });
  }

  // Get total comment count (from API or fallback)
  getTotalCommentCount(): number {
    return this.hotelComments.length > 0 ? this.hotelComments.length : (this.hotel?.commentCount || 0);
  }

  // Get average rating (from current comments or fallback)
  getAverageRating(): number {
    const comments = this.hotelComments.length > 0 ? this.hotelComments : (this.hotel?.comments || []);
    if (comments.length === 0) return this.hotel?.rating || 0;
    
    const total = comments.reduce((sum, comment) => sum + comment.rating, 0);
    return Math.round((total / comments.length) * 10) / 10;
  }

  // Get comments to display (prioritize API comments, fallback to hotel comments)
  getDisplayComments(): Comment[] {
    // If we have comments from API, use them
    console.log('Debug: API Comments:', this.hotelComments.length, 'Hotel Comments:', this.hotel?.comments?.length || 0);
    if (this.hotelComments.length > 0) {
      return this.hotelComments;
    }
    
    // Otherwise, use hotel's embedded comments
    return this.hotel?.comments || [];
  }
}
