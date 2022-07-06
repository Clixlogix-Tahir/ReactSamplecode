import {
  Typography
} from "@material-ui/core";
import React, { createRef, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { otherBiEvents } from "../../bi/events/otherBiEvents";
import { useAppSelector } from "../../common/hooks";
import { TAddOrgResp, TReqListResp } from "./requestsControlTypes";


//const Button = styled(MuiButton)<MuiButtonSpacingType>(spacing);


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

const GameRequestSuccess = () => {
  const refParent: React.RefObject<HTMLInputElement> = createRef();
  const { cmsRequestList, cmsGetOrg } = useAppSelector((state) => state.requestControlSlice);
  const { appRequests } = (cmsRequestList.response as TReqListResp) || {};
  const { name: gameName, url: gameUrl, format, platform, otherInformation } = (appRequests && appRequests[appRequests.length-1]) || {};
  const { name: organizatioName, website: organizationWebsite } = (cmsGetOrg.response as TAddOrgResp) || {};
  const userProfile: any = JSON.parse(localStorage.getItem('userGoogleProfile') || '{}');
  let email = userProfile.email;

  useEffect(() => {
    if (email && appRequests && cmsGetOrg.response && gameName && gameUrl && format
      && platform && organizatioName && organizationWebsite) {
      //( Bi Event : dev is on game request success page)
      otherBiEvents.gameRequestSuccessPage(email, gameName, gameUrl, format.join(','), platform.join(','), otherInformation,
        organizatioName, organizationWebsite);
    }
  }, []);

  useEffect(() => {
    const element = refParent.current?.parentElement;
  
    if (element) {
      element.style.padding = "0px";
      element.style.background = "white";
    }
  }, []);
  return (
    <div ref={refParent}>
      <LandingContainer>
        <Screenshot alt="Dark" src="/static/img/icons/check.png" />
        <br />
        <Typography component="h1" variant="h2" align="center">
          Game Request Submitted Successfully
        </Typography>
        <SubTitle>Now you can access the Dashboard</SubTitle>
        <SubTitle>
          {" "}
          <Link to={""}>Go to Dashboard</Link>
        </SubTitle>
      </LandingContainer>
    </div>
  );
};

export default GameRequestSuccess;
