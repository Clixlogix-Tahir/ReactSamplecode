import { Breadcrumbs, Button, Grid, Snackbar, Tooltip, Typography } from "@material-ui/core";
import { blue } from "@material-ui/core/colors";
import { Error as Info, NavigateNext } from "@material-ui/icons";
import { Alert, ToggleButton, ToggleButtonGroup } from "@material-ui/lab";
import React, { createRef, useEffect, useState } from "react";
import { otherBiEvents } from "../../bi/events/otherBiEvents";
import { ROUTES, XHR_STATE } from "../../common/constants";
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector
} from "../../common/hooks";
import addGamesStyles from '../../theme/addGamesStyles';
import globalStyles from "../../theme/globalStyles";
import * as CONSTANTS_TEAM_ACCESS from '../team-access-control-management/constants';
import { requestAccessDispatchers } from "./requestControlSlice";
import { TReqAddDataType, TReqAddDTo, TReqListResp } from "./requestsControlTypes";
type companyId = string | null;



const AddGame = () => {
  const globalClasses = globalStyles();
  const addGameClasses = addGamesStyles();
  const redirectTo = useAppRedirect();
  const dispatch = useAppDispatch();
  const { cmsRequestAdd, cmsRequestList } = useAppSelector((state) => state.requestControlSlice);
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>('');
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>('');
  const [platform, setPlatform] = useState<string[]>([]);
  const refParent: React.RefObject<HTMLInputElement> = createRef();
  const [gameName, setGameName] = useState<string>("");
  const [gameUrl, setGameUrl] = useState<string>("");
  const [gameFormat, setGameFormat] = useState<string[]>([]);
  const [otherInfo, setOtherInfo] = useState<string>("");
  const [errorName, setErrorName] = useState<string>("");
  const [errorFormat, setErrorFormat] = useState<string>("");
  const [errorPlatform, setErrorPlatform] = useState<string>("");
  const [validUrlError, setValidUrlError] = useState<string>("");
  const [textAreaCounter, setTextAreaCounter] = useState<number>(0);
  const [flag, setFlag] = useState<boolean>(false);
  const userProfile: any = JSON.parse(localStorage.getItem('userGoogleProfile') || '{}');
  const list = cmsRequestList.response?.appRequests
  let companyId = userProfile.companyId;
  let email = userProfile.email;
  let flagNudge = false;


  useEffect(() => {
    if (email) {
      //( BI Event : dev is on add game page )
      otherBiEvents.addGamePage(email);
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
    let cmsReqList = {
      pn: 0,
      ps: 10,
    };
    dispatch(
      requestAccessDispatchers.cmsGetReqList(cmsReqList, companyId, {
        success: (response: TReqListResp) => {
     
          if (response.appRequests.length === 0) {
            localStorage.setItem('nudgeCount', '1');
          }
          
        },
      })
    );
  }, [flagNudge])

  useEffect(() => {
    if (cmsRequestAdd.response !== null && cmsRequestAdd.error === '' && cmsRequestAdd.loading === XHR_STATE.COMPLETE) {
      setSnackBarSuccessText(`Request Successfull addedd - Requset Name "${cmsRequestAdd.response.name}`);
      //setShowSnackBar(true);
      // cmsRequestAdd.response = null;
      let cmsReqDTo: TReqAddDTo = {
        name: '',
        format: '',
        platform: '',
      }
      dispatch(requestAccessDispatchers.cmsClearReqAdd(cmsReqDTo));
    }
    else if (cmsRequestAdd.error !== '' && cmsRequestAdd.loading === XHR_STATE.ASLEEP) {
      setSnackBarErrorText('Could not register request - ' + cmsRequestAdd.error);
    }
  }, [cmsRequestAdd]);
  const handleChangeFormat = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string[]
  ) => {
    setGameFormat(newAlignment);
    setErrorFormat('');
  };
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string[]
  ) => {
    setPlatform(newAlignment);
    setErrorPlatform('');
  };
  const handleGameName = (e: React.ChangeEvent<{ value: unknown }>) => {
    setGameName(e.target.value as string);
    setErrorName('');
  }
  const breadcrumbs = [
    <Typography className={addGameClasses.breadcrum}>
      <img
        className={addGameClasses.imgCheck}
        src={"/static/img/icons/check.png"}
        alt="icon"
      />
      Registration
    </Typography>,
    <Typography className={addGameClasses.breadcrum}>
      <div
        className={addGameClasses.circle}
        style={{ backgroundColor: "rgb(72,144,232)" }}
      ></div>
      Add Game
    </Typography>,
    <Typography key="3" className={addGameClasses.breadcrum} style={{ color: "grey" }}>
      <div className={addGameClasses.circle}></div>
      Add Organization
    </Typography>,
  ];
  const clearError = () => {
    setErrorName("");
    setErrorFormat("");
    setErrorPlatform("");
  }
  const handleUrl = (e: React.ChangeEvent<{ value: unknown }>) => {
    setGameUrl(e.target.value as string);
    let str = e.target.value as string;
    if (str) {
      if (str.match(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/)) {
        setValidUrlError('');
      } else {
        setValidUrlError(CONSTANTS_TEAM_ACCESS.VALID_URL);
      }
    }
    
  }

  const execution = (cmsReqDTo:TReqAddDTo) => {
    dispatch(requestAccessDispatchers.cmsRequestAdd(
      cmsReqDTo,
      companyId,
      {
        success: (response: TReqAddDataType) => {
          setTimeout(() => {
            redirectTo(ROUTES.RQUEST_ADD_ORGANIZATION);
          },1500)
              
        },
      },
    ));
  }
  const handleAddGame = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    //(Bi Event : everytime dev submits new game details)
    if (email && gameName && gameFormat && platform) {
      otherBiEvents.submitNewGameDetails(email, gameName, gameUrl, gameFormat.join(', '), 
      platform.join(', '), otherInfo);
    }
    
    if(!gameName) setErrorName(CONSTANTS_TEAM_ACCESS.ADD_GAME_NAME)
    if(gameFormat.length === 0) setErrorFormat(CONSTANTS_TEAM_ACCESS.ADD_GAME_FORMAT)
    if (platform.length === 0) setErrorPlatform(CONSTANTS_TEAM_ACCESS.ADD_GAME_PLATFORM)

    if (!gameName || gameFormat.length === 0 || platform.length === 0) {
      return;
    }
    else {
      let cmsReqDTo: TReqAddDTo = {
        name: gameName,
        format: gameFormat.toString(),
        platform: platform.toString(),
      }
      if (gameUrl) {
        cmsReqDTo.url = gameUrl;
      }
      if (otherInfo) {
        cmsReqDTo.otherInformation = otherInfo;
      }
      execution(cmsReqDTo);
    }
    
    
  };
  const handleTextAreaChange = (e:React.ChangeEvent<{value:unknown}>) => {
    let value = e.target.value as string;
    setOtherInfo(value);
   
    setTextAreaCounter(value.length)
  }
  return (
    <div className={addGameClasses.addGame} ref={refParent}>
      <Breadcrumbs
        className={addGameClasses.breadcrumDiv}
        separator={<NavigateNext fontSize="large" />}
        aria-label="breadcrumb"
      >
        {list && list.length ===0 ? breadcrumbs: (<Typography style={{margin : '10px'}} className={addGameClasses.breadcrum}>
      Add Game
    </Typography>)}
      </Breadcrumbs>
      <form className={addGameClasses.formCss} onSubmit={handleAddGame} noValidate>
        <Grid container spacing={2} className={addGameClasses.addGameLayout}>
          <Grid item md={6} xs={12}>
            <div style={{ display: "flex" }}>
              <div className={addGameClasses.formDiv}>
                <label className={addGameClasses.mandatoryLabelControl}><span >*</span>Game Name</label>
                <input
                  placeholder="Name"
                  required
                  className={addGameClasses.inputControl}
                  value={gameName}
                  onChange={handleGameName}
                />
                {errorName ? <p className={addGameClasses.fieldError}>{errorName}</p>: null}
                <label className={addGameClasses.labelControl}>
                  Game URL
                </label>
                <input
                  placeholder="Url"
                  required
                  style={{marginTop: '10px'}}
                  className={addGameClasses.inputControl}
                  value={gameUrl}
                  onChange={handleUrl}
                />
                {validUrlError ? <p className={addGameClasses.fieldError}>{validUrlError}</p>: null}
                <label className={addGameClasses.mandatoryLabelControl}><span >*</span>Game Format
                  <Tooltip
                    arrow
                    placement="right-end"
                    title={<div >
                      <ul className={ addGameClasses.listStyle}>
                    <li>Asynchronous - Don't require competing players to play simultaneously</li>
                    <li>Synchronous -  Players compete against one another in real-time</li>
                  </ul>
                </div>}><Info style={{ color: '#d8d8d8', height: '15px', width: '15px'}}/></Tooltip></label>
                <ToggleButtonGroup
                  className={addGameClasses.toggleDiv}
                  color={blue[500]}
                  value={gameFormat}
                  onChange={handleChangeFormat}
                >
                  <ToggleButton className={addGameClasses.toggle}   value="SYNCHRONOUS">
                  SYNCHRONOUS
                  </ToggleButton>
                  <ToggleButton className={addGameClasses.toggle} value="ASYNCHRONOUS">
                  ASYNCHRONOUS
                  </ToggleButton>
                  <ToggleButton className={addGameClasses.toggle} value="OTHER">
                    OTHER
                  </ToggleButton>
                </ToggleButtonGroup>
                {errorFormat ? <p className={addGameClasses.fieldError}>{errorFormat}</p>: null}

                <label className={addGameClasses.mandatoryLabelControl}><span >*</span>Platform Preference </label>
                <ToggleButtonGroup
                  className={addGameClasses.toggleDiv}
                  color={blue[500]}
                  value={platform}
                  onChange={handleChange}
                >
                  <ToggleButton className={addGameClasses.toggle}   value="UNITY">
                  UNITY
                  </ToggleButton>
                  <ToggleButton className={addGameClasses.toggle} value="IOS_NATIVE">
                    iOS Native
                  </ToggleButton>
                  <ToggleButton className={addGameClasses.toggle} value="ANDROID_NATIVE">
                    Android Native
                  </ToggleButton>
                </ToggleButtonGroup>
                {errorPlatform ? <p className={addGameClasses.fieldError}>{errorPlatform}</p> : null}

                <label className={addGameClasses.labelControl}>Other Information</label>
                <div>
                  <textarea
                    className={addGameClasses.textareaControl}
                    required
                    maxLength={250}
                    value={otherInfo}
                    placeholder={`Provide any relavent information that you wish to share (250 max)`}
                    onChange={handleTextAreaChange}
                  />
                  { textAreaCounter? <p style={{ padding: 0, margin:0,marginRight:'30px', color: "grey", textAlign:'end' }}>
                    { textAreaCounter === 250 ? 'Reached max limits of': 250-textAreaCounter} words
                  </p>:null}
                  
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={6} className={addGameClasses.developerDiv}>
            <div>
              <h4>Developers</h4>
              <p>
                Our creator platform for Web3 games provides all the tools you{" "}
                <br className={addGameClasses.break}/>
                need on iOS, Android, and Unity to build, publish, and scale
                your blockchain games.
              </p>
              
              <p>
                Develop a great core mechanic, integrate it with our SDK, and{" "}
                <br className={addGameClasses.break}/>
                launch with market-leading infrastructure that has powered
                <br className={addGameClasses.break}/>
                {" "}300MM+ players.
              </p>
             
              <p>
                Integrate with the clixlogix-samplecode wallet and offer complaint NFT's and{" "}
                <br className={addGameClasses.break}/>
                token rewards built into features like achievements, leagues,
                and{" "}
                <br className={addGameClasses.break}/>
                tournaments.
              </p>
            </div>
          </Grid>
        </Grid>
        <div className={addGameClasses.divSeperator}></div>
        <div className={addGameClasses.btnDiv}>
          <Button
            variant="contained"
            color="primary"
            className={addGameClasses.nxtBtn}
            type="submit"
          >
            Next
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
export default AddGame;
