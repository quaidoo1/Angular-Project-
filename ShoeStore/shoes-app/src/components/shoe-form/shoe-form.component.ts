import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShoeService } from '../../services/shoe.services';
import { Shoe } from '../../models/shoe.model';

@Component({
  selector: 'app-shoe-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shoe-form.component.html',
  styleUrls: ['./shoe-form.component.css']
})
export class ShoeFormComponent implements OnInit {
  shoe: Shoe = { id: 0, name: '', price: 0, brand: '' };
  isEdit = false;
  loading = false;
  saving = false;
  error = '';

  constructor(
    private shoeService: ShoeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.shoeService.getById(+id).subscribe({
        next: (data) => { this.shoe = data; this.loading = false; },
        error: () => { this.error = 'Failed to load shoe.'; this.loading = false; }
      });
    }
  }

  save(): void {
    this.saving = true;
    this.error = '';

    if (this.isEdit) {
      this.shoeService.update(this.shoe.id, this.shoe).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => { this.error = 'Failed to update shoe.'; this.saving = false; }
      });
    } else {
      const { id, ...newShoe } = this.shoe;
      this.shoeService.create(newShoe).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => { this.error = 'Failed to create shoe.'; this.saving = false; }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}