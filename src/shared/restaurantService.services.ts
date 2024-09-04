import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class RestaurantService {
    private apiUrl = 'http://localhost:3000/api';

    constructor(private http: HttpClient) { }

    // Get all restaurants
    getAllRestaurants(): Observable<any> {
        return this.http.get(`${this.apiUrl}/getAllResturant`);
    }

    // Add a new restaurant
    addNewRestaurant(restaurantData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/addNewResturant`, restaurantData);
    }

    // Get a restaurant by ID
    getRestaurantById(id: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/getResturantById/${id}`);
    }

    // Update a restaurant by ID
    updateRestaurantById(id: string, restaurantData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/updateResturantById/${id}`, restaurantData);
    }

    // Add a new menu item
    addMenuItem(payload: any): Observable<any> {
        return this.http.post(`${this.apiUrl}/addMenu`, payload);
    }

    // Get all menu items by restaurant ID
    getAllMenuByResId(resId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/getAllMenuByResId/${resId}`);
    }

    // Update a menu item by ID
    updateMenuItemById(id: string, menuData: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/updateMenuItemById/${id}`, menuData);
    }
}
