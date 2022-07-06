import {
  Button as MuiButton, createMuiTheme, FormControl as MuiFormControl, Paper, Snackbar, ThemeProvider, Typography
} from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { authenticationBiEvents } from "../../bi/events/authenticationBiEvents";
import { CONSTANTS, ROUTES,  XHR_STATE } from "../../common/constants";
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector
} from "../../common/hooks";
import themes from "../../theme";
import { teamAccessDispatchers } from "../team-access-control-management/teamAccessControlSlice";
import { TCmsSendEmailLinkDTo } from '../team-access-control-management/teamAccessControlTypes';


//const Button = styled(MuiButton)<MuiButtonSpacingType>(spacing);

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

const SubTitle = styled.p`
  text-align: center;
  font-size: 18px;
  line-height: 1.3;
  margin-bottom: 1em;
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
    &.Mui-disabled {
      color: #666;
    }
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

const VerifyEmail = (props:any) => {
  const { email, lastPage } = props.location.state;
  //const email= "sahas.jaiswal@clixlogix.net"
  const dispatch = useAppDispatch();
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>('');
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>('');
  const { cmsEmailVerifyLink } = useAppSelector((state) => state.teamAccessControlSlice);
  const [count, setCount] = useState<number>(0);
  

  useEffect(() => {
    if (email && lastPage) {
      //( Bi Event : Dev lands on email verification page(signIn/signUp)
      authenticationBiEvents.emailVerificationPage(email, lastPage === CONSTANTS.SIGNUP_PAGE ? true : false);
    }
  }, [email, lastPage]);

  useEffect(() => {
    if (email) {
      if (cmsEmailVerifyLink.response !== null && cmsEmailVerifyLink.error === '' && cmsEmailVerifyLink.loading === XHR_STATE.COMPLETE) {
        setSnackBarSuccessText(`Email sent to ${email}`);
        //setShowSnackBar(true);
      }
      else if (cmsEmailVerifyLink.error !== '' && cmsEmailVerifyLink.loading === XHR_STATE.ASLEEP) {
        setSnackBarErrorText('Could not sent email. ' + cmsEmailVerifyLink.error);
      }
    }
    
  }, [cmsEmailVerifyLink]);
    const redirectTo = useAppRedirect();
  const handleResend = () => {
    if (email) {
      
      //( Bi Event : dev clicks on resend confirmation email )
      if (lastPage) {
        if (lastPage === CONSTANTS.SIGNIN_PAGE) {
          authenticationBiEvents.resendConfirmationEmail(email, false);
        } else if (lastPage === CONSTANTS.SIGNUP_PAGE) {
          authenticationBiEvents.resendConfirmationEmail(email, true);
        }
      }

      if (count === 0) {
        const cmsEmailDto: TCmsSendEmailLinkDTo = {
          email: email,
        };
  
          dispatch(teamAccessDispatchers.cmsSendVerifyMail(cmsEmailDto, {
            success: (response: string) => {
              setSnackBarSuccessText("Email has been sent successfully!!!")
            },
            
          }));
        //setCount(30);
      }
    }
    
    
    }
  return (
    <div>
          <LandingContainer>
              
        <Typography component="h1" variant="h2" align="center">
          Verify your email to finish signing up
        </Typography>
        <SubTitle><br/>
          Thank you for using clixlogix-samplecode!<br />
          We have sent an email to <b>{email? email : "No email"}</b><br/><br/>
          Please check your email to verify your account<br/>
        </SubTitle>
        <ThemeProvider theme={theme}>
          <p style={{color: "#0094DC",fontWeight: 600, fontSize: "20px", cursor: 'pointer'}} onClick={()=> handleResend()}>Re-send confirmation email</p>
        </ThemeProvider>
        <Button 
          style={{ color: "white", backgroundColor: '#0094DC' }}
          onClick={() => {
            if (email) {
              //( Bi Event : dev proceeds to login from verification page )
              authenticationBiEvents.proceedToLoginFromVerificationPage(email);
            }
            redirectTo(ROUTES.LOGIN);
          }}
        >
          Sign In
        </Button>
      </LandingContainer>

      <Snackbar
        open={Boolean(snackBarErrorText)}
        autoHideDuration={3000}
        onClose={() => setSnackBarErrorText('')}
      >
        <Alert severity="error">
          {snackBarErrorText}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(snackBarSuccessText)}
        autoHideDuration={3000}
        onClose={() => setSnackBarSuccessText('')}
      >
        <Alert severity="success">
          {snackBarSuccessText}
        </Alert>
      </Snackbar>
    </div>
  )
}

export default VerifyEmail