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

import { TeamsUpload } from './shared/modals/teams-upload/teams-upload.component';
import { TournamentDataUpload } from './shared/modals/tournament-data-upload/tournament-data-upload.component';
import { ImageUploadComponent } from './shared/modals/image-upload/image-upload.component';
import { ModelEdit } from './shared/modals/model-edit/model-edit.component';
import { ModelDelete } from './shared/modals/model-delete/model-delete.component';
import { Tables } from './shared/modals/tables/tables.component';
import { TournamentStatusComponent } from './global-actions/tournament-status/tournament-status.component';
import { TournamentSettingsComponent } from './pages/tournament-settings/tournament-settings.component';
import { ImagesComponent } from './pages/images/images.component';
import {RequestInterceptor} from "./shared/services/request-interceptor";
import {ErrorLogger} from "./shared/services/error-logger";
import { TeamPipe } from './pages/teams/pipes/team.pipe';
import { BoldPartStringPipe } from './pages/teams/pipes/bold-part-string.pipe';
import { TeamMatchesPipe } from './pages/matches/pipes/team-matches.pipe';
import { BoldPartNumberPipe } from './pages/matches/pipes/bold-part-number.pipe';
import { TimeLeftPipe } from './shared/pipes/time-left.pipe';

const appRoutes = [
  {path: 'settings', component: TournamentSettingsComponent},
  {path: 'images', component: ImagesComponent},
  {path: 'teams', component: TeamsComponent},
  {path: 'matches', component: MatchesComponent}
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
    ImagesComponent,
    TeamPipe,
    BoldPartStringPipe,
    TeamMatchesPipe,
    BoldPartNumberPipe,
    TimeLeftPipe
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
