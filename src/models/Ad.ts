export class Ad {
  adId: number;
  adType : number;
  adTitle : string;
  productName : string;
  brandName : string;
  categoryId : number;
  description : string;
  initialPrice : number;
  finalPrice : number;
  sellerRating: number = 0;
  sellerId : string;
  buyerId: string;
  productAge: string;
  auctionDeadline : string;
  adCreated : string;
  companyName: string;
  sold:boolean;
  rated:boolean;
  views : number;
  bidDifference: number;
  img1Url : string;
  img2Url : string;
  img3Url : string;

  constructor (ad : any) {
    this.adId = ad.adId;
    this.adType = ad.adType;
    this.adTitle = ad.adTitle;
    this.productName = ad.productName;
    this.brandName = ad.brandName;
    this.categoryId = ad.categoryId;
    this.description = ad.description;
    this.initialPrice = ad.initialPrice;
    this.sellerId = ad.sellerId;
    this.sellerRating = ad.sellerRating;
    this.buyerId = ad.buyerId;
    this.productAge = ad.productAge;
    this.companyName = ad.companyName;
    this.sold = ad.sold;
    this.rated = ad.rated;
    this.auctionDeadline = ad.auctionDeadline;
    this.bidDifference = ad.bidDifference;
    this.img1Url = ad.img1Url;
    this.img2Url = ad.img2Url;
    this.img3Url = ad.img3Url;
    this.finalPrice = ad.finalPrice;
    this.adCreated = ad.adCreated;
    this.views = ad.views;
    this.bidDifference = ad.bidDifference;
  }
}
