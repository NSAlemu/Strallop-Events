import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {LandingComponent} from './landing/landing.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ExtraOptions, RouterModule, Routes} from "@angular/router";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatTreeModule} from "@angular/material/tree";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatBadgeModule} from "@angular/material/badge";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatChipsModule} from "@angular/material/chips";
import {MatNativeDateModule, MatRippleModule} from "@angular/material/core";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatIconModule} from "@angular/material/icon";
import {MatInputModule} from "@angular/material/input";
import {MatMenuModule} from "@angular/material/menu";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatSortModule} from "@angular/material/sort";
import {MatStepperModule} from "@angular/material/stepper";
import {MatTabsModule} from "@angular/material/tabs";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {MatRadioModule} from "@angular/material/radio";
import {MatSliderModule} from "@angular/material/slider";
import {MatSelectModule} from "@angular/material/select";
import {MatTableModule} from "@angular/material/table";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {CommonModule} from "@angular/common";
import {AppRoutingModule} from './app-routing.module';
import {ToolbarComponent} from './toolbar/toolbar.component';
import {LayoutModule} from "@angular/cdk/layout";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {LargeEventCardComponent} from './ImageComponents/large-event-card/large-event-card.component';
import {MediumCategoryCardComponent} from './ImageComponents/medium-category-card/medium-category-card.component';
import {EventDetailsComponent} from './event-details/event-details.component';
import {MaterialElevationDirective} from "./Directives/MaterialElevationDirective";
import * as Parse from 'parse'
import {FroalaEditorModule, FroalaViewModule} from "angular-froala-wysiwyg";
import {EventRegistrationComponent} from './Registration/event-registration/event-registration.component';
import {EventTicketComponent} from './Registration/event-ticket/event-ticket.component';
import {RegisterTicketsComponent} from './Registration/register-tickets/register-tickets.component';
import {RegisterDetailsComponent} from './Registration/register-details/register-details.component';
import {CreateOrgaizationLandingComponent} from "./CreateOrganization/create-orgaization-landing/create-orgaization-landing.component";
import {MediumCategorySkeletonComponent} from "./ImageComponents/medium-category-skeleton/medium-category-skeleton.component";
import {NotificationBannerComponent} from "./ImageComponents/notification-banner/notification-banner.component";
import {LargeEventCardSkeletonComponent} from "./ImageComponents/large-event-card-skeleton/large-event-card-skeleton.component";
import {RegisterCheckoutComponent} from "./Registration/register-checkout/register-checkout.component";
import {LoginComponentComponent} from "./GeneralComponents/login-component/login-component.component";
import {ServerErrorComponent} from "./GeneralComponents/server-error/server-error.component";
import {SettingAccountComponent} from "./GeneralComponents/setting-account/setting-account.component";
import {MaterialFileInputModule} from "ngx-material-file-input";
import {SettingTeamManagementComponentComponent} from "./GeneralComponents/setting-team-management-component/setting-team-management-component.component";
import {SettingsBaseComponentComponent} from "./GeneralComponents/settings-base-component/settings-base-component.component";
import {SettingSidenavComponent} from "./GeneralComponents/setting-sidenav/setting-sidenav.component";
import {SettingHomeComponentComponent} from "./GeneralComponents/setting-home-component/setting-home-component.component";
import {ToolbarComponentComponent} from "./GeneralComponents/toolbar-component/toolbar-component.component";
import {ConfirmDialogComponent} from "../shared/confirm-dialog/confirm-dialog.component";
import {HttpClientModule} from "@angular/common/http";
import { AboutComponent } from './GeneralComponents/about/about.component';
import { HelpFeedbackComponent } from './GeneralComponents/help-feedback/help-feedback.component';
import { SecurityComponent } from './GeneralComponents/security/security.component';
import { TermsComponent } from './GeneralComponents/terms/terms.component';
import { PrivacyComponent } from './GeneralComponents/privacy/privacy.component';

// Parse.initialize("selupdfUHcQqJAHHljBy6Z9RoaR4iUKkqGL76DTs", "rhchvsOtCd6ZNe53TuxkBGJ8JLWJXczbvqTXDOBK");
//javascriptKey is required only if you have it on server.

// (Parse as any).serverURL = "https://parseapi.back4app.com/";

Parse.initialize('APPLICATION_ID');
// (Parse as any).serverURL = 'http://localhost:1337/parse';
// // @ts-ignore
// Parse.liveQueryServerURL = 'ws://localhost:1337/';

(Parse as any).serverURL = 'https://fichach-parse.herokuapp.com/parse';
// @ts-ignore
Parse.liveQueryServerURL = 'wss://fichach-parse.herokuapp.com/';

const routes: Routes = [
  {path: '', component: LandingComponent},
  {path: 'events/:eventId', component: EventDetailsComponent},
  {
    path: 'events/:eventId/register', component: EventRegistrationComponent, children: [
      {path: '', component: EventRegistrationComponent},
      {path: 'tickets', component: RegisterTicketsComponent},
      {path: 'details', component: RegisterDetailsComponent}
    ]
  },
  {path: 'about', component: AboutComponent},
  {path: 'security', component: SecurityComponent},
  {path: 'help-feedback', component: HelpFeedbackComponent},
  {path: 'terms', component: TermsComponent},
  {path: 'privacy', component: PrivacyComponent}
]
export const routingConfiguration: ExtraOptions = {
  paramsInheritanceStrategy: 'always',
  scrollPositionRestoration: 'enabled'
};
const modules = [
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatNativeDateModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
  DragDropModule,
  LayoutModule,
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  ReactiveFormsModule,
  FormsModule,
  MaterialFileInputModule,
  HttpClientModule
];

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    ToolbarComponent,
    LargeEventCardComponent,
    MediumCategoryCardComponent,
    EventDetailsComponent,
    MaterialElevationDirective,
    EventRegistrationComponent,
    EventTicketComponent,
    RegisterTicketsComponent,
    CreateOrgaizationLandingComponent,
    RegisterDetailsComponent,
    MediumCategorySkeletonComponent,
    NotificationBannerComponent,
    LargeEventCardSkeletonComponent,
    RegisterCheckoutComponent,
    LoginComponentComponent,
    ServerErrorComponent,
    SettingAccountComponent,
    SettingTeamManagementComponentComponent,
    SettingsBaseComponentComponent,
    SettingSidenavComponent,
    SettingHomeComponentComponent,
    ToolbarComponentComponent,
    ConfirmDialogComponent,
    AboutComponent,
    HelpFeedbackComponent,
    SecurityComponent,
    TermsComponent,
    PrivacyComponent
  ],
  exports: [
    RouterModule
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    CommonModule,
    AppRoutingModule,
    ...modules,
    RouterModule.forRoot(routes, routingConfiguration),
    FroalaEditorModule.forRoot(), FroalaViewModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
