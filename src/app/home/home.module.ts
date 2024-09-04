import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [HomeComponent],
  imports: [
    HttpClientModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: HomeComponent }])
  ]
})
export class HomeModule { }
