import {
  Anchor,
  Button,
  Checkbox,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

const LoginForm: React.FC = () => {
  const { login, isLoading, error, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken]);

  const { control, handleSubmit } = useForm({
    defaultValues: { username: "", password: "", persist: true },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async ({
    username,
    password,
    persist,
  }: {
    username: string;
    password: string;
    persist: boolean;
  }) => {
    await login(username, password, persist);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="username"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            label="Email"
            placeholder="admin@izdev.ru"
            withAsterisk
            error={fieldState?.error?.message}
          />
        )}
      />
      <Controller
        control={control}
        name="password"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <PasswordInput
            {...field}
            label="Password"
            placeholder="Your password"
            withAsterisk
            mt="md"
            error={fieldState?.error?.message}
          />
        )}
      />
      <Group position="apart" mt="lg">
        <Controller
          name="persist"
          control={control}
          render={({ field }) => (
            <Checkbox
              checked={field.value}
              onChange={field.onChange}
              label="Remember me"
            />
          )}
        />
        <Anchor component="button" size="sm">
          Forgot password?
        </Anchor>
      </Group>
      <Button fullWidth mt="xl" type="submit" loading={isLoading}>
        Sign in
      </Button>
      {error && <Text color="red">{error}</Text>}
    </form>
  );
};

export default LoginForm;
