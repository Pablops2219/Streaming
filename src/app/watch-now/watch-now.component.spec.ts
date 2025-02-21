import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WatchNowComponent } from './watch-now.component';

describe('WatchNowComponent', () => {
  let component: WatchNowComponent;
  let fixture: ComponentFixture<WatchNowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WatchNowComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WatchNowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
