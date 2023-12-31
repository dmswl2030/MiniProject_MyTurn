import styled from "styled-components";
import logoImage from "../../assets/logo_2.png";
import LoginForm from "../../components/LoginForm";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <Container>
      <Wrapper>
        <ContainerLogo>
          <LogoImage src={logoImage} alt="로고" />
        </ContainerLogo>
        <ContainerForm>
          <Label>로그인</Label>
          <LoginForm />
          <SignUpText>
            <span>아직 회원이 아니신가요?</span>
            <Link to="/signup">
              <SignUpLink>회원가입</SignUpLink>
            </Link>
          </SignUpText>
        </ContainerForm>
      </Wrapper>
    </Container>
  );
};

export default Login;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.colors.green.light};
  min-height: 100vh;
`;

const Wrapper = styled.div`
  display: flex;
  width: 900px;
  height: 500px;
  border-radius: 1rem;
  box-shadow: 0px 0px 30px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;
const ContainerLogo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50%;
  background-color: ${(props) => props.theme.colors.green.dark};
`;
const ContainerForm = styled.div`
  width: 70%;
  background-color: ${(props) => props.theme.colors.white};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LogoImage = styled.img`
  align-items: center;
  width: 70%;
  margin-bottom: 10px;
`;

const Label = styled.label`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colors.orange.main};
  text-align: center;
  margin-bottom: 5px;
`;

const SignUpText = styled.p`
  display: flex;
  justify-content: center;
  font-size: 1rem;
  margin-top: 5px;
  color: ${({ theme }) => theme.colors.orange.main};
`;

const SignUpLink = styled.span`
  margin-left: 5px;
  font-weight: bold;
`;
