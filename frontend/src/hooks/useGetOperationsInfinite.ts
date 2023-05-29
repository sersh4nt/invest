import {
  QueryFunction,
  QueryKey,
  UseInfiniteQueryOptions,
  UseInfiniteQueryResult,
  useInfiniteQuery,
} from "react-query";
import {
  getListOperationsApiV1SubaccountsSubaccountIdOperationsGetQueryKey,
  listOperationsApiV1SubaccountsSubaccountIdOperationsGet,
} from "../api/operations/operations";
import { HTTPValidationError } from "../models/hTTPValidationError";
import { ListOperationsApiV1SubaccountsSubaccountIdOperationsGetParams } from "../models";
import { ErrorType, customInstance } from "../api";

// eslint-disable-next-line
type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P
) => any
  ? P
  : never;

const useGetOperationsInfinite = <
  TData = Awaited<
    ReturnType<typeof listOperationsApiV1SubaccountsSubaccountIdOperationsGet>
  >,
  TError = ErrorType<HTTPValidationError>
>(
  subaccountId: number,
  params?: ListOperationsApiV1SubaccountsSubaccountIdOperationsGetParams,
  options?: {
    query?: UseInfiniteQueryOptions<
      Awaited<
        ReturnType<
          typeof listOperationsApiV1SubaccountsSubaccountIdOperationsGet
        >
      >,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const { query: queryOptions, request: requestOptions } = options ?? {};
  const queryKey =
    queryOptions?.queryKey ??
    getListOperationsApiV1SubaccountsSubaccountIdOperationsGetQueryKey(
      subaccountId,
      params
    );

  const queryFn: QueryFunction<
    Awaited<
      ReturnType<typeof listOperationsApiV1SubaccountsSubaccountIdOperationsGet>
    >
  > = ({ signal, pageParam = 0 }) =>
    listOperationsApiV1SubaccountsSubaccountIdOperationsGet(
      subaccountId,
      { ...params, page: pageParam },
      requestOptions,
      signal
    );

  const query = useInfiniteQuery<
    Awaited<
      ReturnType<typeof listOperationsApiV1SubaccountsSubaccountIdOperationsGet>
    >,
    TError,
    TData
  >(queryKey, queryFn, {
    enabled: !!subaccountId,
    ...queryOptions,
  }) as UseInfiniteQueryResult<TData, TError> & { queryKey: QueryKey };

  query.queryKey = queryKey;
  return query;
};

export default useGetOperationsInfinite;
