import { Anchor, Container, Paper, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";

const Login: React.FC = () => {
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <Container size={420} my={40}>
      <Title
        align="center"
        sx={(theme) => ({
          fontFamily: `Greycliff CF, ${theme.fontFamily}`,
          fontWeight: 900,
        })}
      >
        Добро пожаловать!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Вы еще не зарегистрированы?{" "}
        <Anchor size="sm" component="button" onClick={handleRegister}>
          Создать аккаунт
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <LoginForm />
      </Paper>
    </Container>
  );
};

export default Login;
