import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from './authentification.service';
import { environment } from 'src/environments/environment';
import { UserService } from './user.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  private readonly apiUrl: string;

  constructor(
    private authService: AuthenticationService,
    private userService: UserService
  ) { 
    this.apiUrl = `${this.userService.serverUrl}`;
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    if (request.url.startsWith('./assets')) {
      // TODO: what abour relative urls? -> maybe apply a prefix /api to each request
      return next.handle(request);
    }

    if (!request.url.startsWith(this.apiUrl)) {
      // TODO: what abour relative urls? -> maybe apply a prefix /api to each request
      return next.handle(request);
    }

    // TODO: restrict token to certain domains / endpoints
    request = this.addToken(request, this.authService.getAccessToken());
    return next.handle(request).pipe(
      catchError(error => {
        if (error instanceof HttpErrorResponse && error.status === 401) {
          // TODO: try token refresh first: this.tokenService.refreshToken();
          this.authService.logout();
        }
        return throwError(error);
      })
    );
  }

  addToken(request: HttpRequest<any>, accessToken: string) {
    if (!accessToken) { return request; }
    return request.clone({
      setHeaders: { Authorization: `Bearer ${accessToken}` }
    });
  }

}
