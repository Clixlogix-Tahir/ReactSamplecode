/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import Helmet from 'react-helmet';
import { useRouteMatch } from 'react-router-dom';
import { CONSTANTS, ROUTES } from '../../common/constants';
import { useAppSelector } from '../../common/hooks';
import { getclixlogix-samplecodeEnv } from '../../common/utils';
import globalStyles from '../../theme/globalStyles';

function DocsJr(props: any) {
  const classes = globalStyles();
  const routeMatch = useRouteMatch();
  const { userGoogleProfile } = useAppSelector(state => state.globalSlice);

  const getUrl = () => {
    switch(routeMatch.path) {
      case ROUTES.DOCS_UNITY_HARNESS:
      case ROUTES.DOCS_STATIC_UNITY_HARNESS:
        return 'url';
      case ROUTES.DOCS_NATIVE_HARNESS:
      case ROUTES.DOCS_STATIC_NATIVE_HARNESS:
          return 'url2';
    }
    return 'root';
  };

  return (
    <div className={`${classes.fullIframe} ${ userGoogleProfile ? '' : classes.loggedOutFullIframe }`}>
      <Helmet title="Documentation" />
      <iframe
        title="clixlogix-samplecode Games Documentation"
        src={`${CONSTANTS.DOCS[getclixlogix-samplecodeEnv()][getUrl()]}?embedded=1`}
      />

    </div>

  );
}

export default DocsJr;
