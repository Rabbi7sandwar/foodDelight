import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RestaurantService } from 'src/shared/restaurantService.services';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-form',
  templateUrl: './add-form.component.html',
  styleUrls: ['./add-form.component.scss']
})
export class AddFormComponent implements OnInit {
  addForm: FormGroup;
  menuItemForm!: FormGroup;
  isEdit: boolean = false;
  restaurantId: string | null = null;
  next: boolean = false;
  restaurantDetails: any = {};
  menuItems: any = {};

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private restaurantService: RestaurantService,
    private toastr: ToastrService
  ) {
    // Initializing the forms here but no restaurant data is set yet
    this.menuItemForm = this.fb.group({
      menuItems: this.fb.array([])
    });
    this.addForm = this.fb.group({
      resturantName: ['', [Validators.required, Validators.maxLength(60)]],
      ownerName: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[A-Za-z\\s]*$')]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(60)]],
      contactNo: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      website: ['', [Validators.required, Validators.pattern('https?://.+'), Validators.maxLength(60)]],
      cuisine: ['', [Validators.required, Validators.maxLength(30), Validators.pattern('^[a-zA-Z ]*$')]],
      operationHourStarts: ['', [Validators.required]],
      operationHourEnds: ['', [Validators.required]],
      address: ['', [Validators.required, Validators.maxLength(250)]],
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.isEdit = true;
        this.restaurantId = id;
        this.getRestaurant(id); // Fetch restaurant details and update the form
        this.prepopulateFormArray(id); // Fetch menu items

      } else {
        this.isEdit = false;
        this.addMenuItem(); // Add an empty set of form fields
      }
    });
  }


  getRestaurant(id: string): void {
    this.restaurantService.getRestaurantById(id).subscribe({
      next: (response) => {
        this.restaurantDetails = response.data;
        this.updateForm(); // Update the form with the fetched data
      },
      error: (error) => {
        console.error('Error fetching restaurant:', error);
      }
    });
  }

  updateForm(): void {
    // Now update the form fields with the fetched data
    this.addForm.patchValue({
      resturantName: this.restaurantDetails.resturantName || '',
      ownerName: this.restaurantDetails.ownerName || '',
      email: this.restaurantDetails.email || '',
      contactNo: this.restaurantDetails.contactNo || '',
      website: this.restaurantDetails.website || '',
      cuisine: this.restaurantDetails.cuisine || '',
      operationHourStarts: this.restaurantDetails.operationHourStarts || '',
      operationHourEnds: this.restaurantDetails.operationHourEnds || '',
      address: this.restaurantDetails.address || ''
    });
  }

  prepopulateFormArray(id: string): void {
    const items = this.menuItemForm.get('menuItems') as FormArray;
    this.restaurantService.getAllMenuByResId(id).subscribe({
      next: (response) => {
        this.menuItems = response.data;
        this.menuItems.forEach((menuItem: any) => {
          const menuGroup = this.fb.group({
            _id: [menuItem._id || ''],
            itemName: [menuItem.itemName || '', Validators.required],
            price: [menuItem.price || '', [Validators.required]],
            category: [menuItem.category || '', Validators.required],
            isActive: [menuItem.isActive]
          });
          items.push(menuGroup);
        });

      },
      error: (error) => {
        console.error('Error fetching menu items:', error);
        this.isEdit = true
        this.addMenuItem();
      }
    });
  }


  async onSave() {
    if (this.addForm.valid) {
      if (this.isEdit && this.restaurantId) {
        this.restaurantService.updateRestaurantById(this.restaurantId!, this.addForm.value).subscribe(() => {
          if (!this.next) {
            this.router.navigate(['/home']);
          }
        });
      } else {
        this.restaurantService.addNewRestaurant(this.addForm.value).subscribe(() => {
          if (!this.next) {
            this.router.navigate(['/home']);
            this.toastr.success('Form submitted successfully!', 'Success');
          }
        });
      }
    } else {
      this.addForm.markAllAsTouched();
    }
  }

  back() {
    this.router.navigate(['/home']);
  }

  async onNext() {
    await this.onSave();
    this.next = true;
  }

  isActive(item: any): boolean {
    return item.get('isActive')?.value;
  }

  get menuItem(): FormArray {
    return this.menuItemForm.get('menuItems') as FormArray;
  }


  addMenuItem() {
    const menuItem = this.fb.group({
      itemName: ['', Validators.required],
      price: ['', Validators.required],
      category: ['', Validators.required],
      isActive: [true]
    });
    const menuItemsArray = this.menuItem;
    menuItemsArray.insert(0, menuItem);
  }

  toggleActive(index: number): void {
    const menuItem = this.menuItem.at(index);
    const currentIsActive = menuItem.get('isActive')?.value;

    // Toggle the isActive status
    const newIsActive = !currentIsActive;
    menuItem.patchValue({
      isActive: newIsActive
    });


    this.enableDisable(newIsActive, index);
  }


  enableDisable(isActive: boolean, index: number): void {
    // Create a payload with the necessary information
    const id = this.menuItem.at(index).get('_id')?.value
    const payload = {

      isActive: isActive
    };


    if (isActive) {
      this.restaurantService.updateMenuItemById(id, payload).subscribe({
        next: () => {
          console.log('Menu item activated successfully');
        },
        error: (error) => {
          console.error('Error activating menu item:', error);
        }
      });
    } else {
      this.restaurantService.updateMenuItemById(id, payload).subscribe({
        next: () => {
          console.log('Menu item removed successfully');
        },
        error: (error) => {
          console.error('Error removing menu item:', error);
        }
      });
    }
  }

  onSubmitMenuItems() {
    if (this.menuItemForm.valid) {
      const menuItems = this.menuItemForm.value.menuItems;
      console.log(this.menuItemForm.value)
      menuItems.forEach((item: any) => {
        const payload = {
          ...item,
          resturantId: this.restaurantId
        };
        if (this.isEdit && item._id) {
          this.restaurantService.updateMenuItemById(item._id, payload).subscribe({
            next: () => {
              console.log('Menu item updated successfully');
            },
            error: (error) => {
              console.error('Error updating menu item:', error);
            }
          });
        } else {
          // This block is for new items without an _id
          this.restaurantService.addMenuItem(payload).subscribe({
            next: () => {
              console.log('Menu item added successfully');
            },
            error: (error) => {
              console.error('Error adding menu item:', error);
            }
          });
        }
      });
      this.toastr.success('Form submitted successfully!', 'Success');
      // Navigate back to the home after all items are processed
      this.router.navigate(['/home']);
    } else {
      this.menuItemForm.markAllAsTouched();
    }
  }

}
