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
  OperationStats,
  PortfolioCostStat,
  RevenueStats,
  WorkersStats,
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

/**
 * @summary Get Daily Operations Stats
 */
export const getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet =
  (
    subaccountId: number,
    options?: SecondParameter<typeof customInstance>,
    signal?: AbortSignal
  ) => {
    return customInstance<OperationStats>(
      {
        url: `/api/v1/subaccounts/${subaccountId}/stats/operations`,
        method: "GET",
        signal,
      },
      options
    );
  };

export const getGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGetQueryKey =
  (subaccountId: number) => {
    return [`/api/v1/subaccounts/${subaccountId}/stats/operations`] as const;
  };

export const getGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGetQueryOptions =
  <
    TData = Awaited<
      ReturnType<
        typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet
      >
    >,
    TError = ErrorType<HTTPValidationError>
  >(
    subaccountId: number,
    options?: {
      query?: UseQueryOptions<
        Awaited<
          ReturnType<
            typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet
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
      getGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGetQueryKey(
        subaccountId
      );

    const queryFn: QueryFunction<
      Awaited<
        ReturnType<
          typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet
        >
      >
    > = ({ signal }) =>
      getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet(
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
          typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet
        >
      >,
      TError,
      TData
    > & { queryKey: QueryKey };
  };

export type GetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGetQueryResult =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet
      >
    >
  >;
export type GetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGetQueryError =
  ErrorType<HTTPValidationError>;

/**
 * @summary Get Daily Operations Stats
 */
export const useGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet =
  <
    TData = Awaited<
      ReturnType<
        typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet
      >
    >,
    TError = ErrorType<HTTPValidationError>
  >(
    subaccountId: number,
    options?: {
      query?: UseQueryOptions<
        Awaited<
          ReturnType<
            typeof getDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGet
          >
        >,
        TError,
        TData
      >;
      request?: SecondParameter<typeof customInstance>;
    }
  ): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
    const queryOptions =
      getGetDailyOperationsStatsApiV1SubaccountsSubaccountIdStatsOperationsGetQueryOptions(
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
 * @summary Get Portfolio Revenue
 */
export const getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet = (
  subaccountId: number,
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<RevenueStats>(
    {
      url: `/api/v1/subaccounts/${subaccountId}/stats/revenue`,
      method: "GET",
      signal,
    },
    options
  );
};

export const getGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGetQueryKey =
  (subaccountId: number) => {
    return [`/api/v1/subaccounts/${subaccountId}/stats/revenue`] as const;
  };

export const getGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGetQueryOptions =
  <
    TData = Awaited<
      ReturnType<
        typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet
      >
    >,
    TError = ErrorType<HTTPValidationError>
  >(
    subaccountId: number,
    options?: {
      query?: UseQueryOptions<
        Awaited<
          ReturnType<
            typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet
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
      getGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGetQueryKey(
        subaccountId
      );

    const queryFn: QueryFunction<
      Awaited<
        ReturnType<
          typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet
        >
      >
    > = ({ signal }) =>
      getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet(
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
          typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet
        >
      >,
      TError,
      TData
    > & { queryKey: QueryKey };
  };

export type GetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGetQueryResult =
  NonNullable<
    Awaited<
      ReturnType<
        typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet
      >
    >
  >;
export type GetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGetQueryError =
  ErrorType<HTTPValidationError>;

/**
 * @summary Get Portfolio Revenue
 */
export const useGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet =
  <
    TData = Awaited<
      ReturnType<
        typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet
      >
    >,
    TError = ErrorType<HTTPValidationError>
  >(
    subaccountId: number,
    options?: {
      query?: UseQueryOptions<
        Awaited<
          ReturnType<
            typeof getPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGet
          >
        >,
        TError,
        TData
      >;
      request?: SecondParameter<typeof customInstance>;
    }
  ): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
    const queryOptions =
      getGetPortfolioRevenueApiV1SubaccountsSubaccountIdStatsRevenueGetQueryOptions(
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
 * @summary Get Active Workers Count
 */
export const getActiveWorkersCountApiV1WorkersStatsActiveGet = (
  options?: SecondParameter<typeof customInstance>,
  signal?: AbortSignal
) => {
  return customInstance<WorkersStats>(
    { url: `/api/v1/workers/stats/active`, method: "GET", signal },
    options
  );
};

export const getGetActiveWorkersCountApiV1WorkersStatsActiveGetQueryKey =
  () => {
    return [`/api/v1/workers/stats/active`] as const;
  };

export const getGetActiveWorkersCountApiV1WorkersStatsActiveGetQueryOptions = <
  TData = Awaited<
    ReturnType<typeof getActiveWorkersCountApiV1WorkersStatsActiveGet>
  >,
  TError = ErrorType<unknown>
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getActiveWorkersCountApiV1WorkersStatsActiveGet>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const { query: queryOptions, request: requestOptions } = options ?? {};

  const queryKey =
    queryOptions?.queryKey ??
    getGetActiveWorkersCountApiV1WorkersStatsActiveGetQueryKey();

  const queryFn: QueryFunction<
    Awaited<ReturnType<typeof getActiveWorkersCountApiV1WorkersStatsActiveGet>>
  > = ({ signal }) =>
    getActiveWorkersCountApiV1WorkersStatsActiveGet(requestOptions, signal);

  return { queryKey, queryFn, ...queryOptions } as UseQueryOptions<
    Awaited<ReturnType<typeof getActiveWorkersCountApiV1WorkersStatsActiveGet>>,
    TError,
    TData
  > & { queryKey: QueryKey };
};

export type GetActiveWorkersCountApiV1WorkersStatsActiveGetQueryResult =
  NonNullable<
    Awaited<ReturnType<typeof getActiveWorkersCountApiV1WorkersStatsActiveGet>>
  >;
export type GetActiveWorkersCountApiV1WorkersStatsActiveGetQueryError =
  ErrorType<unknown>;

/**
 * @summary Get Active Workers Count
 */
export const useGetActiveWorkersCountApiV1WorkersStatsActiveGet = <
  TData = Awaited<
    ReturnType<typeof getActiveWorkersCountApiV1WorkersStatsActiveGet>
  >,
  TError = ErrorType<unknown>
>(options?: {
  query?: UseQueryOptions<
    Awaited<ReturnType<typeof getActiveWorkersCountApiV1WorkersStatsActiveGet>>,
    TError,
    TData
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseQueryResult<TData, TError> & { queryKey: QueryKey } => {
  const queryOptions =
    getGetActiveWorkersCountApiV1WorkersStatsActiveGetQueryOptions(options);

  const query = useQuery(queryOptions) as UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
  };

  query.queryKey = queryOptions.queryKey;

  return query;
};
