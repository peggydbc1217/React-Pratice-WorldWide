import styled from "styled-components";
import Button from "../components/UI/Button.jsx";
import { useNavigate, useRouteError } from "react-router-dom";

const StyledDiv = styled.div`
  max-width: 991px;
  margin: 0 auto;
  margin-top: 300px;
  padding: 50px 0;
  border: 1px solid blue;
  text-align: center;
`;

const StyledH1 = styled.h1`
  color: green;
  text-align: center;
  padding: 20px 0;
`;

const StyledP = styled.p`
  color: red;
  text-align: center;
  padding-bottom: 15px;
  font-size: 30px;
`;

export default function PageNotFound() {
  const navigate = useNavigate();
  const error = useRouteError();
  console.log(error, "ooooooooooooooo");

  function handleOnClick(e) {
    navigate(-1);
  }

  return (
    <StyledDiv>
      <StyledH1>Something went wrong 😢😢😢😢😢😢😢😢😢</StyledH1>
      <StyledP>{error?.message}</StyledP>
      <Button type="primary" onClick={handleOnClick}>
        &larr;Back to previous page
      </Button>
    </StyledDiv>
  );
}
