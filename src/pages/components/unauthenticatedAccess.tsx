import {
    Button,
    Card,
    CardContent as MuiCardContent,
    Typography
  } from '@material-ui/core';
  import React from 'react';
  import { Link } from 'react-router-dom';
  import styled from 'styled-components';
  import { ROUTES } from '../../common/constants';
  
  type TUnAuthenticatedAccessProps = {
    loggedInUserRole: string;
  };
  
  const CardContent = styled(MuiCardContent)`
    min-height: calc(100vh - 64px - 62px - 80px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  `;
  
  function UnAuthenticatedAccess({
    loggedInUserRole,
  }: TUnAuthenticatedAccessProps) {
    return (
      <Card>
        <CardContent>
          {/* <img
            src={imageUrl}
            alt="illustration add app"
          /> */}
          <Typography><h2>You do not have access to this page</h2></Typography>
          <p style={{textAlign:'center'}}> 
              You need access to <strong>User Section</strong> to see this page. <br/>
              Currently you have <span style={{color:'violet', fontWeight:'bold'}}>{loggedInUserRole}</span> access to this <br/> 
              account, which does not include these permissions. <br/> 
              Please contact your administrator for access or <br/> 
              more information.
          </p>
        </CardContent>
      </Card>
    );
  }
  
  export default UnAuthenticatedAccess;