import { useState, useRef, useEffect } from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { predefinedRequests } from './helpers';

type QueryInput = {
  key: string;
  urlParams?: any | null;
  bodyParams?: any | null;
};

type RequestItem = {
  key: string;
  request: AxiosRequestConfig;
  cacheDuration?: number;
};

type FetchState<T> = {
  data: T | null;
  error: Error | null;
  loading: boolean;
};

type FetchResult = {
  [key: string]: FetchState<any>;
};

const useFetch = (requests: QueryInput[]): [FetchResult, () => void] => {

  const [result, setResult] = useState<FetchResult>({});
  const [trigger, setTrigger] = useState(false);
  const requestsRef = useRef(requests);

  if (JSON.stringify(requests) !== JSON.stringify(requestsRef.current)) {
    requestsRef.current = requests;
  }

  useEffect(() => {
    const promises = requestsRef.current
      .map((req) => predefinedRequests(req.key, req.urlParams, req.bodyParams) as RequestItem)
      .map((item) => {
        const { key, request, cacheDuration = 0 } = item;

        const cachedData = sessionStorage.getItem(key);
        if (cachedData) {
          return Promise.resolve({ key, data: JSON.parse(cachedData), error: null, loading: false });
        }

        return axios(request).then((response) => {
          if (cacheDuration > 0) {
            sessionStorage.setItem(key, JSON.stringify(response.data));
            setTimeout(() => {
              sessionStorage.removeItem(key);
            }, cacheDuration);
          }
          return { key, data: response.data, error: null, loading: false };
        }).catch((error) => {
          return { key, data: null, error, loading: false };
        });
      });

    Promise.all(promises).then((results) => {
      const newResult: FetchResult = {};
      results.forEach((res) => {
        newResult[res.key] = { data: res.data, error: res.error, loading: res.loading };
      });
      setResult(newResult);
    });
  }, [requestsRef, trigger]);

  const refetch = () => {
    setTrigger(prev => !prev); // Toggle the trigger state to re-run the effect
  };

  return [result, refetch];
};

export default useFetch;