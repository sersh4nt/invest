/**
 * Generated by orval v6.10.3 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import {
  useQuery,
  useMutation
} from 'react-query'
import type {
  UseQueryOptions,
  UseMutationOptions,
  QueryFunction,
  MutationFunction,
  UseQueryResult,
  QueryKey
} from 'react-query'
import type {
  AccountScheme,
  HTTPValidationError,
  AccountCreate,
  SubaccountScheme,
  SubaccountUpdate
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
 * @summary Get Accounts List
 */
export const getAccountsListApiV1AccountsGet = (
    
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      return customInstance<AccountScheme[]>(
      {url: `/api/v1/accounts`, method: 'get', signal
    },
      options);
    }
  

export const getGetAccountsListApiV1AccountsGetQueryKey = () => [`/api/v1/accounts`];

    
export type GetAccountsListApiV1AccountsGetQueryResult = NonNullable<Awaited<ReturnType<typeof getAccountsListApiV1AccountsGet>>>
export type GetAccountsListApiV1AccountsGetQueryError = ErrorType<unknown>

export const useGetAccountsListApiV1AccountsGet = <TData = Awaited<ReturnType<typeof getAccountsListApiV1AccountsGet>>, TError = ErrorType<unknown>>(
  options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAccountsListApiV1AccountsGet>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAccountsListApiV1AccountsGetQueryKey();

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAccountsListApiV1AccountsGet>>> = ({ signal }) => getAccountsListApiV1AccountsGet(requestOptions, signal);

  const query = useQuery<Awaited<ReturnType<typeof getAccountsListApiV1AccountsGet>>, TError, TData>(queryKey, queryFn, queryOptions) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
}

/**
 * @summary Create Account
 */
export const createAccountApiV1AccountsPost = (
    accountCreate: AccountCreate,
 options?: SecondParameter<typeof customInstance>,) => {
      return customInstance<AccountScheme>(
      {url: `/api/v1/accounts`, method: 'post',
      headers: {'Content-Type': 'application/json', },
      data: accountCreate
    },
      options);
    }
  


    export type CreateAccountApiV1AccountsPostMutationResult = NonNullable<Awaited<ReturnType<typeof createAccountApiV1AccountsPost>>>
    export type CreateAccountApiV1AccountsPostMutationBody = AccountCreate
    export type CreateAccountApiV1AccountsPostMutationError = ErrorType<HTTPValidationError>

    export const useCreateAccountApiV1AccountsPost = <TError = ErrorType<HTTPValidationError>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof createAccountApiV1AccountsPost>>, TError,{data: AccountCreate}, TContext>, request?: SecondParameter<typeof customInstance>}
) => {
      const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof createAccountApiV1AccountsPost>>, {data: AccountCreate}> = (props) => {
          const {data} = props ?? {};

          return  createAccountApiV1AccountsPost(data,requestOptions)
        }

      return useMutation<Awaited<ReturnType<typeof createAccountApiV1AccountsPost>>, TError, {data: AccountCreate}, TContext>(mutationFn, mutationOptions)
    }
    /**
 * @summary Get Account
 */
export const getAccountApiV1AccountsAccountIdGet = (
    accountId: number,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      return customInstance<AccountScheme>(
      {url: `/api/v1/accounts/${accountId}`, method: 'get', signal
    },
      options);
    }
  

export const getGetAccountApiV1AccountsAccountIdGetQueryKey = (accountId: number,) => [`/api/v1/accounts/${accountId}`];

    
export type GetAccountApiV1AccountsAccountIdGetQueryResult = NonNullable<Awaited<ReturnType<typeof getAccountApiV1AccountsAccountIdGet>>>
export type GetAccountApiV1AccountsAccountIdGetQueryError = ErrorType<HTTPValidationError>

export const useGetAccountApiV1AccountsAccountIdGet = <TData = Awaited<ReturnType<typeof getAccountApiV1AccountsAccountIdGet>>, TError = ErrorType<HTTPValidationError>>(
 accountId: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getAccountApiV1AccountsAccountIdGet>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetAccountApiV1AccountsAccountIdGetQueryKey(accountId);

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getAccountApiV1AccountsAccountIdGet>>> = ({ signal }) => getAccountApiV1AccountsAccountIdGet(accountId, requestOptions, signal);

  const query = useQuery<Awaited<ReturnType<typeof getAccountApiV1AccountsAccountIdGet>>, TError, TData>(queryKey, queryFn, {enabled: !!(accountId), ...queryOptions}) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
}

/**
 * @summary Edit Account
 */
export const editAccountApiV1AccountsAccountIdPut = (
    accountId: number,
    accountCreate: AccountCreate,
 options?: SecondParameter<typeof customInstance>,) => {
      return customInstance<AccountScheme>(
      {url: `/api/v1/accounts/${accountId}`, method: 'put',
      headers: {'Content-Type': 'application/json', },
      data: accountCreate
    },
      options);
    }
  


    export type EditAccountApiV1AccountsAccountIdPutMutationResult = NonNullable<Awaited<ReturnType<typeof editAccountApiV1AccountsAccountIdPut>>>
    export type EditAccountApiV1AccountsAccountIdPutMutationBody = AccountCreate
    export type EditAccountApiV1AccountsAccountIdPutMutationError = ErrorType<HTTPValidationError>

    export const useEditAccountApiV1AccountsAccountIdPut = <TError = ErrorType<HTTPValidationError>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof editAccountApiV1AccountsAccountIdPut>>, TError,{accountId: number;data: AccountCreate}, TContext>, request?: SecondParameter<typeof customInstance>}
) => {
      const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof editAccountApiV1AccountsAccountIdPut>>, {accountId: number;data: AccountCreate}> = (props) => {
          const {accountId,data} = props ?? {};

          return  editAccountApiV1AccountsAccountIdPut(accountId,data,requestOptions)
        }

      return useMutation<Awaited<ReturnType<typeof editAccountApiV1AccountsAccountIdPut>>, TError, {accountId: number;data: AccountCreate}, TContext>(mutationFn, mutationOptions)
    }
    /**
 * @summary Get Subaccounts
 */
export const getSubaccountsApiV1AccountsAccountIdSubaccountsGet = (
    accountId: number,
 options?: SecondParameter<typeof customInstance>,signal?: AbortSignal
) => {
      return customInstance<SubaccountScheme[]>(
      {url: `/api/v1/accounts/${accountId}/subaccounts`, method: 'get', signal
    },
      options);
    }
  

export const getGetSubaccountsApiV1AccountsAccountIdSubaccountsGetQueryKey = (accountId: number,) => [`/api/v1/accounts/${accountId}/subaccounts`];

    
export type GetSubaccountsApiV1AccountsAccountIdSubaccountsGetQueryResult = NonNullable<Awaited<ReturnType<typeof getSubaccountsApiV1AccountsAccountIdSubaccountsGet>>>
export type GetSubaccountsApiV1AccountsAccountIdSubaccountsGetQueryError = ErrorType<HTTPValidationError>

export const useGetSubaccountsApiV1AccountsAccountIdSubaccountsGet = <TData = Awaited<ReturnType<typeof getSubaccountsApiV1AccountsAccountIdSubaccountsGet>>, TError = ErrorType<HTTPValidationError>>(
 accountId: number, options?: { query?:UseQueryOptions<Awaited<ReturnType<typeof getSubaccountsApiV1AccountsAccountIdSubaccountsGet>>, TError, TData>, request?: SecondParameter<typeof customInstance>}

  ):  UseQueryResult<TData, TError> & { queryKey: QueryKey } => {

  const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey = queryOptions?.queryKey ?? getGetSubaccountsApiV1AccountsAccountIdSubaccountsGetQueryKey(accountId);

  

  const queryFn: QueryFunction<Awaited<ReturnType<typeof getSubaccountsApiV1AccountsAccountIdSubaccountsGet>>> = ({ signal }) => getSubaccountsApiV1AccountsAccountIdSubaccountsGet(accountId, requestOptions, signal);

  const query = useQuery<Awaited<ReturnType<typeof getSubaccountsApiV1AccountsAccountIdSubaccountsGet>>, TError, TData>(queryKey, queryFn, {enabled: !!(accountId), ...queryOptions}) as  UseQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;

  return query;
}

/**
 * @summary Edit Subaccount
 */
export const editSubaccountApiV1SubaccountsSubaccountIdPut = (
    subaccountId: number,
    subaccountUpdate: SubaccountUpdate,
 options?: SecondParameter<typeof customInstance>,) => {
      return customInstance<SubaccountScheme>(
      {url: `/api/v1/subaccounts/${subaccountId}`, method: 'put',
      headers: {'Content-Type': 'application/json', },
      data: subaccountUpdate
    },
      options);
    }
  


    export type EditSubaccountApiV1SubaccountsSubaccountIdPutMutationResult = NonNullable<Awaited<ReturnType<typeof editSubaccountApiV1SubaccountsSubaccountIdPut>>>
    export type EditSubaccountApiV1SubaccountsSubaccountIdPutMutationBody = SubaccountUpdate
    export type EditSubaccountApiV1SubaccountsSubaccountIdPutMutationError = ErrorType<HTTPValidationError>

    export const useEditSubaccountApiV1SubaccountsSubaccountIdPut = <TError = ErrorType<HTTPValidationError>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof editSubaccountApiV1SubaccountsSubaccountIdPut>>, TError,{subaccountId: number;data: SubaccountUpdate}, TContext>, request?: SecondParameter<typeof customInstance>}
) => {
      const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof editSubaccountApiV1SubaccountsSubaccountIdPut>>, {subaccountId: number;data: SubaccountUpdate}> = (props) => {
          const {subaccountId,data} = props ?? {};

          return  editSubaccountApiV1SubaccountsSubaccountIdPut(subaccountId,data,requestOptions)
        }

      return useMutation<Awaited<ReturnType<typeof editSubaccountApiV1SubaccountsSubaccountIdPut>>, TError, {subaccountId: number;data: SubaccountUpdate}, TContext>(mutationFn, mutationOptions)
    }
    /**
 * @summary Cancel All Orders
 */
export const cancelAllOrdersApiV1SubaccountsSubaccountIdPost = (
    subaccountId: number,
 options?: SecondParameter<typeof customInstance>,) => {
      return customInstance<unknown>(
      {url: `/api/v1/subaccounts/${subaccountId}`, method: 'post'
    },
      options);
    }
  


    export type CancelAllOrdersApiV1SubaccountsSubaccountIdPostMutationResult = NonNullable<Awaited<ReturnType<typeof cancelAllOrdersApiV1SubaccountsSubaccountIdPost>>>
    
    export type CancelAllOrdersApiV1SubaccountsSubaccountIdPostMutationError = ErrorType<HTTPValidationError>

    export const useCancelAllOrdersApiV1SubaccountsSubaccountIdPost = <TError = ErrorType<HTTPValidationError>,
    
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof cancelAllOrdersApiV1SubaccountsSubaccountIdPost>>, TError,{subaccountId: number}, TContext>, request?: SecondParameter<typeof customInstance>}
) => {
      const {mutation: mutationOptions, request: requestOptions} = options ?? {};

      


      const mutationFn: MutationFunction<Awaited<ReturnType<typeof cancelAllOrdersApiV1SubaccountsSubaccountIdPost>>, {subaccountId: number}> = (props) => {
          const {subaccountId} = props ?? {};

          return  cancelAllOrdersApiV1SubaccountsSubaccountIdPost(subaccountId,requestOptions)
        }

      return useMutation<Awaited<ReturnType<typeof cancelAllOrdersApiV1SubaccountsSubaccountIdPost>>, TError, {subaccountId: number}, TContext>(mutationFn, mutationOptions)
    }
    