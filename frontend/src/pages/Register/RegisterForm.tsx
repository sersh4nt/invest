import { Button, PasswordInput, Text, TextInput } from "@mantine/core";
import { Controller, useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";

const RegisterForm: React.FC = () => {
  const { register, isLoading, error } = useAuth();

  const { control, handleSubmit, getValues } = useForm({
    defaultValues: { username: "", password: "", passwordConfirmation: "" },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }) => {
    await register(username, password);
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
            return value == password || "Passwords mismatch!";
          },
        }}
        render={({ field, fieldState }) => (
          <PasswordInput
            {...field}
            label="Password confirmation"
            placeholder="********"
            withAsterisk
            mt="md"
            error={fieldState?.error?.message}
          />
        )}
      />
      <Button fullWidth mt="xl" type="submit" loading={isLoading}>
        Register account
      </Button>
      {error && <Text color="red">{error}</Text>}
    </form>
  );
};

export default RegisterForm;
