import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Ad } from 'src/models/Ad';
import { AdService } from 'src/services/ad.service';

import { MyAdsComponent } from './my-ads.component';

describe('MyAdsComponent', () => {
  let component: MyAdsComponent;
  let adService : AdService;
  let fixture: ComponentFixture<MyAdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyAdsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAdsComponent);
    adService  = TestBed.inject(AdService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise ads with api call', () => {
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
    
    spyOn(adService, 'getAds').and.returnValue(of(ads));

    component.ngOnInit();
    
    expect(component.myAds).toEqual(ads);
    expect(component.myAds.length).toBe(3);
  });
});
