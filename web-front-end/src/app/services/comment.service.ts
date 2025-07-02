import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Comment } from '../models/hotel.model';
import { MOCK_COMMENTS } from '../mock/comments.mock';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly API_URL = 'https://web-finalproject-ub2x.onrender.com';
  private readonly TOKEN_KEY = 'authToken';

  constructor(private http: HttpClient) { }

  // Get auth headers
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  // Get comments for a specific hotel
  getCommentsByHotelId(hotelId: string): Observable<Comment[]> {
    return this.http.get<any[]>(`${this.API_URL}/comments/${hotelId}`)
      .pipe(
        map(response => {
          return response.map(comment => ({
            id: comment.id?.toString() || 'comment-' + Date.now(),
            userId: comment.user_id?.toString() || 'unknown',
            userName: 'User', // API'den gelen kullanıcı adı bilgisi yoksa varsayılan
            rating: comment.rating || 5,
            text: comment.text || '',
            date: comment.created_at ? new Date(comment.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          } as Comment));
        }),
        catchError((error) => {
          // Fallback to mock data if API fails
          // Since mock comments don't have hotelId field, return all mock comments for now
          return of(MOCK_COMMENTS.slice(0, 3)); // Return first 3 mock comments as sample
        })
      );
  }

  // Get all comments (fallback method)
  getAllComments(): Observable<Comment[]> {
    return of(MOCK_COMMENTS).pipe(delay(300));
  }

  // Get comment by ID (fallback method)
  getCommentById(id: string): Observable<Comment | undefined> {
    const comment = MOCK_COMMENTS.find(comment => comment.id === id);
    return of(comment).pipe(delay(200));
  }

  // Get comments by user ID (fallback method)
  getCommentsByUserId(userId: string): Observable<Comment[]> {
    const userComments = MOCK_COMMENTS.filter(comment => comment.userId === userId);
    return of(userComments).pipe(delay(300));
  }

  // Add new comment to a hotel
  addComment(hotelId: string, commentData: { rating: number; text: string }): Observable<Comment> {
    const headers = this.getAuthHeaders();
    
    return this.http.post<any>(`${this.API_URL}/comments/${hotelId}`, commentData, { headers })
      .pipe(
        map(response => ({
          id: response.id?.toString() || 'comment-' + Date.now(),
          userId: response.user_id?.toString() || 'unknown',
          userName: 'User', // API'den gelen kullanıcı adı bilgisi yoksa varsayılan
          rating: response.rating || commentData.rating,
          text: response.text || commentData.text,
          date: response.created_at ? new Date(response.created_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        } as Comment)),
        catchError(() => {
          // Fallback to mock behavior if API fails
          const newComment: Comment = {
            id: 'comment-' + Date.now(),
            userId: 'user-1',
            userName: 'Current User',
            rating: commentData.rating,
            text: commentData.text,
            date: new Date().toISOString().split('T')[0],
            user: {
              name: 'Current User'
            }
          };
          MOCK_COMMENTS.push(newComment);
          return of(newComment);
        })
      );
  }

  // Get latest comments
  getLatestComments(limit: number = 10): Observable<Comment[]> {
    const sortedComments = [...MOCK_COMMENTS]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);
    
    return of(sortedComments).pipe(delay(300));
  }

  // Get rating statistics for a hotel
  getRatingStats(hotelId: string): Observable<{
    averageRating: number;
    totalComments: number;
    ratingDistribution: { [key: number]: number };
  }> {
    // For now, calculate from all comments since we don't have hotel-specific filtering
    // In real implementation, we would filter by hotelId
    const comments = MOCK_COMMENTS;
    
    const totalComments = comments.length;
    const averageRating = comments.reduce((sum, comment) => sum + comment.rating, 0) / totalComments;
    
    const ratingDistribution: { [key: number]: number } = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    comments.forEach(comment => {
      ratingDistribution[comment.rating]++;
    });

    const stats = {
      averageRating: Math.round(averageRating * 10) / 10,
      totalComments,
      ratingDistribution
    };

    return of(stats).pipe(delay(300));
  }
}
