import { BrowserModule } from '@angular/platform-browser'
import { ErrorHandler, NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { RouterModule, Routes } from '@angular/router'
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http'
import { FileDropModule } from 'ngx-file-drop'

import { AppComponent } from './app.component'
import { NavigationComponent } from './navigation/navigation.component'

import { HomePageComponent } from './home/home-page/home-page.component'

import { ErrorLogger } from './services/error_logger.service'
import { RequestInterceptor } from './services/request_interceptor.service'

const appRoutes = [
  { path: 'home', component: HomePageComponent }
]

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    HomePageComponent
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
