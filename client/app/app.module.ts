import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {RouterModule, Routes} from '@angular/router';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
import { FileDropModule } from 'ngx-file-drop';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { GlobalActions } from './global-actions/global-actions.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { MatchesComponent } from './pages/matches/matches.component';

import { TeamsUpload } from './modals/teams-upload/teams-upload.component';
import { TournamentDataUpload } from './modals/tournament-data-upload/tournament-data-upload.component';
import { ImageUploadComponent } from './modals/image-upload/image-upload.component';
import { ModelEdit } from './modals/model-edit/model-edit.component';
import { ModelDelete } from './modals/model-delete/model-delete.component';
import { Tables } from './modals/tables/tables.component';
import { TournamentStatusComponent } from './modals/tournament-status/tournament-status.component';
import { TournamentSettingsComponent } from './pages/tournament-settings/tournament-settings.component';
import { ImagesComponent } from './pages/images/images.component';
import {RequestInterceptor} from "./services/request-interceptor";
import {ErrorLogger} from "./services/error-logger";

const appRoutes = [
  {path: 'teams', component: TeamsComponent},
  {path: 'matches', component: MatchesComponent},
  {path: 'settings', component: TournamentSettingsComponent},
  {path: 'images', component: ImagesComponent}
]


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    GlobalActions,
    TeamsComponent,
    MatchesComponent,
    TeamsUpload,
    TournamentDataUpload,
    ImageUploadComponent,
    ModelEdit,
    ModelDelete,
    Tables,
    TournamentStatusComponent,
    TournamentSettingsComponent,
    ImagesComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FileDropModule
  ],
  providers: [
      {
          provide: HTTP_INTERCEPTORS,
          useClass: RequestInterceptor,
          multi: true
      },
      {
          provide: ErrorHandler,
          useClass: ErrorLogger
      }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {

}
