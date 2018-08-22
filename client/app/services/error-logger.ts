import {ErrorHandler, Inject, Injector} from "@angular/core";
import {HttpErrorResponse} from "@angular/common/http";
import {LoggerService} from "./logger.service";

export class ErrorLogger implements ErrorHandler {

    private logger

    constructor(@Inject(Injector) private injector: Injector) {
        this.logger = this.loggerService;
    }

    private get loggerService(): LoggerService {
        return this.injector.get(LoggerService);
    }

    handleError(error: Error | HttpErrorResponse): void {
        this.logger.error(error.message)
        console.error(error)
    }

}
