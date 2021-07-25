import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Ad } from 'src/models/Ad';
import { UserService } from 'src/services/user.service';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let userService : UserService;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    userService = TestBed.inject(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialise sold ads with api call', () => {
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
    
    spyOn(userService, 'getSoldAdsByUserId').and.returnValue(of(ads));

    component.ngOnInit();
    
    expect(component.soldAds).toEqual(ads);
    expect(component.soldAds.length).toBe(3);
  });

  it('should initialise bought ads with api call', () => {
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
    
    spyOn(userService, 'getBoughtAdsByUserId').and.returnValue(of(ads));

    component.ngOnInit();
    
    expect(component.boughtAds).toEqual(ads);
    expect(component.boughtAds.length).toBe(3);
  });
});
