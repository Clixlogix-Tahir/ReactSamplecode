/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory } from 'react-router-dom';
import * as CONSTANTS_TEAM_ACCESS from '../team-access-control-management/constants';
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useUrlQuery
} from "../../common/hooks";

import {
  FormControl as MuiFormControl,
  Input,
  Button as MuiButton,
  Paper,
  Typography,
  Snackbar,
  createMuiTheme,
  ThemeProvider,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import { TCmsUser, TCmsUserSignUpRequestDto, TInvitedCmsUserSignUpRequestDto } from '../team-access-control-management/teamAccessControlTypes';
import { CONSTANTS, ROUTES, XHR_STATE } from "../../common/constants";
import { Link } from "react-router-dom";
import themes from "../../theme";
import { ReactComponent as Eye } from '../../custom-icons/Eye.svg';
import { ReactComponent as EyeOff } from '../../custom-icons/EyeOff.svg';
import { ReactComponent as Correct } from '../../custom-icons/Correct.svg';
import { ReactComponent as Wrong } from '../../custom-icons/Wrong.svg';
import { teamAccessDispatchers } from "../team-access-control-management/teamAccessControlSlice";
import globalStyles from "../../theme/globalStyles";
import { authenticationBiEvents } from "../../bi/events/authenticationBiEvents";
import { TBiApiFields, TDefaultBi } from "../../bi/types/types";
import { getDefaultBiFields, urlHelper } from "../../bi/utils/biUtil";
import { setDefaultBi } from "../../rtk-reducers/globalSlice";

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


const SignUpForm: React.FC<React.ReactNode> = () => {
  const dispatch = useAppDispatch();
  const redirectTo = useAppRedirect();
  const history = useHistory();
  const globalClasses = globalStyles();

  var searchParams = useUrlQuery();
  const invitationKey = searchParams.get(CONSTANTS.URL_SEARCH_KEYS.invitation_key);

  const { cmsSignUpUser, invitedCmsUser } = useAppSelector(state => state.teamAccessControlSlice);

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [passwd, setPasswd] = useState<string>('');
  const [confirmPasswd, setConfirmPasswd] = useState<string>('');

  const [nameError, setNameError] = useState<string>('');
  const [nameTextError, setNameTextError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwdError, setPasswdError] = useState<string>('');
  const [passwdMatchError, setPasswdMatchError] = useState<string>('');

  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>('');
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [submittedOnce, setSubmittedOnce] = useState(false);
  const [toolTipVisibility, setToolTipVisibility] = useState(false);
  const [containUpperCase, setContainUpperCase] = useState(false);
  const [containLowerCase, setContainLowerCase] = useState(false);
  const [containSpecialChar, setContainSpecialChar] = useState(false);
  const [containFiveChar, setContainFiveChar] = useState(false);
  const [passErr, setPassErr] = useState("");
  

  useEffect(() => {
    //( Bi Event : dev is on signup tab )
    authenticationBiEvents.signupTab();

    if (invitationKey) {
      dispatch(teamAccessDispatchers.getInvitedCmsUser(invitationKey as string));
    }
  }, []);

  /*useEffect(() => {
    if(containFiveChar || containLowerCase ||containUpperCase ||containSpecialChar) {
      setToolTipVisibility(true)
    } else {
      setToolTipVisibility(false)
    }
  },[containFiveChar, containLowerCase,containUpperCase,containSpecialChar, passwd,toolTipVisibility])*/
 
  const sendSignUpBiData = () => {
    if (name && email && passwd && !nameError && !emailError && !passwdError) {
      //( Bi Event : dev provides name,email and password to signup )
      authenticationBiEvents.signupInfoEntered(email, name);
    }
  };
    
  useEffect(() => {
    const e1 = checkPasswdLength();
    const e2 = checkPasswdMismatch();
    const e3 = checkSpacesInPasswd();
    setPasswdError(e1 || e2 || e3);
  }, [passwd, confirmPasswd]);

  useEffect(() => {
    setEmailError(checkEmailRegexValidity());
  }, [email]);

  useEffect(() => {
    if (invitedCmsUser && invitedCmsUser.user) {
      setName(invitedCmsUser.user.name);
      setEmail(invitedCmsUser.user.email);
    }
  }, [invitedCmsUser]);

  useEffect(() => {
    if (cmsSignUpUser.user !== null && cmsSignUpUser.error === '' && cmsSignUpUser.loading === XHR_STATE.COMPLETE) {
      setSnackBarSuccessText(`SignUp successful for user "${cmsSignUpUser.user.name}" ("${cmsSignUpUser.user.email}")`);
      //setShowSnackBar(true);
    }
    else if (cmsSignUpUser.error !== '' && cmsSignUpUser.loading === XHR_STATE.ASLEEP) {
      setSnackBarErrorText('Could not SignUp. ' + cmsSignUpUser.error);
    }
  }, [cmsSignUpUser]);

  const handleNameChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setName(e.target.value as string);
  }

  const handleEmailChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setEmail(e.target.value as string);
  }

  const handlePasswdChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setPasswd(e.target.value as string);
    let value = e.target.value as string;
    let isValidUpperCase = false
    let isValidLowerCase = false
    let isValidSpecialChar = false
    let isValidContainfive = false
    if (value.match(/^(?=.*[A-Z]).*$/)) {
      setContainUpperCase(true)
      isValidUpperCase = true
    } else {
      setContainUpperCase(false)
     
    }

    if (value.match(/^(?=.*?[a-z]).*$/)) {
      setContainLowerCase(true)
      isValidLowerCase = true
    }
    else {
      setContainLowerCase(false)
      
    }
    if (value.match(/^(?=.*[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-])(?=.*[0-9]).*$/)) {
      setContainSpecialChar(true)
      isValidSpecialChar = true
    } else {
      setContainSpecialChar(false)
     
    }

    if (value.match(/^(?=.{8,}).*$/)) {
      setContainFiveChar(true)
      isValidContainfive = true
    } else {
      setContainFiveChar(false)
      
    }
    if (isValidContainfive && isValidLowerCase && isValidUpperCase && isValidSpecialChar) {
      setToolTipVisibility(false)
    } else {
      setToolTipVisibility(true)
    }
  }

  const handleConfirmPasswdChange = (e: React.ChangeEvent<{ value: unknown }>) => {
    setConfirmPasswd(e.target.value as string);
    let value = e.target.value as string;
    if (value.length !== 0) {
      if (passwd !== value) {
        setPasswdMatchError("Password did not match");
      } else {
        setPasswdMatchError("");
      }
    } else {
      setPasswdMatchError("")
    }
    
  }

  const checkNameValidity = () => {
    if (name.length < 1) {
      return CONSTANTS_TEAM_ACCESS.NAME_ERROR;
    }
    return '';
  }
  const validateNameText=()=> {
    
    if(name.match(/^[a-zA-Z\s]*$/)) {
        return "";
    } else {
      return CONSTANTS_TEAM_ACCESS.ONLY_TEXT;
    }
}
  const checkEmailRegexValidity = () => {
    if (CONSTANTS_TEAM_ACCESS.EMAIL_REGEX.test(email) === false) {
      return CONSTANTS_TEAM_ACCESS.EMAIL_FORMAT_ERROR;
    }
    return '';
  }

  const checkPasswdMismatch = () => {
    if (passwd && confirmPasswd) {
      if (passwd !== confirmPasswd) {
        return CONSTANTS_TEAM_ACCESS.PASSWORD_MISMATCH_ERROR;
      }
    }
    return '';
  }

  const checkPasswdLength = () => {
    if (passwd.length < 8) { // || (confirmPasswd && confirmPasswd.length < 5)) {
      return CONSTANTS_TEAM_ACCESS.PASSWORD_LENGTH_ERROR;
    }
    return '';
  }

  const checkSpacesInPasswd = () => {
    if (passwd.includes(' ')) { // || (confirmPasswd && confirmPasswd.length < 5)) {
      return CONSTANTS_TEAM_ACCESS.PASSWORD_SPACE_ERROR;
    }
    return '';
  };
  const validatePass = () => {
    let isValid = false;
    if (passwd) {
      if (passwd.match(/^(?=.*[A-Z])(?=.*?[a-z])(?=.*[\!\@\#\$\%\^\&\*\)\(\+\=\.\<\>\{\}\[\]\:\;\'\"\|\~\`\_\-])(?=.*[0-9])(?=.{8,}).*$/)) {
        isValid = true
      }
    }
    return isValid;
  }
  
  const setDefaultBiAndRedirect = (userId: number) => {
    const apiFields: TBiApiFields = urlHelper.getBiApiFields();
    const defaultBi: TDefaultBi = getDefaultBiFields(apiFields, userId);
    dispatch(setDefaultBi(defaultBi));
    redirectTo(ROUTES.VERIFY_MAIL, { email: email, lastPage: CONSTANTS.SIGNUP_PAGE });
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedOnce(true);
    const passwordMismatchError = checkPasswdMismatch();
    const passwordSpaceError = checkSpacesInPasswd();
    const emailRegexError = checkEmailRegexValidity();
    const nameLengthError = checkNameValidity();
    const nameTextError = validateNameText();
    setPasswdError(passwordSpaceError);
    setEmailError(emailRegexError);
    setNameError(nameLengthError);
    setNameTextError(nameTextError);
   
  if (validatePass()) {
      
    
    if ( passwordMismatchError || passwordSpaceError || emailRegexError || nameLengthError || nameTextError) {
      return;
    } else {
      if (invitedCmsUser && invitedCmsUser.user && searchParams.get('invitation_key') !== null && searchParams.get('invitation_key') !== '') {
        const signUpDto: TInvitedCmsUserSignUpRequestDto = {
          name: name,
          email: email,
          password: passwd,
          invitationKey: searchParams.get('invitation_key') as string,
        };

        dispatch(teamAccessDispatchers.invitedCmsSignUpUser(
          signUpDto,
          {
            success: (user: TCmsUser) => {
              setDefaultBiAndRedirect(user.id);
            },
          },
        ));
          
      } else {
        const cmsUserSignUpDto: TCmsUserSignUpRequestDto = {
          name: name,
          email: email,
          password: passwd,
        };
       
        dispatch(teamAccessDispatchers.cmsSignUpUser(
          cmsUserSignUpDto,
          {
            success: (user: TCmsUser) => {
              setDefaultBiAndRedirect(user.id);
            }
          }
        ));
      }
    }    
     // todo url param keys should come from constants
  } else {
    setPassErr("Password invalid criteria")
  }
  };
 
  return (
    <div>
      <LandingContainer>
        <Typography component="h1" variant="h2" align="center">
          Create a developer account
        </Typography>
        <SubTitle>
          Let us do the Heavy Lifting<br />
          Use clixlogix-samplecode to power e-sports for your games
        </SubTitle>
        <ThemeProvider theme={theme}>
          <AuthPaper>
            <form onSubmit={handleSignUp} noValidate>
              <FormControl margin="normal" required fullWidth>
                <Input id="name"
                  className="input"
                  placeholder="Name"
                  required
                  name="name"
                  autoFocus
                  value={name}
                  onChange={handleNameChange}
                  onBlur={sendSignUpBiData}
                  error={submittedOnce && nameError !== ''}
                  disabled={Boolean(invitationKey)}
                />
              </FormControl>
              {submittedOnce && nameError && <p className={globalClasses.fieldError2}>{nameError}</p>}
              {submittedOnce && nameTextError && <p className={globalClasses.fieldError2}>{nameTextError}</p>}

              <FormControl margin="normal" required fullWidth>
                <Input id="email"
                  className="input"
                  placeholder="Email"
                  required
                  disabled={invitedCmsUser.user !== null}
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  onBlur={sendSignUpBiData}
                  error={submittedOnce && emailError !== ''}
                />
              </FormControl>
              {submittedOnce && emailError && <p className={globalClasses.fieldError2}>{emailError}</p>}
              {toolTipVisibility?<div className={globalClasses.tip}>
                <span>
                  {containFiveChar? <Correct/>: <Wrong/> }Minimum 8 characters<br/>
                  { containLowerCase?<Correct/>: <Wrong/>}Atleast one lowercase<br/>
                  { containUpperCase?<Correct/>: <Wrong/>}Atleast one uppercase<br/>
                  { containSpecialChar?<Correct/>: <Wrong/>}Atleast one number and special character
                </span>
              </div>: null}
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
                  onBlur={sendSignUpBiData}
                  error={submittedOnce && passwdError !== ''}
                  //autoComplete="curonrent-password"
                  endAdornment={
                    <InputAdornment position="end">
                      {passwd && <IconButton onClick={e => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff /> : <Eye />}
                  </IconButton>}
                      
                    </InputAdornment>
                  }
                />
              </FormControl>
              {submittedOnce && passwdError && <p className={globalClasses.fieldError2}>{passwdError}</p>}
              {submittedOnce && passErr && <p className={globalClasses.fieldError2}>{passErr}</p>}

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
              {passwdMatchError ? <p className={globalClasses.fieldError2}>{passwdMatchError}</p>:null}
              <Button variant="contained" color="primary"
                style={{ marginTop: '2rem' }}
                disabled={
                  (submittedOnce && (Boolean(emailError) || Boolean(nameError) || Boolean(passwdError))) ||
                  cmsSignUpUser.loading === XHR_STATE.IN_PROGRESS
                }
                type="submit"
              >
                Get Started
              </Button>
            </form>
            <p style={{ textAlign: "center" }}>
              By clicking "Get Started" you accept the<br />
              <a href="https://onclixlogix-samplecode.com/terms" target="_blank" rel="noopener noreferrer">clixlogix-samplecode Terms &amp; Conditions</a>
            </p>
          </AuthPaper>
        </ThemeProvider>
        <SubTitle>Already have an account? <Link to={'/auth/sign-in'}>Login here</Link></SubTitle>
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
  );
}

export default SignUpForm;
