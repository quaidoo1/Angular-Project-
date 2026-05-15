import { Component, OnInit, PLATFORM_ID, inject, ChangeDetectorRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ShoeService } from '../../services/shoe.services';
import { Shoe } from '../../models/shoe.model';

@Component({
  selector: 'app-shoe-delete',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shoe-delete.component.html',
  styleUrls: ['./shoe-delete.component.css']
})
export class ShoeDeleteComponent implements OnInit {
  shoe: Shoe | null = null;
  loading = true;
  deleting = false;
  error = '';
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  constructor(
    private shoeService: ShoeService,
    private route: ActivatedRoute,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      if (this.isBrowser) {
        this.shoeService.getById(+id).subscribe({
          next: (data) => { 
            this.shoe = data; 
            this.loading = false; 
            this.cdr.detectChanges();
          },
          error: () => { 
            this.error = 'Shoe not found.'; 
            this.loading = false; 
            this.cdr.detectChanges();
          }
        });
      } else {
        this.loading = false;
        this.cdr.detectChanges();
      }
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }

  confirm(): void {
    if (!this.shoe) return;
    this.deleting = true;
    this.shoeService.delete(this.shoe.id).subscribe({
      next: () => this.router.navigate(['/']),
      error: () => { 
        this.error = 'Failed to delete shoe.'; 
        this.deleting = false; 
        this.cdr.detectChanges();
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/']);
  }
}