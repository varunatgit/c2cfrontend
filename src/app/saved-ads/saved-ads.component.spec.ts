import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Ad } from 'src/models/Ad';
import { AdService } from 'src/services/ad.service';
import { UserService } from 'src/services/user.service';

import { SavedAdsComponent } from './saved-ads.component';

describe('SavedAdsComponent', () => {
  let component: SavedAdsComponent;
  let userService : UserService;
  let fixture: ComponentFixture<SavedAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SavedAdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SavedAdsComponent);
    userService = TestBed.inject(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise saved ads with api call', () => {
    let ads:Ad[] = [];

    let ad1:Ad = new Ad({
      adTitle:"test 1"
    })

    let ad2:Ad = new Ad({
      adTitle:"test 2"
    })

    let ad3:Ad = new Ad({
      adTitle:"test 3"
    })

    ads.push(ad1);
    ads.push(ad2);
    ads.push(ad3);
    
    spyOn(userService, 'getSavedAdsByUserId').and.returnValue(of(ads));

    component.ngOnInit();
    
    expect(component.savedAds).toEqual(ads);
    expect(component.savedAds.length).toBe(3);
  });
});
