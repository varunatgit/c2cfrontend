export class User {

  id:string;
  firstName: string;
  lastName: string;
  emailId: string;
  address: string;
  phone: string;
  pinCode: number;
  password: string;
  picture: string;
  rating : number;
  buyCount: number;
  sellCount: number;
  companyName : string;
  donationsCount: number;

  constructor(user:any) {
    this.id = user.id;
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.emailId = user.emailId;
    this.address = user.address;
    this.phone = user.phone;
    this.pinCode = user.pinCode;
    this.password = user.password;
    this.picture = user.picture;
    this.buyCount = user.buyCount;
    this.sellCount = user.sellCount;
    this.donationsCount = user.donationsCount;
    this.rating = user.rating;
    this.companyName = user.companyName;
  }
}
