import axios, {AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig} from 'axios';

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

httpClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem('BCP-Token');
    const commonHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': 'true',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Origin, Content-Type, Accept, X-Custom-Header, Upgrade-Insecure-Requests',
    };

    if (config.headers) {
      Object.entries(commonHeaders).forEach(([key, value]) => {
        config.headers[key] = value;
      });
      const contentType = String(config.headers['Content-Type'] || config.headers['content-type'] || '');
      const isMultipartRequest = contentType.toLowerCase().includes('multipart/form-data');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      config.headers['Content-Type'] = isMultipartRequest ? 'multipart/form-data' : 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

async function fetchNewToken() {
  const tokenRequest = {
    name: import.meta.env.VITE_TOKEN_NAME,
    guid: import.meta.env.VITE_TOKEN_GUID,
    id: import.meta.env.VITE_TOKEN_ID,
  };
  const response = await httpClient.post(httpClient.defaults.baseURL + 'Token', tokenRequest);
  sessionStorage.setItem('BCP-Token', response.data);
  return response.data;
}

type FailedQueueItem = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let failedQueue: FailedQueueItem[] = [];

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else if (token) {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>(function (resolve, reject) {
          failedQueue.push({resolve, reject});
        })
          .then((token) => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token;
            return httpClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const newToken = await fetchNewToken();
        processQueue(null, newToken);
        originalRequest.headers['Authorization'] = 'Bearer ' + newToken;
        return httpClient(originalRequest);
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const http = {
  get: async <T = unknown,>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await httpClient.get(httpClient.defaults.baseURL + url, config);
    return response.data;
  },

  post: async <T = unknown,>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await httpClient.post(httpClient.defaults.baseURL + url, data, config);
    return response.data;
  },

  put: async <T = unknown,>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await httpClient.put(httpClient.defaults.baseURL + url, data, config);
    return response.data;
  },

  patch: async <T = unknown,>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await httpClient.patch(httpClient.defaults.baseURL + url, data, config);
    return response.data;
  },

  delete: async <T = unknown,>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    const response: AxiosResponse<T> = await httpClient.delete(httpClient.defaults.baseURL + url, config);
    return response.data;
  },
};

export default httpClient;
