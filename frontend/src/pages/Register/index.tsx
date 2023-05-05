import { Anchor, Container, Paper, Text, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import RegisterForm from "./RegisterForm";

const Register: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
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
        Create account
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Have an account?{" "}
        <Anchor size="sm" component="button" onClick={handleLogin}>
          Log in
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <RegisterForm />
      </Paper>
    </Container>
  );
};

export default Register;
