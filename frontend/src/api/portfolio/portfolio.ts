/**
 * Generated by orval v6.21.0 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import { useQuery } from "react-query";
import type {
  QueryFunction,
  QueryKey,
  UseQueryOptions,
  UseQueryResult,
} from "react-query";
import type {
  HTTPValidationError,
  ListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetParams,
  PortfolioCostList,
  PortfolioCostStat,
  PortfolioScheme,
} from "../../models";
import { customInstance } from ".././axios";
import type { ErrorType } from ".././axios";

// eslint-disable-next-line
type SecondParameter<T extends (...args: any) => any> = T extends (
  config: any,
  args: infer P
) => any
  ? P
  : never;

/**
 * @summary Get Latest Portfolio
 */
export const getLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet = (
  subaccountId: number,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<PortfolioScheme>(
    {
      url: `/api/v1/subaccounts/${subaccountId}/portfolio`,
      method: "GET",
      signal,
    },
    options
  );
};

export const getGetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGetQueryKey =
  (subaccountId: number) => {
    return [`/api/v1/subaccounts/${subaccountId}/portfolio`] as const;
  };

export const getGetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGetQueryOptions =
  <
    TData = Awaited<
      ReturnType<
        typeof getLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet
      >
    >,
    TError = ErrorType<HTTPValidationError>
  >(
    subaccountId: number,
    options?: {
      query?: UseQueryOptions<
        Awaited<
          ReturnType<
            typeof getLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet
          >
        >,
        TError,
        TData
      >;
      request?: SecondParameter<typeof customInstance>;
    }
  ) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey =
      queryOptions?.queryKey ??
      getGetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGetQueryKey(
        subaccountId
      );

    const queryFn: QueryFunction<
      Awaited<
        ReturnType<
          typeof getLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet
        >
      >
    > = ({ signal }) =>
      getLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet(
        subaccountId,
        requestOptions,
        signal
      );

    return {
      queryKey,
      queryFn,
      enabled: !!subaccountId,
      ...queryOptions,
    } as UseQueryOptions<
      Awaited<
        ReturnType<
          typeof getLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet
        >
      >,
      TError,
      TData
    > & { queryKey: QueryKey };
  };

export type GetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGetQueryResult =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet
      >
    >
  >;
export type GetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGetQueryError =
  ErrorType<HTTPValidationError>;

/**
 * @summary Get Latest Portfolio
 */
export const useGetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet = <
  TData = Awaited<
    ReturnType<
      typeof getLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet
    >
  >,
  TError = ErrorType<HTTPValidationError>
>(
  subaccountId: number,
  options?: {
    query?: UseQueryOptions<
      Awaited<
        ReturnType<
          typeof getLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGet
        >
      >,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions =
    getGetLatestPortfolioApiV1SubaccountsSubaccountIdPortfolioGetQueryOptions(
      subaccountId,
      options
    );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};

/**
 * @summary List Portfolio Cost
 */
export const listPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet = (
  subaccountId: number,
  params?: ListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetParams,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<PortfolioCostList>(
    {
      url: `/api/v1/subaccounts/${subaccountId}/portfolio-cost`,
      method: "GET",
      params,
      signal,
    },
    options
  );
};

export const getListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetQueryKey =
  (
    subaccountId: number,
    params?: ListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetParams
  ) => {
    return [
      `/api/v1/subaccounts/${subaccountId}/portfolio-cost`,
      ...(params ? [params] : []),
    ] as const;
  };

export const getListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetQueryOptions =
  <
    TData = Awaited<
      ReturnType<
        typeof listPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet
      >
    >,
    TError = ErrorType<HTTPValidationError>
  >(
    subaccountId: number,
    params?: ListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetParams,
    options?: {
      query?: UseQueryOptions<
        Awaited<
          ReturnType<
            typeof listPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet
          >
        >,
        TError,
        TData
      >;
      request?: SecondParameter<typeof customInstance>;
    }
  ) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey =
      queryOptions?.queryKey ??
      getListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetQueryKey(
        subaccountId,
        params
      );

    const queryFn: QueryFunction<
      Awaited<
        ReturnType<
          typeof listPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet
        >
      >
    > = ({ signal }) =>
      listPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet(
        subaccountId,
        params,
        requestOptions,
        signal
      );

    return {
      queryKey,
      queryFn,
      enabled: !!subaccountId,
      ...queryOptions,
    } as UseQueryOptions<
      Awaited<
        ReturnType<
          typeof listPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet
        >
      >,
      TError,
      TData
    > & { queryKey: QueryKey };
  };

export type ListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetQueryResult =
  NonNullable<
    Awaited<
      ReturnType<
        typeof listPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet
      >
    >
  >;
export type ListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetQueryError =
  ErrorType<HTTPValidationError>;

/**
 * @summary List Portfolio Cost
 */
export const useListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet =
  <
    TData = Awaited<
      ReturnType<
        typeof listPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet
      >
    >,
    TError = ErrorType<HTTPValidationError>
  >(
    subaccountId: number,
    params?: ListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetParams,
    options?: {
      query?: UseQueryOptions<
        Awaited<
          ReturnType<
            typeof listPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGet
          >
        >,
        TError,
        TData
      >;
      request?: SecondParameter<typeof customInstance>;
    }
  ): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
    const queryOptions =
      getListPortfolioCostApiV1SubaccountsSubaccountIdPortfolioCostGetQueryOptions(
        subaccountId,
        params,
        options
      );

    const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
      queryKey: QueryKey;
    };

    query.queryKey = queryOptions.queryKey;

    return query;
  };

/**
 * @summary Get Portfolio Cost Stat
 */
export const getPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet = (
  subaccountId: number,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<PortfolioCostStat>(
    {
      url: `/api/v1/subaccounts/${subaccountId}/stats/cost`,
      method: "GET",
      signal,
    },
    options
  );
};

export const getGetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGetQueryKey =
  (subaccountId: number) => {
    return [`/api/v1/subaccounts/${subaccountId}/stats/cost`] as const;
  };

export const getGetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGetQueryOptions =
  <
    TData = Awaited<
      ReturnType<
        typeof getPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet
      >
    >,
    TError = ErrorType<HTTPValidationError>
  >(
    subaccountId: number,
    options?: {
      query?: UseQueryOptions<
        Awaited<
          ReturnType<
            typeof getPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet
          >
        >,
        TError,
        TData
      >;
      request?: SecondParameter<typeof customInstance>;
    }
  ) => {
    const { query: queryOptions, request: requestOptions } = options ?? {};

    const queryKey =
      queryOptions?.queryKey ??
      getGetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGetQueryKey(
        subaccountId
      );

    const queryFn: QueryFunction<
      Awaited<
        ReturnType<
          typeof getPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet
        >
      >
    > = ({ signal }) =>
      getPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet(
        subaccountId,
        requestOptions,
        signal
      );

    return {
      queryKey,
      queryFn,
      enabled: !!subaccountId,
      ...queryOptions,
    } as UseQueryOptions<
      Awaited<
        ReturnType<
          typeof getPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet
        >
      >,
      TError,
      TData
    > & { queryKey: QueryKey };
  };

export type GetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGetQueryResult =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet
      >
    >
  >;
export type GetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGetQueryError =
  ErrorType<HTTPValidationError>;

/**
 * @summary Get Portfolio Cost Stat
 */
export const useGetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet = <
  TData = Awaited<
    ReturnType<
      typeof getPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet
    >
  >,
  TError = ErrorType<HTTPValidationError>
>(
  subaccountId: number,
  options?: {
    query?: UseQueryOptions<
      Awaited<
        ReturnType<
          typeof getPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGet
        >
      >,
      TError,
      TData
    >;
    request?: SecondParameter<typeof customInstance>;
  }
): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions =
    getGetPortfolioCostStatApiV1SubaccountsSubaccountIdStatsCostGetQueryOptions(
      subaccountId,
      options
    );

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};
