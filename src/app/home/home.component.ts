import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestaurantService } from 'src/shared/restaurantService.services';
import jsPDF from 'jspdf';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  restaurants: any[] = [];
  menuItems: any[] = [];


  constructor(private router: Router,
    private restaurantService: RestaurantService
  ) { }
  ngOnInit(): void {
    this.getRestaurants();
  }

  getRestaurants(): void {
    this.restaurantService.getAllRestaurants().subscribe({
      next: (response) => {
        this.restaurants = response.data;
      },
      error: (error) => {
        console.error('Error fetching restaurants:', error);
      }
    });
  }


  generatePdf(item: any): void {
    const doc = new jsPDF();
    const startY = 20;
    let yOffset = startY;

    // Add Restaurant Details
    doc.setFontSize(18);
    doc.text('Restaurant Details', 14, yOffset);
    doc.setFontSize(12);
    yOffset += 10;
    doc.text(`Name: ${item.resturantName}`, 14, yOffset);
    yOffset += 10;
    doc.text(`Owner: ${item.ownerName}`, 14, yOffset);
    yOffset += 10;
    doc.text(`Email: ${item.email}`, 14, yOffset);
    yOffset += 10;
    doc.text(`Website: ${item.website}`, 14, yOffset);
    yOffset += 10;
    doc.text(`Contact No: ${item.contactNo}`, 14, yOffset);
    yOffset += 10;
    doc.text(`Cuisine: ${item.cuisine}`, 14, yOffset);
    yOffset += 10;
    doc.text(`Operation Hours: ${item.operationHourStarts} to ${item.operationHourEnds}`, 14, yOffset);
    yOffset += 10;
    doc.text(`Address: ${item.address}`, 14, yOffset);

    // Fetch Menu Items and Add to PDF
    this.restaurantService.getAllMenuByResId(item._id).subscribe({
      next: response => {
        console.log('Menu Items Response:', response);
        this.menuItems = Array.isArray(response.data) ? response.data : []; // Ensure menuItems is an array


        // Add Menu Items Table
        yOffset += 20; // Space between details and table
        doc.setFontSize(14);
        doc.text('Menu Items', 14, yOffset);
        yOffset += 10;

        // Draw table header
        doc.setFontSize(12);
        doc.text('Item Name', 14, yOffset);
        doc.text('Price', 60, yOffset);
        doc.text('Category', 100, yOffset);
        doc.text('Active', 140, yOffset);

        doc.line(14, yOffset + 2, 200, yOffset + 2);

        // Add menu items to pdf
        yOffset += 10;
        if (Array.isArray(this.menuItems)) {
          this.menuItems.forEach(menuItem => {
            doc.text(menuItem.itemName, 14, yOffset);
            doc.text(menuItem.price, 60, yOffset);
            doc.text(menuItem.category, 100, yOffset);
            doc.text(menuItem.isActive ? 'Yes' : 'No', 140, yOffset);
            yOffset += 10;
          });
        } else {
          doc.text('No menu items available', 14, yOffset);
        }

        // Open PDF in new tab
        const filename = `restaurant-details-${item._id}.pdf`;
        const pdfData = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfData);
        window.open(pdfUrl, '_blank');
      },
      error: error => {
        console.error('Error fetching menu items:', error);

        // If an error occurs, create a PDF with only the restaurant details
        const filename = `restaurant-details-${item._id}.pdf`;
        const pdfData = doc.output('blob');
        const pdfUrl = URL.createObjectURL(pdfData);
        window.open(pdfUrl, '_blank');
      }
    });
  }


  edit(item: any) {
    this.router.navigate(['/details', item._id]);
  }

  goToForm() {
    this.router.navigate(['/addform'])
  }
}
