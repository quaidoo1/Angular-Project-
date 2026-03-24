import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShoeService } from '../../services/shoe.services';
import { Shoe } from '../../models/shoe.model';

@Component({
  selector: 'app-shoe-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoe-list.component.html',
  styleUrls: ['./shoe-list.component.css']
})
export class ShoeListComponent implements OnInit {
  shoes: Shoe[] = [];
  loading = true;
  error = '';

  constructor(private shoeService: ShoeService, private router: Router) {}

  ngOnInit(): void {
    this.loadShoes();
  }

  loadShoes(): void {
    this.loading = true;
    this.shoeService.getAll().subscribe({
      next: (data) => { this.shoes = data; this.loading = false; },
      error: () => { this.error = 'Failed to load shoes.'; this.loading = false; }
    });
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
}