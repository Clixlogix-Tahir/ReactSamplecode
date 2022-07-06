/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button as MuiButton, FormControl as MuiFormControl, IconButton, Input,
  InputAdornment, Paper, Snackbar, Typography
} from "@material-ui/core";
import Cookies from "universal-cookie";
import { createMuiTheme } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";
import { ThemeProvider } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { authenticationBiEvents } from "../../bi/events/authenticationBiEvents";
import { ADMIN_USER_AUTH_TOKEN, ROUTES, CONSTANTS as CONSTANT, XHR_STATE } from "../../common/constants";
import {
  useAppDispatch,
  useAppRedirect, useAppSelector, useUrlQuery
} from "../../common/hooks";
import { ReactComponent as Eye } from "../../custom-icons/Eye.svg";
import { ReactComponent as EyeOff } from "../../custom-icons/EyeOff.svg";
import themes from "../../theme";
import globalStyles from "../../theme/globalStyles";
import * as CONSTANTS from "../team-access-control-management/constants";
import { teamAccessDispatchers } from "../team-access-control-management/teamAccessControlSlice";
import {
  TCmsUser,
  TLoginDto
} from "../team-access-control-management/teamAccessControlTypes";

const cookies = new Cookies();

const theme = createMuiTheme({
  palette: {
    type: "dark",
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
  padding: ${(props) => props.theme.spacing(6)}px;
  border-radius: 6px;
  box-shadow: inset 0 0 8px 0 rgba(0, 0, 0, 0.19);
  background-image: linear-gradient(
    314deg,
    #0e1975 100%,
    #040b48 49%,
    #000e83 3%
  );
  width: 400px;
  max-width: 95%;

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)}px;
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
    background-color: rgb(72, 144, 232, 0.2);
  }
`;

const SignInForm: React.FC<React.ReactNode> = () => {
  const globalClasses = globalStyles();
  const dispatch = useAppDispatch();
  const searchQuery = useUrlQuery();
  const redirectUrl = searchQuery.get("redirect");
  const redirectTo = useAppRedirect();
  const { cmsSignInUser } = useAppSelector(
    (state) => state.teamAccessControlSlice
  );
  const [email, setEmail] = useState<string>("");
  const [passwd, setPasswd] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState<string>("");
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>("");

    
  useEffect(() => {
    //( Bi Event : dev is on login tab )
    authenticationBiEvents.loginTab();
  }, []);

  useEffect(() => {
    checkEmailRegexValidity();
  }, [email]);

  useEffect(() => {
    if (
      cmsSignInUser.error !== "" &&
      cmsSignInUser.loading === XHR_STATE.ASLEEP
    ) {
     
      setSnackBarErrorText("Could not login. " + cmsSignInUser.error);
      if (cmsSignInUser.error.includes("User email not verified")) {
        setTimeout(() => {
          redirectTo(ROUTES.VERIFY_MAIL, { email: email, lastPage: CONSTANT.SIGNIN_PAGE });
        }, 1500);
        let loginDTo = {
          email: '',
          password: '',
          authToken: '',
        }
        dispatch(teamAccessDispatchers.clearSignIn(loginDTo))
      }
    }
  }, [cmsSignInUser]);

  const handleEmailChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setEmail(e.target.value as string);
  };

  const handlePasswdChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setPasswd(e.target.value as string);
  };

  const checkEmailRegexValidity = () => {
    if (email && CONSTANTS.EMAIL_REGEX.test(email) === false) {
      setEmailError(CONSTANTS.EMAIL_FORMAT_ERROR);
    } else {
      setEmailError("");
    }
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    //Bi event : dev clicks login post account activation or in general
    if (email) {
      authenticationBiEvents.clicksLogin(email);
    }

    const loginDto: TLoginDto = {
      email: email,
      password: passwd,
      authToken: '',
    };

    dispatch(
      teamAccessDispatchers.getCmsLogin(loginDto, {
        success: (user: TCmsUser) => {
          if (user.twoFAEnabled && !cookies.get(ADMIN_USER_AUTH_TOKEN)) {
            redirectTo(ROUTES.VERIFY_OTP, { email: email, pass: passwd });
          } else {
            redirectTo(ROUTES.OVERVIEW);
          }
        },
      })
    );
  };

  return (
    <>
      <LandingContainer>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          style={{ marginBottom: 34 }}
        >
          Developer Login
        </Typography>

        <ThemeProvider theme={theme}>
          <AuthPaper>
            <form onSubmit={handleSignIn}>
              <FormControl margin="normal" required fullWidth>
                <Input
                  className="input"
                  // label="Email"
                  placeholder="Email"
                  required
                  name="email"
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  error={emailError !== ""}
                  style={{ paddingLeft: 12 }}
                  autoFocus
                />
              </FormControl>
              {emailError ? <p className={globalClasses.fieldError2}>{emailError}</p> : null}

              <FormControl margin="normal" required fullWidth>
                {/* <InputLabel htmlFor="login-form-password" style={{ paddingLeft: 12 }}>Password</InputLabel> */}
                <Input
                  className="input"
                  required
                  placeholder="Password"
                  id="login-form-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={passwd}
                  onChange={handlePasswdChange}
                  //autoComplete="current-password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={(e) => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>

              <div style={{ textAlign: "right" }}>
                <a href={ROUTES.FORGOT_PASSWORD}>Forgot password</a>
              </div>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={cmsSignInUser.loading === XHR_STATE.IN_PROGRESS}
              >
                Login
              </Button>
              {/*snackBarErrorText &&
              <p className={globalClasses.fieldError2}>{snackBarErrorText}</p>
              */}
            </form>
          </AuthPaper>
        </ThemeProvider>
        {/* <p style={{ textAlign: "center", fontSize: 18 }}>
        Don’t have account? <Link to={"/auth/sign-up"}>Sign up here</Link>
      </p> */}
      </LandingContainer>
      <Snackbar
        open={Boolean(snackBarErrorText)}
        autoHideDuration={3000}
        onClose={() => setSnackBarErrorText("")}
      >
        <Alert severity="error">{snackBarErrorText}</Alert>
      </Snackbar>
    </>
  );
};

export default SignInForm;
