import React, { useEffect, createRef, useState } from "react";
import { Breadcrumbs, Typography, Grid, Button,Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { NavigateNext } from "@material-ui/icons";
import globalStyles from "../../theme/globalStyles";
import * as CONSTANTS_TEAM_ACCESS from '../team-access-control-management/constants';
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
} from "../../common/hooks";
import { ROUTES, XHR_STATE } from "../../common/constants";
import { requestAccessDispatchers } from "./requestControlSlice";
import { TAddOrgResp } from "./requestsControlTypes";
import addGamesStyles from "../../theme/addGamesStyles";
import { otherBiEvents } from "../../bi/events/otherBiEvents";

const AddOrganization = () => {
  const globalClasses = globalStyles();
  const gameClasses = addGamesStyles();
  const redirectTo = useAppRedirect();
  const dispatch = useAppDispatch();
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>('');
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>('');
  const { cmsAddOrg, cmsRequestList } = useAppSelector((state) => state.requestControlSlice);
  const [orgName, setOrgName] = useState<string>("")
  const [orgNameError, setOrgNameError] = useState<string>("")
  const [orgWeb, setOrgWeb] = useState<string>("")
  const [orgWebError, setOrgWebError] = useState<string>("")
  const [validUrlError, setValidUrlError] = useState<string>("");
  const refParent: React.RefObject<HTMLInputElement> = createRef();
  const list = cmsRequestList.response?.appRequests
  const userProfile: any = JSON.parse(localStorage.getItem('userGoogleProfile') || '{}');
  let companyId = userProfile.companyId;
  let email = userProfile.email;

  useEffect(() => {
    if (email) {
      //( BI Event : dev is on add organization page)
      otherBiEvents.addOrganizationPage(email);
    }
  }, []);

  useEffect(() => {
    const element = refParent.current?.parentElement;
   
    if (element) {
      element.style.padding = "0px";
      element.style.background = "white";
    }
  }, []);

  useEffect(() => {
    if (cmsAddOrg.response !== null && cmsAddOrg.error === '' && cmsAddOrg.loading === XHR_STATE.COMPLETE) {
      setSnackBarSuccessText(`Organization Successfull addedd - "${cmsAddOrg.response.name}`);
      //setShowSnackBar(true);
      let cmsAddOrgDTo = {
        name:'',
        website:'',
      }
      dispatch(requestAccessDispatchers.cmsClearAddOrg(cmsAddOrgDTo))
    }
    else if (cmsAddOrg.error !== '' && cmsAddOrg.loading === XHR_STATE.ASLEEP) {
      setSnackBarErrorText('Could not register request - ' + cmsAddOrg.error);
    }
  }, [cmsAddOrg]);
  const breadcrumbs = [
    <Typography className={gameClasses.breadcrum}>
      <img
        className={gameClasses.imgCheck}
        src={"/static/img/icons/check.png"}
        alt="icon"
      />
      Registration
    </Typography>,
    <Typography className={gameClasses.breadcrum}>
      <img
        className={gameClasses.imgCheck}
        src={"/static/img/icons/check.png"}
        alt="icon"
      />
      Add Game
    </Typography>,
    <Typography key="3" className={gameClasses.breadcrum} style={{ color: "grey" }}>
      <div
        className={gameClasses.circle}
        style={{ backgroundColor: "rgb(72,144,232)" }}
      ></div>
      Add Organization
    </Typography>,
  ];

  /* const handleUrl = (e: React.ChangeEvent<{ value: unknown }>) => {
    setOrgWeb(e.target.value as string);
    let str = e.target.value as string;
    if (str) {
      if (str.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)) {
        setValidUrlError('');
      } else {
        setValidUrlError(CONSTANTS_TEAM_ACCESS.VALID_URL);
      }
    }
    
  } */
  const handleAddOrg = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email) {
      //(Bi Event : dev submits organization details)
      otherBiEvents.submitsOrganizationDetails(email, orgName, orgWeb);
    }

    /* let cmsAddOrgDTo = {
      orgName,
      orgWeb,
    } */
    if(!orgName) setOrgNameError(CONSTANTS_TEAM_ACCESS.ADD_ORG_NAME)
    
    if (!orgName) {
      return;
    } 
    if (orgWeb) {
      let cmsAddOrgDTo = {
        name:orgName,
        website:orgWeb,
      }
      dispatch(requestAccessDispatchers.cmsAddOrg(
        cmsAddOrgDTo,
        companyId,
        {
          success: (response: TAddOrgResp) => {
  
            setTimeout(() => {
              redirectTo(ROUTES.RQUEST_SUCCESS);
            },2000)
                
          },
        },
      )).then(() => dispatch);
    } else {
      let cmsAddOrgDTo = {
        name:orgName,
      }
      dispatch(requestAccessDispatchers.cmsAddOrg(
        cmsAddOrgDTo,
        companyId,
        {
          success: (response: TAddOrgResp) => {
  
            setTimeout(() => {
              redirectTo(ROUTES.RQUEST_SUCCESS);
            },2000)
                
          },
        },
      ));
    }
  };
  return (
    <div className={gameClasses.addGame} ref={refParent}>
      <Breadcrumbs
        className={gameClasses.breadcrumDiv}
        separator={<NavigateNext fontSize="large" />}
        aria-label="breadcrumb"
      >
         {list && list.length ===0 ? breadcrumbs: (<Typography style={{margin : '10px'}} className={gameClasses.breadcrum}>
      Add Organization
    </Typography>)}
      </Breadcrumbs>
      <form onSubmit={handleAddOrg} noValidate>
        <Grid container spacing={2} className={gameClasses.addGameLayout}>
          <Grid item xs={6}>
            <div style={{ display: "flex" }}>
              <div className={gameClasses.formDiv}>
                <label className={gameClasses.labelControl}>Organization Name</label>
                <input
                  id="email"
                  placeholder="Name"
                  required
                  name="email"
                  className={gameClasses.inputControl}
                  value={orgName}
                  onChange={(e)=>setOrgName(e.target.value)}
                />
                {orgNameError ? <p className={globalClasses.fieldError2}>{orgNameError}</p>: null}
                <label className={gameClasses.labelControl}>Organization Website</label>
                <input
                  id="email"
                  placeholder="http://example.com/"
                  required
                  name="email"
                  className={gameClasses.inputControl}
                  value={orgWeb}
                  onChange={(e)=>setOrgWeb(e.target.value)}
                />
                {validUrlError ? <p className={globalClasses.fieldError2}>{validUrlError}</p>: null}
                {orgWebError ? <p className={globalClasses.fieldError2}>{orgWebError}</p>: null}
              </div>
            </div>
          </Grid>
          <Grid item xs={6} className={gameClasses.developerDiv}>
            <div>
              <h4>Developers</h4>
              <p>
                Our creator platform for Web3 games provides all the tools you{" "}
                <br className={gameClasses.break} />
                need on iOS, Android, and Unity to build, publish, and scale
                your blockchain games.
              </p>

              <p>
                Develop a great core mechanic, integrate it with our SDK, and{" "}
                <br className={gameClasses.break} />
                launch with market-leading infrastructure that has powered{" "}
                <br className={gameClasses.break} />
                300MM+ players.
              </p>

              <p>
                Integrate with the clixlogix-samplecode walet and offer complaint NFT's and{" "}
                <br className={gameClasses.break} />
                token rewards built into features like achievements, leagues,
                and{" "}
                <br className={gameClasses.break} />
                tournaments.
              </p>
            </div>
          </Grid>
        </Grid>
        <div className={gameClasses.divSeperator}></div>
        <div className={gameClasses.btnDiv}>
          <Button
            variant="contained"
            color="primary"
            className={gameClasses.backBtn}
            onClick={()=> redirectTo(ROUTES.REQUEST_ADD_GAME_REQUEST)}
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            className={gameClasses.nxtBtnOrg}
            type="submit"
          >
            Submit
          </Button>
        </div>
      </form>
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
};

export default AddOrganization;
