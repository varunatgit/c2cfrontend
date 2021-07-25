import { Pipe, PipeTransform } from '@angular/core';
import { Ad } from 'src/models/Ad';
@Pipe({
    name:'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {

    searchFilter(ads: Ad[], searchKeyword: string){
        if(searchKeyword.length==0){
            return ads;
        }
        searchKeyword = searchKeyword.toLowerCase();
        return ads.filter(
            ad => ad.adTitle.toLowerCase().includes(searchKeyword) 
            || ad.productName.toLowerCase().includes(searchKeyword) 
            || ad.description.toLowerCase().includes(searchKeyword)
        )
    }

    adTypeFilter(ads:Ad[],adType:number){
        return ads.filter(ad=>ad.adType == adType);
    }

    categoriesFilter(ads:Ad[],selectedCategories:number[]){
        if(selectedCategories.length == 0){
            return ads;
        }
        
        const list =  ads.filter(
            ad => {
                if(selectedCategories.findIndex(c=>c==ad.categoryId)!=-1){
                    return true;
                }
                return false;
            }
        )
        return list;
    }

    priceFilter(ads:Ad[],startPrice:number,endPrice:number){
        return ads.filter(
            ad => ad.finalPrice>=startPrice && ad.finalPrice<=endPrice
        )
    }

    transform(ads: Ad[],companyName:string, searchKeyword: string, adType:number,selectedCategories:number[],startPrice:number,endPrice:number): any[]{     
        
        ads = this.searchFilter(ads,searchKeyword);
        if(companyName!=""){
            ads = ads.filter(ad=>ad.companyName==companyName);
        }
        ads = this.categoriesFilter(ads,selectedCategories);
        ads = this.adTypeFilter(ads,adType);

        if(adType == 1){
            return ads;
        }
        ads = this.priceFilter(ads,startPrice,endPrice);
        return ads;
    }
}