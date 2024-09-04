import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; // For directives like NgIf and NgFor
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AddFormComponent } from './add-form.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    AddFormComponent,
  ],
  imports: [
    CommonModule, // Use CommonModule here
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: AddFormComponent }])
  ]
})
export class AddformModule { }
