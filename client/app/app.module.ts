import { BrowserModule } from '@angular/platform-browser'
import { ErrorHandler, NgModule, APP_INITIALIZER } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FileDropModule } from 'ngx-file-drop'

import { AppComponent } from './app.component'
import { NavigationComponent } from './navigation/navigation.component'

import { HomePageComponent } from './home/home-page/home-page.component'

import { ErrorLogger } from './services/error_logger.service'
import { RequestInterceptor } from './services/request_interceptor.service'
import { RequestService } from './services/request.service';
import { ScheduleModalComponent } from './modals/schedule-modal/schedule-modal.component';
import { UploadFileComponent } from './generics/upload-file/upload-file.component'

const appRoutes = [
  { path: 'home', component: HomePageComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomePageComponent,
    ScheduleModalComponent,
    UploadFileComponent
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
