import {
  Button,
  Checkbox,
  Group,
  PasswordInput,
  Text,
  TextInput,
} from "@mantine/core";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { LoginFormInput } from "../../store/authSlice";

const LoginForm: React.FC = () => {
  const [params] = useSearchParams();
  const { login, isLoading, error, accessToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (accessToken) {
      navigate("/");
    }
  }, [accessToken]);

  const { control, handleSubmit } = useForm({
    defaultValues: {
      email: params.get("email") ?? "",
      password: params.get("password") ?? "",
      persist: true,
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: LoginFormInput) => {
    await login(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        control={control}
        name="email"
        rules={{ required: true }}
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            label="E-mail"
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
            label="Пароль"
            placeholder="********"
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
              label="Запомнить меня"
            />
          )}
        />
      </Group>
      <Button fullWidth mt="xl" type="submit" loading={isLoading}>
        Войти
      </Button>
      {error && <Text color="red">{error}</Text>}
    </form>
  );
};

export default LoginForm;
