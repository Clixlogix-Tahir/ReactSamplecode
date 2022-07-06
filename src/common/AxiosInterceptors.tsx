import axios from "axios";
import React from "react";
import Cookies from "universal-cookie";
import { ADMIN_USER_AUTH_TOKEN, CONSTANTS } from "./constants";
import { useHistory } from "react-router-dom";
import { biColumnsStaticFields, biFieldNames, BLITZ_DASHBOARD_PROD_URL, BLITZ_DASHBOARD_TEST_URL } from "../bi/constants/biConstants";
import { TBiEvent } from "../bi/types/types";
import { isValidJSONObject } from "./utils";

const cookies = new Cookies();

export const logoutUser = () => {
  localStorage.removeItem(CONSTANTS.LOCAL_STORAGE.GOOGLE_PROFILE);
  cookies.remove("PLAY_SESSION", { path: "/" });
  cookies.remove("G_AUTHUSER_H", { path: "/" });
  cookies.remove(ADMIN_USER_AUTH_TOKEN, { path: "/" });
  localStorage.removeItem("count");
  localStorage.removeItem("nudgeCount");
  window.location.href =
    "/?redirect=" +
    encodeURIComponent(window.location.pathname) +
    window.location.search;
};

const AxiosInterceptors = (Wrapped: React.FC<any>) => {
  // const dispatch = useDispatch();

  return (props: any) => {
    axios.interceptors.response.use(
      function (response) {
        
        // Allowing BI(log) calls even if GOOGLE_PROFILE not set for the user in local storage...
        if (!response.config.url?.startsWith(BLITZ_DASHBOARD_PROD_URL) &&
          !response.config.url?.startsWith(BLITZ_DASHBOARD_TEST_URL) &&
          !localStorage.getItem(CONSTANTS.LOCAL_STORAGE.GOOGLE_PROFILE)) {
          // todo
          // dispatch(setUserGoogleProfile(null));
          logoutUser();
          return Promise.reject("user is logged out");
        }
        return response;
      },
      function (error) {
        // status will be unavailable if server is down
        const status = error.response ? error.response.status : -1;
        if (!error.response) {
          console.error("jrx-backend might be down");
        }
        switch (status) {
          case 401:
            // todo
            //dispatch(setUserGoogleProfile(null));
            // console.error("401 error: unauthorised access", error ? error.response : error);
            logoutUser();
            break;
          case 403:
            //Todo : show a popup to user explaining that he doesn't have suffiicient privileges to see the resource
            console.error("403 error: forbidden access", error ? error.response : error);
            break;
          default:
            console.error("unknown XHR error\n", error);
            break;
        }
        // Do something with response error
        return Promise.reject(error);
      }
    );
    return <Wrapped {...props} />;
  };
};

export default AxiosInterceptors;
