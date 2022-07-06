import {
  Button,
  Typography,
  withWidth
} from "@material-ui/core";
import { WithWidth } from "@material-ui/core/withWidth";
import Axios from "axios";
import React, { useState } from "react";
import GoogleLogin from 'react-google-login';
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { ROUTES } from "../../common/constants";
import {
  useAppDispatch, useUrlQuery
} from "../../common/hooks";
import { getJrDomain } from "../../common/utils";
import { ReactComponent as GoogleIcon } from '../../custom-icons/google.svg';
import { setUserGoogleProfile } from "../../rtk-reducers/globalSlice";

const Container = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    margin: 1.5rem 0;
  }
  h6 {
    margin-bottom: 1.5rem;
  }
`;

/** @deprecated */
function Landing({ width }: WithWidth) {
  const history = useHistory();
  const dispatch = useAppDispatch();
  const searchQuery = useUrlQuery();
  const redirectUrl = searchQuery.get('redirect');
  const [isLoginLoading, setsLoginLoading] = useState(false);

  const loginWithJrxBackend = async (response: any) => {
    dispatch(setUserGoogleProfile(response.profileObj));
    try {
      setsLoginLoading(true);
      await Axios.get(
        `${getJrDomain()}user-management/admin-api/loggedInIndex?google_id_token=${response.tokenId}`,
        { withCredentials: true }
      );
      setsLoginLoading(false);
      history.push(redirectUrl && redirectUrl !== '/' ? decodeURIComponent(redirectUrl) : ROUTES.GAME_CONFIG_CREATE);
    } catch (e) {
      setsLoginLoading(false);
      console.error('loginWithJrxBackend error\n', e);
    }
  };

  return (
    <React.Fragment>
      <Container>
        <img
          src="https://play.clixlogix-samplecode.video/static/img/favicon/android-chrome-192x192.png"
          alt="clixlogix-samplecode logo"
          width="96"
          height="96"
        />
        <Typography variant="h1">clixlogix-samplecode Developer Console</Typography>
        <Typography variant="subtitle1">Manage your games and apps with clixlogix-samplecode meta game SDK</Typography>
        <GoogleLogin
          clientId="902254699324-v67cudjrj6r51qd23fpkam57c5sv5lso.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={s => loginWithJrxBackend(s)}
          onFailure={e => console.error('error', e)}
          cookiePolicy={'single_host_origin'}
          isSignedIn={true}
          render={renderProps =>
            <Button
              onClick={renderProps.onClick}
              variant="contained"
              color="default"
              size="large"
              disabled={isLoginLoading}
            >
              <GoogleIcon style={{ width: 24, height: 24, marginRight: '1rem' }} />
              Login with Google
            </Button>
          }
        />
      </Container>
    </React.Fragment>
  );
}

export default withWidth()(Landing);
