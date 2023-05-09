/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import {
  useQuery
} from 'react-query'
import type {
  UseQueryOptions,
  QueryFunction,
  UseQueryResult,
  QueryKey
} from 'react-query'
import type {
  PageOperationScheme,
  HTTPValidationError,
  ListOperationsApiV1SubaccountsSubaccountIdOperationsGetParams,
  ActiveOrderScheme,
  OperationStats,
  RevenueStats
} from '../../models'
import { customInstance } from '.././axios'
import type { ErrorType } from '.././axios'

type AwaitedInput<T> = PromiseLike<T> | T;

      type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;


// eslint-disable-next-line
  type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P,
) => any
  ? P
  : never;

/**
 * @summary List Operations
 */
export const listOperationsApiV1SubaccountsSubaccountIdOperationsGet = (
    subaccountId: number,
    params?: ListOperationsApiV1SubaccountsSubaccountIdOperationsGetParams,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      return customInstance<PageOperationScheme>(
      {url: `/api/v1/subaccounts/${subaccountId}/operations`, method: 'get',
        params, signal
    },
      options);
    }
  

export const getListOperationsApiV1SubaccountsSubaccountIdOperationsGetQueryKey = (subaccountId: number,
    params?: ListOperationsApiV1SubaccountsSubaccountIdOperationsGetParams,) => [`/api/v1/subaccounts/${subaccountId}/operations`, ...(params ? [params]: [])];

    
export type ListOperationsApiV1SubaccountsSubaccountIdOperationsGetQueryResult = NonNullable<Awaited<ReturnType<typeof listOperationsApiV1SubaccountsSubaccountIdOperationsGet>>>
export type ListOperationsApiV1SubaccountsSubaccountIdOperationsGetQueryError = ErrorType<HTTPValidationError>

export const useListOperationsApiV1SubaccountsSubaccountIdOperationsGet = <TData = Awaited<ReturnType<typeof listOperationsApiV1SubaccountsSubaccountIdOperationsGet>>, TError = ErrorType<HTTPValidationError>>(
 subaccountId: number,
    params?: ListOperationsApiV1SubaccountsSubaccountIdOperationsGetParams, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listOperationsApiV1SubaccountsSubaccountIdOperationsGet>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListOperationsApiV1SubaccountsSubaccountIdOperationsGetQueryKey(subaccountId,params);

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listOperationsApiV1SubaccountsSubaccountIdOperationsGet>>> = ({ signal }) => listOperationsApiV1SubaccountsSubaccountIdOperationsGet(subaccountId,params, requestOptions, signal);

  const query = useQuery<Awaited<ReturnType<typeof listOperationsApiV1SubaccountsSubaccountIdOperationsGet>>, TError, TData>(queryKey, queryFn, {enabled: !!(subaccountId), ...queryOptions}) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
}

/**
 * @summary List Active Orders
 */
export const listActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet = (
    subaccountId: number,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      return customInstance<ActiveOrderScheme[]>(
      {url: `/api/v1/subaccounts/${subaccountId}/active-orders`, method: 'get', signal
    },
      options);
    }
  

export const getListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryKey = (subaccountId: number,) => [`/api/v1/subaccounts/${subaccountId}/active-orders`];

    
export type ListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryResult = NonNullable<Awaited<ReturnType<typeof listActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet>>>
export type ListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryError = ErrorType<HTTPValidationError>

export const useListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet = <TData = Awaited<ReturnType<typeof listActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet>>, TError = ErrorType<HTTPValidationError>>(
 subaccountId: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof listActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getListActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGetQueryKey(subaccountId);

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof listActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet>>> = ({ signal }) => listActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet(subaccountId, requestOptions, signal);

  const query = useQuery<Awaited<ReturnType<typeof listActiveOrdersApiV1SubaccountsSubaccountIdActiveOrdersGet>>, TError, TData>(queryKey, queryFn, {enabled: !!(subaccountId), ...queryOptions}) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
}

/**
 * @summary Get Daily Operations Stats
 */
export const getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet = (
    subaccountId: number,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      return customInstance<OperationStats>(
      {url: `/api/v1/subaccounts/${subaccountId}/stats/operations`, method: 'get', signal
    },
      options);
    }
  

export const getGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGetQueryKey = (subaccountId: number,) => [`/api/v1/subaccounts/${subaccountId}/stats/operations`];

    
export type GetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGetQueryResult = NonNullable<Awaited<ReturnType<typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet>>>
export type GetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGetQueryError = ErrorType<HTTPValidationError>

export const useGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet = <TData = Awaited<ReturnType<typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet>>, TError = ErrorType<HTTPValidationError>>(
 subaccountId: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGetQueryKey(subaccountId);

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet>>> = ({ signal }) => getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet(subaccountId, requestOptions, signal);

  const query = useQuery<Awaited<ReturnType<typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet>>, TError, TData>(queryKey, queryFn, {enabled: !!(subaccountId), ...queryOptions}) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
}

/**
 * @summary Get Portfolio Revenue
 */
export const getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet = (
    subaccountId: number,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      return customInstance<RevenueStats>(
      {url: `/api/v1/subaccounts/${subaccountId}/stats/revenue`, method: 'get', signal
    },
      options);
    }
  

export const getGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGetQueryKey = (subaccountId: number,) => [`/api/v1/subaccounts/${subaccountId}/stats/revenue`];

    
export type GetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGetQueryResult = NonNullable<Awaited<ReturnType<typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet>>>
export type GetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGetQueryError = ErrorType<HTTPValidationError>

export const useGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet = <TData = Awaited<ReturnType<typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet>>, TError = ErrorType<HTTPValidationError>>(
 subaccountId: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGetQueryKey(subaccountId);

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet>>> = ({ signal }) => getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet(subaccountId, requestOptions, signal);

  const query = useQuery<Awaited<ReturnType<typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet>>, TError, TData>(queryKey, queryFn, {enabled: !!(subaccountId), ...queryOptions}) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
}

