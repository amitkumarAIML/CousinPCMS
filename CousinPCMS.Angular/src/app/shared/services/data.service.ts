import {Injectable} from '@angular/core';
import {BehaviorSubject, catchError, map, Observable, of, retry, tap, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {NzMessageService} from 'ng-zorro-antd/message';
import {HttpClient} from '@angular/common/http';
import {TranslateService} from '@ngx-translate/core';
import {Router} from '@angular/router';
import {NzTableSortFn} from 'ng-zorro-antd/table';
import { LoginRequestModel } from '../models/loginModel';
import { APIResult } from '../models/generalModel';
import { HttpService } from './http.service';
import { CommodityCode, CommodityCodeResponse } from '../models/commodityCodeModel';
import { Country, CountryResponse } from '../models/countryOriginModel';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(
    private readonly http: HttpClient,
    private readonly message: NzMessageService,
    private readonly translate: TranslateService,
    private readonly router: Router,
    private httpService: HttpService
  ) {
    const storedUser = sessionStorage.getItem('valid-user');
    if (storedUser) {
      this.validUserSubject.next(JSON.parse(storedUser));
    }
  }

  private validUserSubject = new BehaviorSubject<any | null>(null);

  getToken(): Observable<boolean> {
    const tokenRequest = {
      name: environment.token.name,
      guid: environment.token.guid,
      id: environment.token.id,
    };
    return this.http
      .post(environment.baseUrl + '/Token', tokenRequest, {responseType: 'text'})
      .pipe(
        retry({count: 3, delay: 3000}),
        tap((responseOfRequest: string) => {
          const token = responseOfRequest;
          sessionStorage.setItem('BCP-Token', token);
        }),
        map(() => true),
        catchError((err) => {
          this.ShowNotification('error', '', this.translate.instant(err?.error?.errorMessageKey));
          return of(false);
        }),
      );
  }

  ShowNotification(type: string, title: string, details: string): void {
    switch (type) {
      case 'success':
        this.message.success(details);
        break;
      case 'error':
        this.message.error(details);
        break;
      case 'warning':
        this.message.warning(details);
        break;
      case 'info':
        this.message.info(details);
        break;
      default:
        this.message.info(details);
        break;
    }
  }

  login(loginRequestModel: LoginRequestModel): Observable<APIResult<any>> {
    return this.http.post<any>(environment.baseUrl + 'api/Account/Login', loginRequestModel).pipe(
      tap((responseOfRequest) => {
        if (responseOfRequest.isSuccess) {
          responseOfRequest.value.decimalLength = '2';
          this.setValidUser(responseOfRequest.value);
            if (responseOfRequest.value.isEmployee) {
            this.router.navigate(['/warehouse-shipment']).then(() => {
              window.history.pushState(null, '', window.location.href);
              window.onpopstate = function () {
              window.history.pushState(null, '', window.location.href);
              };
            });
            } else {
            this.router.navigate(['/shipment']).then(() => {
              window.history.pushState(null, '', window.location.href);
              window.onpopstate = function () {
              window.history.pushState(null, '', window.location.href);
              };
            });
            }
        } else {
          this.ShowNotification('error', '', this.translate.instant('msgInvalidCredantial'));
        }
      }),
      catchError(() => {
        this.ShowNotification('error', '', this.translate.instant('SomethingWentWrong'));
        return of({
          isSuccess: false,
          isError: true,
          message: this.translate.instant('SomethingWentWrong'),
          result: null,
        });
      }),
    );
  }

  get validUser() {
    return this.validUserSubject.asObservable();
  }

  setValidUser(user: any) {
    sessionStorage.setItem('valid-user', JSON.stringify(user));
    this.validUserSubject.next(user);
  }

  logout() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
    window.onpopstate = null;
    this.validUserSubject.next(null);
  }

  getCommonSortFn(key: string): NzTableSortFn<any> {
    return (a: any, b: any) => {
      const valueA = a[key];
      const valueB = b[key];
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return -1;
      if (valueB == null) return 1;

      if (valueA instanceof Date && valueB instanceof Date) {
        return valueA.getTime() - valueB.getTime();
      }
      const dateA = this.parseDate(valueA);
      const dateB = this.parseDate(valueB);

      if (dateA && dateB) {
        return dateA.getTime() - dateB.getTime();
      } else if (typeof valueA === 'string' && typeof valueB === 'string') {
        return valueA.localeCompare(valueB);
      } else if (typeof valueA === 'number' && typeof valueB === 'number') {
        return valueA - valueB;
      } else {
        return String(valueA).localeCompare(String(valueB));
      }
    };
  }
  parseDate(value: any): Date | null {
    if (typeof value === 'string') {
      const parts = value.split('-');
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);

        if (!isNaN(day) && !isNaN(month) && !isNaN(year) && month >= 0 && month <= 11) {
          return new Date(year, month, day);
        }
      }
    }
    return null;
  }

  getCountryOrigin(): Observable<Country[]> {
    return this.httpService.get<CountryResponse>('Account/GetCountryOrigin').pipe(
      map((response: CountryResponse) => response.value),
      catchError(error => throwError(() => error))
    );
  }

  getCommodityCodes(): Observable<CommodityCode[]> {
    return this.httpService.get<CommodityCodeResponse>('Account/GetCommodityCodes').pipe(
      map((response: CommodityCodeResponse) => response.value),
      catchError(error => throwError(() => error))
    );
  }

  getAllCategory(): Observable<any> {
    return this.httpService.get<any>('Category/GetAllCategory').pipe(
      map(response => response.value),
      catchError(error => throwError(() => error))
    );
  }
}
