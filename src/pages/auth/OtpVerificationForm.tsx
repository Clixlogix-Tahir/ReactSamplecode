/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button as MuiButton, FormControl as MuiFormControl, Paper, Snackbar, Typography
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import { createMuiTheme, makeStyles } from "@material-ui/core/styles";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import { Alert } from "@material-ui/lab";
import { ThemeProvider } from "@material-ui/styles";
import React, { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import styled from "styled-components";
import Cookies from "universal-cookie";
import { ROUTES, XHR_STATE } from "../../common/constants";
import {
  useAppDispatch,
  useAppRedirect, useAppSelector, useUrlQuery
} from "../../common/hooks";
import themes from "../../theme";
import globalStyles from "../../theme/globalStyles";
import { teamAccessDispatchers } from "../team-access-control-management/teamAccessControlSlice";
import {
  TCmsUser,
  TLoginDto
} from "../team-access-control-management/teamAccessControlTypes";

const cookies = new Cookies();

const useStyles = makeStyles(theme => ({
  grid: {
    backgroundColor: "grey",
    height: "50vh",
    textAlign: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  }
}));

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
  width: 600px;
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

const OtpVerificationForm: React.FC<React.ReactNode> = (props: any) => {

  const redirectTo = useAppRedirect();
  const [emailId, setEmailId] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const { email, pass } = props.location.state;
  
  useEffect(() => {
    if (email && pass) {
      setEmailId(email);
      setPassword(pass);
    }
  }, []);

  const globalClasses = globalStyles();
  const classes = useStyles();
  const dispatch = useAppDispatch();
  const searchQuery = useUrlQuery();
  const redirectUrl = searchQuery.get("redirect");

  const { cmsSignInUser } = useAppSelector(
    (state) => state.teamAccessControlSlice
  );
  const [otp, setOtp] = useState<string>("");
  const [otpError, setOtpError] = useState<string>("");
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>("");

  // useEffect(() => {
  //   if (
  //     cmsSignInUser.error !== "" &&
  //     cmsSignInUser.loading === XHR_STATE.ASLEEP
  //   ) {
  //     console.log(cmsSignInUser.error)
  //     setSnackBarErrorText("Could not login. " + cmsSignInUser.error);
  //     if (cmsSignInUser.error.includes("User email not verified")) {
  //       setTimeout(() => {
  //         redirectTo(ROUTES.VERIFY_MAIL, { email: email, lastPage: SIGNIN_PAGE });
  //       }, 1500);
  //       let loginDTo = {
  //         email: '',
  //         password: '',
  //         authToken:  '',
  //       }
  //       dispatch(teamAccessDispatchers.clearSignIn(loginDTo))
  //     }


  //   }
  // }, [cmsSignInUser]);

  const handleChange = (otp: string) => {
    setOtp(otp);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();

    if (otp.length === 6) {
      const loginDto: TLoginDto = {
        email: emailId,
        password: password,
        authToken: otp,
      };

      dispatch(
        teamAccessDispatchers.getCmsLogin(loginDto, {
          success: (user: TCmsUser) => {
            redirectTo(
              redirectUrl && redirectUrl !== "/"
                ? decodeURIComponent(redirectUrl)
                : ROUTES.OVERVIEW
            );
          },
        })
      );
    } else {
      setSnackBarErrorText("Please enter the 6 digit verification code first!");
    }
  };

  return (
    <>
      <LandingContainer>

        <Grid item container justify="center">
          <Grid item container alignItems="center" direction="column">
            <Grid item>
              <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
              </Avatar>
            </Grid>
            <Grid item>
              <Typography
                component="h1"
                variant="h2"
                align="center"
                style={{ marginBottom: 34 }}
              >
                Verification Code
              </Typography>
            </Grid>
          </Grid>
        </Grid>



        <ThemeProvider theme={theme}>
          <AuthPaper>
            <Typography component="h1"
              variant="h4" align="center"
              style={{ paddingBottom: "2rem" }}>
              Please enter the verification code sent to your mobile
            </Typography>
            <form onSubmit={handleVerifyOtp}>

              <Grid item spacing={3} justify="center" style={{ paddingBottom: "2rem" }}>
                <OtpInput
                  numInputs={6}
                  value={otp}
                  onChange={handleChange}
                  separator={
                    <span>
                      <strong> </strong>
                    </span>
                  }
                  inputStyle={{
                    width: "3rem",
                    height: "3rem",
                    margin: "0 1rem",
                    fontSize: "2rem",
                    borderRadius: 4,
                    border: "1px solid rgba(0,0,0,0.3)"
                  }}
                />
              </Grid>

              <Button
                variant="contained"
                color="primary"
                type="submit"
                disabled={cmsSignInUser.loading === XHR_STATE.IN_PROGRESS}
              >
                Verify
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

export default OtpVerificationForm;
