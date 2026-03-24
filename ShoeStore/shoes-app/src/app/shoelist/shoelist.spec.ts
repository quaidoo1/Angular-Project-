import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Shoelist } from './shoelist';

describe('Shoelist', () => {
  let component: Shoelist;
  let fixture: ComponentFixture<Shoelist>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Shoelist],
    }).compileComponents();

    fixture = TestBed.createComponent(Shoelist);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
