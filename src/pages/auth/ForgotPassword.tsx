import React, { useState } from "react";
import styled from "styled-components";
import { Helmet } from 'react-helmet';

import {
  FormControl as MuiFormControl,
  Input,
  Button as MuiButton,
  Paper,
  Typography
} from "@material-ui/core";
import { useAppDispatch, useAppSelector } from "../../common/hooks";
import globalStyles from "../../theme/globalStyles";
import { XHR_STATE } from "../../common/constants";
import { teamAccessDispatchers } from "../team-access-control-management/teamAccessControlSlice";


const LandingContainer = styled.div`
  min-height: calc(100vh - 66px);
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  position: relative;
  padding: 2rem 0;
  z-index: 1;
  a {
    color: rgb(72, 144, 232);
    font-weight: 500;
  }
`;

const AuthPaper = styled(Paper)`
  padding: ${props => props.theme.spacing(6)}px;
  border-radius: 6px;
  box-shadow: inset 0 0 8px 0 rgba(0, 0, 0, 0.19);
  background-image: linear-gradient(314deg, #0e1975 100%, #040b48 49%, #000e83 3%);
  width: 400px;
  max-width: 95%;
  color: #fff;

  ${props => props.theme.breakpoints.up("md")} {
    padding: ${props => props.theme.spacing(10)}px;
  }
`;

const FormControl = styled(MuiFormControl)`
  background: #fff;
  color: #000;
  border-radius: 5px;
  overflow: hidden;
  input,
  label,
  label.Mui-focused,
  svg {
    font-size: 18px;
    color: #000;
  }
  .input {
    padding-left: 12px;
    height: 40px;
  }
`;

const Button = styled(MuiButton)`
  background-color: rgb(72, 144, 232);
  display: block;
  margin: auto;
  border-radius: 7px;
  font-size: 18px;
  padding: 2px 2rem;
  margin-top: 1rem;
  &.MuiButton-contained.Mui-disabled {
    color: rgba(255, 255, 255, 0.3);
    background-color: rgb(72,144,232, .2);
  }
`;

function ForgotPassword() {
  const dispatch = useAppDispatch();
  const { forgotPassword } = useAppSelector(state => state.teamAccessControlSlice);
  const globalClasses = globalStyles();

  const [email, setEmail] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const forgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(teamAccessDispatchers.forgotPassword(
      email,
      {
        success: () => {
          setSubmitSuccess(true);
        },
        error: () => {
          setSubmitError(true);
        },
      }
    ));
  };

  const handleEmailChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setEmail(e.target.value as string);
  };

  return (
    <LandingContainer>
      <Helmet title="Forgot Password" />
      <Typography component="h1" variant="h4" align="center" gutterBottom>
        Forgot Password
      </Typography>
      <AuthPaper>
        <Typography component="h2" variant="body1" align="center">
          Enter your email to reset your password
        </Typography>
        <form onSubmit={forgotPasswordSubmit}>
          <FormControl margin="normal" required fullWidth>
            <Input id="email"
              className="input"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={handleEmailChange}
              autoFocus
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={forgotPassword.loading === XHR_STATE.IN_PROGRESS}
            // disabled={true}
            // mt={2}
          >
            Reset password
          </Button>
        </form>
        {submitSuccess &&
          <Typography>
            Please check your email for reset password link.
          </Typography>
        }
        {submitError &&
          <Typography
            className={globalClasses.fieldError2}
            align="center"
          >
            Something went wrong.
          </Typography>
        }
      </AuthPaper>
    </LandingContainer>
  );
}

export default ForgotPassword;
