import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdDetailedCardComponent } from './ad-detailed-card.component';

describe('AdDetailedCardComponent', () => {
  let component: AdDetailedCardComponent;
  let fixture: ComponentFixture<AdDetailedCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdDetailedCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdDetailedCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
