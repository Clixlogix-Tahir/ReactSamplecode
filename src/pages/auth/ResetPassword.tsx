import React, { useState } from "react";
import styled from "styled-components";
import { Helmet } from 'react-helmet';

import {
  FormControl as MuiFormControl,
  Input,
  Button as MuiButton,
  Paper,
  Typography,
  ThemeProvider,
  createMuiTheme,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import themes from "../../theme";
import { useAppDispatch, useAppSelector, useUrlQuery } from "../../common/hooks";
import { ROUTES, XHR_STATE } from "../../common/constants";
import { ReactComponent as Eye } from '../../custom-icons/Eye.svg';
import { ReactComponent as EyeOff } from '../../custom-icons/EyeOff.svg';
import { teamAccessDispatchers } from "../team-access-control-management/teamAccessControlSlice";
import globalStyles from "../../theme/globalStyles";
import * as CONSTANTS from '../team-access-control-management/constants';
import { Link } from "react-router-dom";


const theme = createMuiTheme({
  palette: {
    type: "dark"
  },
  typography: { ...themes[0].typography },
});

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

function ResetPassword() {
  const dispatch = useAppDispatch();
  const globalClasses = globalStyles();
  const searchParams = useUrlQuery();

  const { resetPassword } = useAppSelector(state => state.teamAccessControlSlice);

  const email = searchParams.get('email') || '';
  const resetKey = searchParams.get('resetKey') || '';

  const [passwd, setPasswd] = useState('');
  const [confirmPasswd, setConfirmPasswd] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [passwdError, setPasswdError] = useState('');

  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handlePasswdChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setPasswd(e.target.value as string);
  };

  const handleConfirmPasswdChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setConfirmPasswd(e.target.value as string);
  };

  const checkPasswdMismatch = () => {
    if (passwd && confirmPasswd) {
      if (passwd !== confirmPasswd) {
        return CONSTANTS.PASSWORD_MISMATCH_ERROR;
      }
    }
    return '';
  };

  const checkPasswdLength = () => {
    if (passwd.length < 5) { // || (confirmPasswd && confirmPasswd.length < 5)) {
      return CONSTANTS.PASSWORD_LENGTH_ERROR;
    }
    return '';
  };

  const checkSpacesInPasswd = () => {
    if (passwd.includes(' ')) { // || (confirmPasswd && confirmPasswd.length < 5)) {
      return CONSTANTS.PASSWORD_SPACE_ERROR;
    }
    return '';
  };

  const resetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const passwordLengthError = checkPasswdLength();
    const passwordMismatchError = checkPasswdMismatch();
    const passwordSpaceError = checkSpacesInPasswd();
    setSubmittedOnce(true);
    setPasswdError(passwordLengthError || passwordMismatchError || passwordSpaceError);
    if (passwordLengthError || passwordMismatchError || passwordSpaceError) {
      return;
    }
    dispatch(teamAccessDispatchers.resetPassword(
      email,
      passwd,
      resetKey,
      {
        success: () => {
          setSubmitSuccess(true);
        },
        error: () => {
          setSubmitError('reset password failed (todo)');
        },
      },
    ))
  };

  return (
    <LandingContainer>
      <Helmet title="Reset Password" />
      <Typography component="h1" variant="h2" align="center" gutterBottom>
        Reset Password
      </Typography>
      <ThemeProvider theme={theme}>
        <AuthPaper>
          {(!email || !resetKey) &&
            <Typography variant="h3" className={globalClasses.fieldError2}>
              Invalid URL. Please click button in email, or paste URL.
            </Typography>
          }
          {submitSuccess &&
            <Typography variant="h3">
              Password set successfully. <Link to={ROUTES.LOGIN}>Click here</Link> to login.
            </Typography>
          }
          {submitError &&
            <Typography variant="h3" className={globalClasses.fieldError2}>
              {submitError}
            </Typography>
          }
          {(email && resetKey && !submitSuccess) && <form onSubmit={resetPasswordSubmit}>
            <FormControl margin="normal" required fullWidth>
              <Input
                className="input"
                placeholder="Set Password"
                required
                name="password"
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={passwd}
                onChange={handlePasswdChange}
                error={submittedOnce && passwdError !== ''}
                //autoComplete="current-password"
                endAdornment={
                  <InputAdornment position="end">
                    {passwd && <IconButton onClick={e => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff /> : <Eye />}
                    </IconButton>}
                  </InputAdornment>
                }
              />
            </FormControl>
            <p className={globalClasses.fieldError2}>{passwdError}</p>

            <FormControl margin="normal" required fullWidth>
              <Input
                className="input"
                placeholder="Confirm Password"
                required
                name="password"
                type={showPasswordConfirm ? 'text' : 'password'}
                id="password-confirm"
                value={confirmPasswd}
                onChange={handleConfirmPasswdChange}
                error={submittedOnce && passwdError !== ''}
                //autoComplete="current-password"
                endAdornment={
                  <InputAdornment position="end">
                    {confirmPasswd && <IconButton onClick={e => setShowPasswordConfirm(!showPasswordConfirm)}>
                      {showPasswordConfirm ? <EyeOff /> : <Eye />}
                    </IconButton>}
                  </InputAdornment>
                }
              />
            </FormControl>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={resetPassword.loading === XHR_STATE.IN_PROGRESS}
              // disabled={true}
              // mt={2}
            >
              Set password
            </Button>
          </form>}
        </AuthPaper>
      </ThemeProvider>
    </LandingContainer>
  );
}

export default ResetPassword;
