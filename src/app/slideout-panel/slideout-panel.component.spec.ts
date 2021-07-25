import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlideoutPanelComponent } from './slideout-panel.component';

describe('SlideoutPanelComponent', () => {
  let component: SlideoutPanelComponent;
  let fixture: ComponentFixture<SlideoutPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SlideoutPanelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideoutPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
