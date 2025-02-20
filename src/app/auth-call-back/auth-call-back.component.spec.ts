import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthCallBackComponent } from './auth-call-back.component';

describe('AuthCallBackComponent', () => {
  let component: AuthCallBackComponent;
  let fixture: ComponentFixture<AuthCallBackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthCallBackComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthCallBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
