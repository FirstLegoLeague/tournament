import { BrowserModule } from '@angular/platform-browser'
import { ErrorHandler, NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FileDropModule } from 'ngx-file-drop'

import { AppComponent } from './app.component'
import { NavigationComponent } from './navigation/navigation.component'
import { GlobalActions } from './global-actions/global-actions.component'
import { TournamentStatusComponent } from './global-actions/tournament-status/tournament-status.component'

import { TeamsComponent } from './pages/teams/teams.component'
import { MatchesComponent } from './pages/matches/matches.component'
import { BoldPartStringPipe } from './pages/teams/pipes/bold-part-string.pipe'
import { TeamMatchesPipe } from './pages/matches/pipes/team-matches.pipe'
import { BoldPartNumberPipe } from './pages/matches/pipes/bold-part-number.pipe'
import { TeamPipe } from './pages/teams/pipes/team.pipe'
import { TournamentSettingsComponent } from './pages/tournament-settings/tournament-settings.component'
import { LogosComponent } from './pages/logos/logos.component'
import { LogoUploadComponent } from './pages/logos/logo-upload/logo-upload.component'

import { DataUpload } from './modals/data-upload/data-upload.component'
import { ModelEdit } from './modals/model-edit/model-edit.component'
import { ModelDelete } from './modals/model-delete/model-delete.component'
import { Tables } from './modals/tables/tables.component'

import { RequestInterceptor } from './shared/providers/request-interceptor'
import { ErrorLogger } from './shared/providers/error-logger'

import { TimeLeftPipe } from './shared/pipes/time-left.pipe'
import { UpperCaseFirstLetterPipe } from './shared/pipes/upper-case-first-letter.pipe'

const appRoutes = [
  { path: 'tournament-settings', component: TournamentSettingsComponent },
  { path: 'tournament-logos', component: LogosComponent },
  { path: 'tournament-teams', component: TeamsComponent },
  { path: 'tournament-matches', component: MatchesComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    GlobalActions,
    TeamsComponent,
    MatchesComponent,
    DataUpload,
    LogoUploadComponent,
    ModelEdit,
    ModelDelete,
    Tables,
    TournamentStatusComponent,
    TournamentSettingsComponent,
    LogosComponent,
    TeamPipe,
    BoldPartStringPipe,
    TeamMatchesPipe,
    BoldPartNumberPipe,
    TimeLeftPipe,
    UpperCaseFirstLetterPipe
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
