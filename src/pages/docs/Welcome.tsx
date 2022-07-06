import React from "react";
import styled from "styled-components";
import { NavLink as RouterNavLink, LinkProps } from "react-router-dom";

import { Helmet } from 'react-helmet';
import {
  Box,
  Breadcrumbs as MuiBreadcrumbs,
  Divider as MuiDivider,
  Grid,
  Link,
  Typography as MuiTypography
} from "@material-ui/core";

import { spacing } from "@material-ui/system";

const Intro = styled.div`
  //min-height: calc(100vh - 66px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 14rem 3rem;
`;

const NavLink = React.forwardRef<LinkProps, any>((props, ref) => (
  <RouterNavLink innerRef={ref} {...props} />
));

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Introduction() {
  return (
    <Intro>
    <Box mb={10}>
      {/* <Typography variant="h3" gutterBottom>
        Introduction
      </Typography> */}
      <Typography variant="subtitle1" gutterBottom my={4}>
      Please wait for the clixlogix-samplecode developer team to connect with you to help with the  integration 
      process, your app should appear on the dashboard page within 48 hours after submission of 
      details. Thank you for your patience and keep gaming!! If you have further queries please 
      write to us at <Link href="mailto:help@onclixlogix-samplecode.com">help@onclixlogix-samplecode.com</Link>.
      </Typography>
      {/* <Typography variant="subtitle1" gutterBottom my={4}>
        The docs includes information to understand how the theme is organized, 
        how to compile and extend it to fit your needs, and how to make 
        changes to the source code.
      </Typography> */}
    </Box>
    </Intro>
  );
}

function Welcome() {
  return (
    <React.Fragment>
      <Helmet title="Getting Started" />

      <Grid container spacing={6} justify="center">
        <Grid item xs={12} lg={9} xl={7}>
          <Introduction />
        </Grid>
      </Grid>

    </React.Fragment>
  );
}

export default Welcome;
