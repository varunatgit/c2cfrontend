import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CountdownModule } from 'ngx-countdown';
import { RatingModule } from 'ng-starrating';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { CarouselComponent } from './carousel/carousel.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { CreateAdComponent } from './create-ad/create-ad.component';
import { HomepageComponent } from './homepage/homepage.component';
import { TopNavComponent } from './top-nav/top-nav.component';
import { AdvertisementListComponent } from './advertisement-list/advertisement-list.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdvertisementDetailComponent } from './advertisement-detail/advertisement-detail.component';
import { FilterPipe } from 'src/pipes/filter.pipe';
import { FormsModule } from '@angular/forms';
import { MomentModule } from 'ngx-moment';
import { ContactSellerComponent } from '../app/advertisement-detail/contact-seller/contact-seller.component';
import { ViewProfileComponent } from '../app/view-profile/view-profile.component';
import { HelpComponent } from '../app/help/help.component';
import { AdCardComponent } from './ad-card/ad-card.component';
import { AdDetailedCardComponent } from './ad-detailed-card/ad-detailed-card.component';
import { SavedAdsComponent } from './saved-ads/saved-ads.component';
import { MyAdsComponent } from './my-ads/my-ads.component';
import { SlideoutPanelComponent } from './slideout-panel/slideout-panel.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BarRatingModule } from 'ngx-bar-rating';
import { AngularFireModule } from '@angular/fire';
import { environment } from "src/environments/environment";
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { ChatWindowComponent } from './advertisement-detail/chat-window/chat-window.component';
import { ChatComponent } from './chat/chat.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import {HttpClient} from '@angular/common/http'


@NgModule({
  declarations: [
    AppComponent,
    SignInComponent,
    CarouselComponent,
    SignUpComponent,
    CreateAdComponent,
    HomepageComponent,
    TopNavComponent,
    AdvertisementListComponent,
    AdvertisementDetailComponent,
    FilterPipe,
    AdCardComponent,
    AdDetailedCardComponent,
    SavedAdsComponent,
    MyAdsComponent,
    SlideoutPanelComponent,
    DashboardComponent,
    UserProfileComponent,
    HelpComponent,
    NotificationsComponent,
    ContactSellerComponent,
    ViewProfileComponent,
    ChatComponent,
    ChatWindowComponent,
    ForgotPasswordComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgbModule,
    HttpClientModule,
    NgxSliderModule,
    NgbModule,
    HttpClientModule,
    FormsModule,
    MomentModule,
    CountdownModule,
    RatingModule,
    BarRatingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
