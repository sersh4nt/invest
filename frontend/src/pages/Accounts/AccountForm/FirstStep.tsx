import { Button, Center, Stack, TextInput } from "@mantine/core";
import { AxiosError } from "axios";
import { Controller, useForm } from "react-hook-form";
import { useCreateAccountApiV1AccountsPost } from "../../../api/accounts/accounts";
import { AccountScheme } from "../../../models";

interface FirstStepProps {
  onSuccess: (account: AccountScheme) => void;
}

const FirstStep: React.FC<FirstStepProps> = ({ onSuccess }) => {
  const { mutateAsync, isLoading } = useCreateAccountApiV1AccountsPost();

  const { control, setError, getValues } = useForm({
    defaultValues: { token: "", name: "", description: "" },
  });

  const handleCreate = async () => {
    try {
      const response = await mutateAsync({ data: getValues() });
      onSuccess(response);
    } catch (error) {
      if (error instanceof AxiosError) {
        setError("token", {
          type: "custom",
          message: error.response?.data.message,
        });
      }
    }
  };

  return (
    <Stack spacing="xs">
      <Controller
        name="token"
        rules={{ required: "This field is requred!" }}
        render={({ field, fieldState }) => (
          <TextInput
            {...field}
            error={fieldState.error?.message}
            withAsterisk
            label="Введите токен аккаунта, полученный у брокера"
            placeholder="t.hc703098rfh20913epuj0qwxcasd"
          />
        )}
        control={control}
      />
      <Controller
        name="name"
        render={({ field }) => (
          <TextInput
            {...field}
            label="Название аккаунта"
            placeholder="Аккаунт с облигациями"
          />
        )}
        control={control}
      />
      <Controller
        name="description"
        render={({ field }) => (
          <TextInput
            {...field}
            label="Описание аккаунта"
            placeholder="Этот аккаунт был создан 01.01.2019"
          />
        )}
        control={control}
      />
      <Center>
        <Button onClick={handleCreate} loading={isLoading}>
          Next
        </Button>
      </Center>
    </Stack>
  );
};

export default FirstStep;
