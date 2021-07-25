import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Ad } from 'src/models/Ad';
import { AdService } from 'src/services/ad.service';
import { CategoryService } from 'src/services/category.service';

import { HomepageComponent } from './homepage.component';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let adService : AdService;
  let categoryService : CategoryService;
  let fixture: ComponentFixture<HomepageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HomepageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HomepageComponent);
    adService  = TestBed.inject(AdService);
    categoryService  = TestBed.inject(CategoryService);
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
    
    expect(component.ads).toEqual(ads);
    expect(component.ads.length).toBe(3);
  });

  it('should initialise categories with api call', () => {

    let categories:any[] = [];

    let category1:any = {
      categoryName:"test 1"
    }

    let category2:any = {
      categoryName:"test 2"
    }

    categories.push(category1);
    categories.push(category2);
    
    spyOn(categoryService, 'getCategories').and.returnValue(of(categories));

    component.ngOnInit();
    
    expect(component.ads).toEqual(categories);
    expect(component.categories.length).toBe(2);
  });
});
