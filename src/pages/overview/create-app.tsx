import {
  Card as MuiCard,
  CardContent
} from '@material-ui/core';
import { spacing } from "@material-ui/system";
import React from 'react';
import Helmet from 'react-helmet';
import styled from 'styled-components';

const Card = styled(MuiCard)`
  ${spacing};

  box-shadow: none;
`;

const Shadow = styled.div`
  box-shadow: ${props => props.theme.shadows[1]};
`;

function CreateApp(props: any) {
  return (
    <Shadow>
      <Card px={6} py={6}>
        <CardContent>
          <Helmet title="Create Game">
            <script async defer src="https://formfacade.com/include/100580191212744582649/form/1FAIpQLSdlQT5Htk5CBPqniHJbR7vMLDBasSqxKytak_KOUscj1EadSg/classic.js?div=ff-compose"></script>
          </Helmet>
          <div id="ff-compose" />
        </CardContent>
      </Card>
    </Shadow>
  );
}

export default CreateApp;
