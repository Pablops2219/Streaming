import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieslidesComponent } from './movieslides.component';

describe('MovieslidesComponent', () => {
  let component: MovieslidesComponent;
  let fixture: ComponentFixture<MovieslidesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieslidesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieslidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
