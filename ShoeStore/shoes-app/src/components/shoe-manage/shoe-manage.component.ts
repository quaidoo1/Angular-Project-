import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShoeService } from '../../services/shoe.services';
import { AuthService } from '../../services/auth.service';
import { Shoe } from '../../models/shoe.model';

@Component({
  selector: 'app-shoe-manage',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoe-manage.component.html',
  styleUrls: ['./shoe-manage.component.css']
})
export class ShoeManageComponent implements OnInit {
  shoes: Shoe[] = [];
  loading = true;
  error = '';

  constructor(
    private shoeService: ShoeService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadShoes();
  }

  loadShoes(): void {
    this.loading = true;
    this.shoeService.getAll().subscribe({
      next: (data) => { 
        this.shoes = data; 
        this.loading = false; 
        this.cdr.detectChanges();
      },
      error: () => { 
        this.error = 'Failed to load shoes.'; 
        this.loading = false; 
        this.cdr.detectChanges();
      }
    });
  }

  get currentUser() {
    return this.authService.currentUser;
  }

  editShoe(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  deleteShoe(id: number): void {
    this.router.navigate(['/delete', id]);
  }

  addShoe(): void {
    this.router.navigate(['/add']);
  }

  backToStore(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
