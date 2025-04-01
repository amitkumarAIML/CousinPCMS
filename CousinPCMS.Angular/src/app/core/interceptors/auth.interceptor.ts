import {HttpInterceptorFn} from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let newReq;
  const token: string | null = sessionStorage.getItem('BCP-Token');
  const commonHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers':
      'Origin, Content-Type, Accept, X-Custom-Header, Upgrade-Insecure-Requests',
    'Content-Type': 'application/json',
  };

  const contentType = req.headers.get('content-type') || '';
  const isMultipartRequest = contentType.toLowerCase().includes('multipart/form-data');

  if (!token) {
    newReq = req.clone({
      setHeaders: commonHeaders,
    });
    return next(newReq);
  } else {
    if (isMultipartRequest) {
      newReq = req.clone({
        setHeaders: {
          ...commonHeaders,
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          observe: 'events',
        },
      });
    } else {
      newReq = req.clone({
        setHeaders: {
          ...commonHeaders,
          Authorization: `Bearer ${token}`,
        },
      });
    }
    return next(newReq);
  }
};
