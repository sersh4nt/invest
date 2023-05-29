import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import { RegisterFormInput } from "../../store/authSlice";
import { useNavigate } from "react-router-dom";

const RegisterForm: React.FC = () => {
  const navigate = useNavigate();
  const { register, isLoading, error, login } = useAuth();

  const { control, handleSubmit, getValues } = useForm({
    defaultValues: { email: "", password: "", passwordConfirmation: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async (data: RegisterFormInput) => {
    const isRegistered = await register(data);
    if (isRegistered) {
      login({ ...data, persist: true });
      navigate("/");
    }
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
      <Controller
        control={control}
        name="passwordConfirmation"
        rules={{
          required: true,
          validate: (value: string) => {
            const { password } = getValues();
            return value == password || "Пароли не совпадают!";
          },
        }}
        render={({ field, fieldState }) => (
          <PasswordInput
            {...field}
            label="Подтверждение пароля"
            placeholder="********"
            withAsterisk
            mt="md"
            error={fieldState?.error?.message}
          />
        )}
      />
      <Button fullWidth mt="xl" type="submit" loading={isLoading}>
        Зарегистрироваться
      </Button>
      {error && <Text color="red">{error}</Text>}
    </form>
  );
};

export default RegisterForm;
