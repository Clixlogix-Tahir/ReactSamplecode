import {
  createMuiTheme, Paper, Snackbar, Typography
} from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { authenticationBiEvents } from "../../bi/events/authenticationBiEvents";
import { ROUTES, XHR_STATE } from "../../common/constants";
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useUrlQuery
} from "../../common/hooks";
import themes from "../../theme";
import { teamAccessDispatchers } from "../team-access-control-management/teamAccessControlSlice";
import { TCmsVerifyEmailDTo } from '../team-access-control-management/teamAccessControlTypes';


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

const Screenshot = styled.img`
  max-width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  margin-left: "20px";
`;



const MailConfirm = () => {
  const redirectTo = useAppRedirect();
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>('');
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>('');
  const { cmsEmailVerify } = useAppSelector((state) => state.teamAccessControlSlice);
  const { selectedAppObj } = useAppSelector((state) => state.gameConfigForm);
  var searchParams = useUrlQuery();
    
  const email = searchParams.get('email');
  const verificationKey = searchParams.get('verificationKey');
 

  useEffect(() => {
    if (email) {
      //( BI Event : dev lands on account activated page(signup) )
      authenticationBiEvents.accountActivatedPage(email);
    }
  }, []);
  
  useEffect(() => {
    
    let verifyMailDTo: TCmsVerifyEmailDTo = {
      email: email,
      verificationKey: verificationKey,
    }
    dispatch(teamAccessDispatchers.cmsVerifyMail(
      verifyMailDTo,
      {
        success: (repsonse: string) => {
          
        },
        error: (error: any) => {
          
          
        }
      },
    ));
  }, [])
  
  useEffect(() => {
    if (email) {
      if (cmsEmailVerify.response !== null && cmsEmailVerify.error === '' && cmsEmailVerify.loading === XHR_STATE.COMPLETE) {
        setSnackBarSuccessText(`Account verified`);
        //setShowSnackBar(true);
      }
      else if (cmsEmailVerify.error !== '' && cmsEmailVerify.loading === XHR_STATE.ASLEEP) {
        setSnackBarErrorText('Could not verify ' + cmsEmailVerify.error);
        history.push(ROUTES.VERIFY_MAIL, {email});
      }
    }
    
  }, [cmsEmailVerify]);
  return (
    <div>
        <LandingContainer>
        <Screenshot alt="Dark" src="/static/img/icons/envelopeIcon.png" />
        <Typography component="h1" variant="h2" align="center">
          Your account has been activated
        </Typography>
        <SubTitle>
          You can now login
        </SubTitle>
        
        <SubTitle>
          <Link
            to={'/auth/sign-in'}
            onClick={() => {
              if (email) {
                //( Bi Event : dev proceeds to login from activation page )
                authenticationBiEvents.proceedToLoginFromActivationPage(email);
              }
            }}
          >
            Go to Login Page
          </Link>
        </SubTitle>

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

export default MailConfirm