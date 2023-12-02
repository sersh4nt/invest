/**
 * Generated by orval v6.21.0 🍺
 * Do not edit manually.
 * Invest API
 * OpenAPI spec version: 0.1.0
 */
import { useMutation } from "react-query";
import type { MutationFunction, UseMutationOptions } from "react-query";
import type {
  BearerResponse,
  BodyAuthJwtLoginApiV1AuthLoginPost,
  ErrorModel,
  HTTPValidationError,
  UserCreate,
  UserRead,
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
 * @summary Auth:Jwt.Login
 */
export const authJwtLoginApiV1AuthLoginPost = (
  bodyAuthJwtLoginApiV1AuthLoginPost: BodyAuthJwtLoginApiV1AuthLoginPost,
  options?: SecondParameter<typeof customInstance>
) => {
  const formUrlEncoded = new URLSearchParams();
  if (bodyAuthJwtLoginApiV1AuthLoginPost.grant_type !== undefined) {
    formUrlEncoded.append(
      "grant_type",
      bodyAuthJwtLoginApiV1AuthLoginPost.grant_type
    );
  }
  formUrlEncoded.append(
    "username",
    bodyAuthJwtLoginApiV1AuthLoginPost.username
  );
  formUrlEncoded.append(
    "password",
    bodyAuthJwtLoginApiV1AuthLoginPost.password
  );
  if (bodyAuthJwtLoginApiV1AuthLoginPost.scope !== undefined) {
    formUrlEncoded.append("scope", bodyAuthJwtLoginApiV1AuthLoginPost.scope);
  }
  if (bodyAuthJwtLoginApiV1AuthLoginPost.client_id !== undefined) {
    formUrlEncoded.append(
      "client_id",
      bodyAuthJwtLoginApiV1AuthLoginPost.client_id
    );
  }
  if (bodyAuthJwtLoginApiV1AuthLoginPost.client_secret !== undefined) {
    formUrlEncoded.append(
      "client_secret",
      bodyAuthJwtLoginApiV1AuthLoginPost.client_secret
    );
  }

  return customInstance<BearerResponse>(
    {
      url: `/api/v1/auth/login`,
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      data: formUrlEncoded,
    },
    options
  );
};

export const getAuthJwtLoginApiV1AuthLoginPostMutationOptions = <
  TError = ErrorType<ErrorModel | HTTPValidationError>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authJwtLoginApiV1AuthLoginPost>>,
    TError,
    { data: BodyAuthJwtLoginApiV1AuthLoginPost },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof authJwtLoginApiV1AuthLoginPost>>,
  TError,
  { data: BodyAuthJwtLoginApiV1AuthLoginPost },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authJwtLoginApiV1AuthLoginPost>>,
    { data: BodyAuthJwtLoginApiV1AuthLoginPost }
  > = (props) => {
    const { data } = props ?? {};

    return authJwtLoginApiV1AuthLoginPost(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type AuthJwtLoginApiV1AuthLoginPostMutationResult = NonNullable<
  Awaited<ReturnType<typeof authJwtLoginApiV1AuthLoginPost>>
>;
export type AuthJwtLoginApiV1AuthLoginPostMutationBody =
  BodyAuthJwtLoginApiV1AuthLoginPost;
export type AuthJwtLoginApiV1AuthLoginPostMutationError = ErrorType<
  ErrorModel | HTTPValidationError
>;

/**
 * @summary Auth:Jwt.Login
 */
export const useAuthJwtLoginApiV1AuthLoginPost = <
  TError = ErrorType<ErrorModel | HTTPValidationError>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authJwtLoginApiV1AuthLoginPost>>,
    TError,
    { data: BodyAuthJwtLoginApiV1AuthLoginPost },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const mutationOptions =
    getAuthJwtLoginApiV1AuthLoginPostMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Auth:Jwt.Logout
 */
export const authJwtLogoutApiV1AuthLogoutPost = (
  options?: SecondParameter<typeof customInstance>
) => {
  return customInstance<unknown>(
    { url: `/api/v1/auth/logout`, method: "POST" },
    options
  );
};

export const getAuthJwtLogoutApiV1AuthLogoutPostMutationOptions = <
  TError = ErrorType<void>,
  TVariables = void,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authJwtLogoutApiV1AuthLogoutPost>>,
    TError,
    TVariables,
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof authJwtLogoutApiV1AuthLogoutPost>>,
  TError,
  TVariables,
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof authJwtLogoutApiV1AuthLogoutPost>>,
    TVariables
  > = () => {
    return authJwtLogoutApiV1AuthLogoutPost(requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type AuthJwtLogoutApiV1AuthLogoutPostMutationResult = NonNullable<
  Awaited<ReturnType<typeof authJwtLogoutApiV1AuthLogoutPost>>
>;

export type AuthJwtLogoutApiV1AuthLogoutPostMutationError = ErrorType<void>;

/**
 * @summary Auth:Jwt.Logout
 */
export const useAuthJwtLogoutApiV1AuthLogoutPost = <
  TError = ErrorType<void>,
  TVariables = void,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof authJwtLogoutApiV1AuthLogoutPost>>,
    TError,
    TVariables,
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const mutationOptions =
    getAuthJwtLogoutApiV1AuthLogoutPostMutationOptions(options);

  return useMutation(mutationOptions);
};
/**
 * @summary Register:Register
 */
export const registerRegisterApiV1AuthRegisterPost = (
  userCreate: UserCreate,
  options?: SecondParameter<typeof customInstance>
) => {
  return customInstance<UserRead>(
    {
      url: `/api/v1/auth/register`,
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: userCreate,
    },
    options
  );
};

export const getRegisterRegisterApiV1AuthRegisterPostMutationOptions = <
  TError = ErrorType<ErrorModel | HTTPValidationError>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof registerRegisterApiV1AuthRegisterPost>>,
    TError,
    { data: UserCreate },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}): UseMutationOptions<
  Awaited<ReturnType<typeof registerRegisterApiV1AuthRegisterPost>>,
  TError,
  { data: UserCreate },
  TContext
> => {
  const { mutation: mutationOptions, request: requestOptions } = options ?? {};

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof registerRegisterApiV1AuthRegisterPost>>,
    { data: UserCreate }
  > = (props) => {
    const { data } = props ?? {};

    return registerRegisterApiV1AuthRegisterPost(data, requestOptions);
  };

  return { mutationFn, ...mutationOptions };
};

export type RegisterRegisterApiV1AuthRegisterPostMutationResult = NonNullable<
  Awaited<ReturnType<typeof registerRegisterApiV1AuthRegisterPost>>
>;
export type RegisterRegisterApiV1AuthRegisterPostMutationBody = UserCreate;
export type RegisterRegisterApiV1AuthRegisterPostMutationError = ErrorType<
  ErrorModel | HTTPValidationError
>;

/**
 * @summary Register:Register
 */
export const useRegisterRegisterApiV1AuthRegisterPost = <
  TError = ErrorType<ErrorModel | HTTPValidationError>,
  TContext = unknown
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof registerRegisterApiV1AuthRegisterPost>>,
    TError,
    { data: UserCreate },
    TContext
  >;
  request?: SecondParameter<typeof customInstance>;
}) => {
  const mutationOptions =
    getRegisterRegisterApiV1AuthRegisterPostMutationOptions(options);

  return useMutation(mutationOptions);
};
