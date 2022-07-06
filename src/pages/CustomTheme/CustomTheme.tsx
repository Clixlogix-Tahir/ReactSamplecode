import React, { useState, useEffect, createRef, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { Download, Upload } from "react-feather"
import * as CONSTANTS_TEAM_ACCESS from "../team-access-control-management/constants";
import {
  useAppDispatch,
  useAppRedirect,
  useAppSelector,
  useUrlQuery,

} from "../../common/hooks";
import JSONModal from "../../components/JSONModal";
import {
  FormControl as MuiFormControl,
  Input,
  Button,
  Paper,
  Typography,
  Snackbar,
  createMuiTheme,
  ThemeProvider,
  InputAdornment,
  IconButton,
  AccordionSummary,
  Stepper,
  Step,
  StepLabel,
  Grid,
  Accordion,
  AccordionDetails,
  Backdrop,
  Tooltip,
  Dialog,
  Modal,
  CircularProgress
} from "@material-ui/core";
import {
  KeyboardArrowUp,
  AddCircleOutline as AddIcon,
  ExpandMore,
  CheckCircle,
  Cancel,
  Close,
  AddCircleOutlineRounded,
  HelpOutlineOutlined,
  PlayCircleFilled as Play,
  PauseCircleFilled as Pause,
  SortByAlphaOutlined,
  SaveRounded,
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import {
  TCmsSendEmailLinkDTo,
  TCmsUser,
  TCmsUserSignUpRequestDto,
  TInvitedCmsUserSignUpRequestDto,
} from "../team-access-control-management/teamAccessControlTypes";
import { CONSTANTS, ROUTES, XHR_STATE, URL_PART_APP_ID } from "../../common/constants";
import { Link } from "react-router-dom";
import themes from "../../theme";
import EnvelopeIcon from "../../Assets/Icons/envelopeIcon.png";
import { teamAccessDispatchers } from "../team-access-control-management/teamAccessControlSlice";
import customThemeStyles from "../../theme/customeThemeStyles";
import { margin } from "polished";
import { string } from "prop-types";
import { styles } from "@material-ui/pickers/views/Calendar/Calendar";
import ColorPalette from '../../components/ColorPalette';
import { setUpgradeToLiveLoading } from "../game-config/gameConfigSlice";
import { appManagementApi } from "../app-management/appManagementApi";
import { customThemeControlApi } from "./customThemeControlAPI";
import ArtSection from "./ArtSection";
import ColorSection from "./ColorSection";
import SoundSection from "./SoundSection";
import AnimationSection from "./AnimationSection";
import { customThemeAccessDispatchers } from "./customThemeControlslice";
import { setTheme } from "../../redux/actions/themeActions";

//const Button = styled(MuiButton)<MuiButtonSpacingType>(spacing);

const CustomTheme = (props: any) => {
  const refParent: React.RefObject<HTMLInputElement> = createRef();
  const customThemeClasses = customThemeStyles();
  useEffect(() => {
    const element = refParent.current?.parentElement;
   
    if (element) {
      element.style.padding = "0px";
      element.style.background = "white";
    }
  }, []);
  const ModalRef = useRef<any>();
  const dispatch = useAppDispatch();
  
  const redirectTo = useAppRedirect()
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>('');
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>('');
  const [snackBarInfoText, setSnackBarInfoText] = useState<string>('');
  const { cmsCustomThemeAdd, cmsCustomThemeGet } = useAppSelector((state)=>state.customThemeControlslice)
  const [open, setOpen] = React.useState(false);
  const [preview, setPreview] = React.useState(false);
  const [url, setUrl] = useState<any>()
  const [error, setError] = useState<string | null>()
  const [display, setDisplay] = useState<string>('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [artSection, setArtSection] = useState<any>([])
  const [colorSection, setColorSection] = useState<any>([])
  const [soundSection, setSoundSection] = useState<any>([])
  const [lottieFile, setLottieFile] = useState<any>([])
  const [themes, setThemes] = useState<any>({});
  const [sound, setSound] = useState<any>('Play')
  const [animationSection, setAnimationSection] = useState<any>([])
  const [value, setValue] = React.useState(0);
  const [JSONInPrettyFormat, setJSONInPrettyFormat] = useState<string>('')
  const [temp, setTemp] = useState<any>({})
  const [importFlag, setImportFlag] = useState<string>('');
  const [showUploadFileTypeError, setShowUploadFileTypeError] = React.useState<boolean>(false);
  const [showFileNotSelectedError, setShowFileNotSelectedError] = React.useState<boolean>(false);
  const [showFileUploadSuccess, setShowFileUploadSuccess] = React.useState<boolean>(false);
  const [showFileUploadError, setShowFileUploadError] = React.useState<boolean>(false);
  const [imageUploadingFieldName, setImageUploadingFieldName] = React.useState<string>('');
  const [uploadJsonData, setUploadJsonData] = useState<any>()
  const [duplicateError, setDuplicateError] = useState<boolean>(false)
  const { apps, gamesFromAllApps, selectedApp, selectedGame } = useAppSelector(
    (state) => state.gameConfigForm
  );
  const sortData = (value: any) => {
    var embededRequire = value.filter((data: any) => { if (data.embedAtBuildTime == true && data.required == true) return data })
    var embed = value.filter((data: any) => { if(data.embedAtBuildTime == true && data.required == false) return data})
    var require = value.filter((data: any) =>{ if(data.embedAtBuildTime == false && data.required == true) return data})
    var non = value.filter((data: any) =>{ if(data.embedAtBuildTime == false && data.required == false) return data })
    return embededRequire.concat(embed).concat(require).concat(non)
  }
  
  
  useEffect(() => {
    if (selectedApp === undefined || selectedApp === '' || selectedApp === null || selectedApp === 'SAMPLE_APP') {
      //setSnackBarErrorText('Please select game from Select Game DropDown');
    } else {
      redirectTo(ROUTES.CUSTOM_THEME.replace(URL_PART_APP_ID, selectedApp));
    }
  }, [selectedApp])
 
  useEffect(() => {
    if (cmsCustomThemeAdd.response !== null && cmsCustomThemeAdd.error === '' && cmsCustomThemeAdd.loading === XHR_STATE.COMPLETE) {
      setSnackBarSuccessText(`Custom theme added successfully!`);
      dispatch(customThemeAccessDispatchers.cmsClearReqAdd());
    }
    else if (cmsCustomThemeAdd.error !== '' && cmsCustomThemeAdd.loading === XHR_STATE.ASLEEP) {
      setSnackBarErrorText('Could not register theme - ' + cmsCustomThemeAdd.error);
    }
  }, [cmsCustomThemeAdd]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

 
  
  const callJson = async(appId: string) => {
    const response = await customThemeControlApi.loadJsonData(appId)
    console.log(response)
    setUploadJsonData(response)
  }
  useEffect(() => {
    dispatch(customThemeAccessDispatchers.cmsCustomThemeGet(selectedApp,{
      success: (response: any) => {
        let data = JSON.parse(response);
        setTheme(data);
        setLottieFile(data.theme.lottieFiles)
        setAnimationSection(data.theme.lottieColors);
        setColorSection(data.theme.colors)
        setSoundSection(data.theme.sounds)
        setArtSection(data.theme.images);
        setTemp(data)
      },
    },))
    callJson(selectedApp)
  },[selectedApp])
   
  useEffect(() => {
    setThemes({
      theme: {
        images: artSection,
        colors: colorSection,
        sounds: soundSection,
        lottieFiles:lottieFile,
        lottieColors:animationSection,
        }
    })   
   
},[artSection, soundSection, animationSection, colorSection, lottieFile])
  const handleArtSectionData = (value: any) => {
  
    if (value?.length !== 0) {
      value?.map((item: any) => {
     
        handleValidation(Object.keys(item))
        
        item?.values?.map((data: any) => {
          if (data.hasOwnProperty('key')) {
            handleValidation(Object.keys(data))
            }
          })
       
      })
      setArtSection(value);
    }
  }
  const handleValidation = (data: any) => {
    let isValid = "false"
  
    data.map((item: any) => {
     
        switch (item) {
          case 'key':
            setError(null);
            break;
          case 'notes':
            setError(null);
            break;
          case 'required':
            setError(null);
            break;
          case 'embedAtBuildTime':
            setError(null);
            break;
          case 'size':
            setError(null);
            break;
          case 'values':
            setError(null);
            break;
          default:
         
            setError("Invalid key entered");
            break;
        }
        
    })
  }
  const handleColorSectionData = (value: any) => {
   
    setColorSection(value);
  }
  const handleSoundSectionData = (value: any) => {
   
    setSoundSection(value)
  }
  const handleAnimationSectionData = (value: any) => {
   
    setAnimationSection(value.animationSection)
    setLottieFile(value.lottieSection)
  }
  const xport = async () => {
    const  json = JSON.stringify(themes,undefined,4);
    const fileName = "file";
    const blob = new Blob([json],{type:'application/json'});
    const href = await URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const imports = () => {
    setJSONInPrettyFormat(JSON.stringify(themes, undefined, 4));
      
    if (ModalRef.current) {
      ModalRef.current.openModal()
    }
  }
  const handleReplaceConfig = (value: any) => {
    const data = JSON.stringify(value, undefined, 4);
    if (value.theme.hasOwnProperty('images')) {
      setJSONInPrettyFormat(data)
      setThemes(value);
      setTheme(value)
      setArtSection(value.theme.images);
      setAnimationSection(value.theme.lottieColors)
      setLottieFile(value.theme.lottieFiles)
      setSoundSection(value.theme.sounds)
      setColorSection(value.theme.colors)
      if (ModalRef.current) {
        ModalRef.current.closeModal()
        setSnackBarSuccessText('Configuration Replaced!')
      }
    }
    else {
      setSnackBarErrorText('This json is invalid')
    }
    
  }
  const handleSave = () => {
    
    if (selectedApp === undefined || selectedApp === null || selectedApp === '') {
      setSnackBarErrorText('Please Select Game from Select Game Dropdown');
    } else {
        dispatch(customThemeAccessDispatchers.cmsCustomThemeAdd(themes,selectedApp));
    }
    
  }
  const handleCancel = () => {
    console.log("temp",temp)
    setAnimationSection(temp.theme.lottieColors)
    setArtSection(temp.theme.images)
    setLottieFile(temp.theme.lottieFiles)
    setColorSection(temp.theme.colors)
    setSoundSection(temp.theme.sounds)
    setTheme(temp)
    setSnackBarInfoText('Changes are reverted');
  }
  const sortAll = () => {
    let art = [...artSection]
    const sortedArt = art.map((data: any) => {
      data.values = sortData(data.values)
      return data
    })
    setArtSection(sortedArt)
    let colours = [...colorSection]
    const colorSorted = colours.map((data: any) => {
      data.values = sortData(data?.values)
      return data
    })
    setColorSection(colorSorted)
    let lotColor = [...animationSection]
    const lottieSorted = lotColor.map((data: any) => {
      data.values = sortData(data?.values)
      return data
    })
    setAnimationSection(lottieSorted)
      let sounds = [...soundSection] 
    const soundsorted = sortData(sounds)
    setSoundSection(soundsorted)
    let files = [...lottieFile]
    const sortedLottie = sortData(files)
    setLottieFile(sortedLottie)
  }
  return (
    <div ref={refParent}>
      {themes ? <div className={customThemeClasses.customThemeSettings}>
        
        <div className={customThemeClasses.containerspace}>
          <div className={customThemeClasses.topButtons}>
            <Button className={customThemeClasses.blueBtn} onClick={() => sortAll()}>Sort</Button>
            <Button className={customThemeClasses.blueBtn} onClick={() => imports()}>Import</Button>
            <Button className={customThemeClasses.blueBtn} onClick={() => xport()}>Export</Button>
          </div>
          {/*--------------------------------------Draft-------------------------------------------- */}
       
          <div className={customThemeClasses.TabsContentContainer}>
              
            <ArtSection data={artSection} validationData={uploadJsonData} error={error ? error : null} artSectionData={handleArtSectionData} />

            <ColorSection data={colorSection} validationData={uploadJsonData} colorSectionData={handleColorSectionData} />

            <SoundSection data={soundSection} validationData={uploadJsonData} soudSectionData={handleSoundSectionData} />

            <AnimationSection animationData={animationSection} validationData={uploadJsonData} lottieData={lottieFile} animationSectionData={handleAnimationSectionData} />

          </div>
          
         
          
          <div className={customThemeClasses.btmSectionBtns}>
            <div className={customThemeClasses.btmSectionbtnOne}>
              
              {/*<Button>
                <Download />
                Download files
              </Button>*/}
            </div>

            <div className={customThemeClasses.rightBtmBxEnd}>
              <div className={customThemeClasses.saveCancelBx}>
                <Button className={customThemeClasses.blueBtn} onClick={() => handleSave()}>Save</Button>
                <Button className={customThemeClasses.blueBtn} onClick={() => handleCancel()}>Cancel</Button>
              </div>
            </div>
          </div>
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
          <Snackbar
            open={Boolean(snackBarInfoText)}
            autoHideDuration={3000}
            onClose={() => setSnackBarInfoText('')}
          >
            <Alert severity="info">
              {snackBarInfoText}
            </Alert>
          </Snackbar>
        </div>
      </div>: (<CircularProgress color="inherit" />)}
     
      <div className={customThemeClasses.artWorkModal}>
        

        <Modal
          open={preview}
          onClose={()=> setPreview(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={customThemeClasses.imgPreviewMdlContainer}>
            <div className={customThemeClasses.colorPreWrp} style={{ background: url ? url : 'white' }}>
              <span className={customThemeClasses.closeColorMdl}><Close/>
              </span>
            </div>
           
            <span className={customThemeClasses.perviewImgUrl}>{url}</span>
          </Box>
        </Modal>
        <JSONModal ref={ModalRef} data={JSONInPrettyFormat} heading={'Custom Theme'} btnName={'Replace Config'} configuredValue={handleReplaceConfig}/>
      </div>
    </div >);
};

export default CustomTheme;