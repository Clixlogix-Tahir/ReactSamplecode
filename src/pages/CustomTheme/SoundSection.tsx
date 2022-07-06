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
  CircularProgress,
  LinearProgress
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
} from "@material-ui/icons";
import { Alert } from "@material-ui/lab";
import {
  TCmsSendEmailLinkDTo,
  TCmsUser,
  TCmsUserSignUpRequestDto,
  TInvitedCmsUserSignUpRequestDto,
} from "../team-access-control-management/teamAccessControlTypes";
import { ROUTES, XHR_STATE } from "../../common/constants";
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
import axios from "axios";
import { BASE_URLs } from "../../common/constants";
import { getJrDomain } from "../../common/utils";

//const Button = styled(MuiButton)<MuiButtonSpacingType>(spacing);


const SoundSection = (props:any) => {
    const [soundSection, setSoundSection] = useState<any>([]);
  const customThemeClasses = customThemeStyles();
  const [errors, setErrors] = useState<string | null>(null)
    const [url, setUrl] = useState<any>()
  const [preview, setPreview] = React.useState(false);
  const [configuredValue , setConfiguredValue] = useState<any | null>(null)
  const [themeJSON, setThemeJSON] = useState<any>();
  const [sound, setSound] = useState<any>('');
  const [progress,setProgress] = useState<number[]>([])
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>('');
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>('');
  const [snackBarInfoText, setSnackBarInfoText] = useState<string>('');
  const ModalRef = useRef<any>(null);
  const [display, setDisplay] = useState<string>('');
  const [importFlag, setImportFlag] = useState<string>('');
  const [JSONInPrettyFormat, setJSONInPrettyFormat] = useState<string>('')
  const [showUploadFileTypeError, setShowUploadFileTypeError] = React.useState<boolean>(false);
  const [showFileNotSelectedError, setShowFileNotSelectedError] = React.useState<boolean>(false);
  const [showFileUploadSuccess, setShowFileUploadSuccess] = React.useState<boolean>(false);
  const [showFileUploadError, setShowFileUploadError] = React.useState<boolean>(false);
    const [imageUploadingFieldName, setImageUploadingFieldName] = React.useState<string>('');
    const { apps, gamesFromAllApps, selectedApp, selectedGame } = useAppSelector(
      (state) => state.gameConfigForm
    );
 
    useEffect(() => {
      if (props.data?.length !== 0) {
        setSoundSection(props.data)
      }
      if (props.validationData) {
        setThemeJSON(props.validationData)
      }
    }, [props.data,props.validationData]);
    useEffect(() => {
        props.soudSectionData(soundSection)
    }, [soundSection])
    useEffect(() => {
      if (errors === null) {
        setSoundSection(configuredValue);
        ModalRef.current.closeModal()
        setErrors(null)
        if (configuredValue !== null) {
          setSnackBarSuccessText('Configuration Replaced!');
        }
        let sounds = [...soundSection] 
        const soundsorted = sortData(sounds)
        setSoundSection(soundsorted)
      }
    },[errors,configuredValue])
    const xportArt = async (str: string,e:React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const fileName = "file";
      const json = JSON.stringify(soundSection,undefined,4);
      const blob = new Blob([json],{type:'application/json'});
      const href = await URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName + ".json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      }
     
    const handleImport = (str: string,e:React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
        setJSONInPrettyFormat(JSON.stringify(soundSection, undefined, 4));
        
         setImportFlag(str);
         if (ModalRef.current) {
           ModalRef.current.openModal()
         }
        
    }
  const handleSoundSection = () => {
    let data = {
      key: "",
      notes: "",
      required: false,
      embedAtBuildTime: false,
      platform:'',
      values: []
    }
    setSoundSection([...soundSection, { ...data }])
    setSnackBarInfoText('Press Enter to save value')
  }
  
      const handleSoundItemChange = (e:any, index: number,str: any) => {
        if (e.key === "Enter") {
          e.preventDefault();
          if (e.target.value) {     
            let isValid = false;
            themeJSON?.theme.sounds.map((data: any) => {
             console.log("data ",data)
              if (e.target.value === data.key) {
                isValid = true;
                    let list = [...soundSection];
                    list[index][str] = e.target.value;
                    list[index]['size'] =data.size;
                    list[index]['notes'] =data.notes;
                    list[index]['required'] = data.required;
                    list[index]['platform'] = data.platform;
                    list[index]['embedAtBuildTime'] = data.embedAtBuildTime;
                    setSoundSection(list);
                  } 
              
            })
            if (!isValid) {
              setSnackBarErrorText('This key is not valid, please try valid one.')
            }
            let sounds = [...soundSection] 
            const soundsorted = sortData(sounds)
            setSoundSection(soundsorted)
          } else {
            setSnackBarErrorText('Please enter some value')
          }
         
           
        }
       
       
  }
  const handleEdit = (e: any, index: number, str: any,data:any) => {
    let list = [...soundSection];
        
    
    const keyValue =data.key;
    console.log(keyValue)
    list[index][str] = '';
     setTimeout(() => {
       const element = document.getElementById(`soundKey${index}`) as HTMLInputElement;
     console.log('element',element)
     if (element) {
       element.value = keyValue
     }
     },100)
     
     
     setSoundSection(list);
     setSnackBarInfoText('Press Enter to save value')
  }
  
   
      const handleClickSoundItemChange  = async (e: any, index: number,data:any) => {
      
        let list = [...soundSection];
        e.preventDefault();
        if (data.key) {
          const file = e.target.files[0];
          const fileURL = URL.createObjectURL(file); 
          console.log(fileURL)
          const aux = new Audio();
          aux.src = fileURL;
          
          aux.addEventListener('loadedmetadata', async function (){
           
            var duration = aux.duration

            if (parseInt(data.size) === duration) {
              list[index]['values'][0] = await handleImageUpload(file,data.key,index);
            } else {
              setSnackBarErrorText(`Please upload the file with `)
            }
        },false);
          
        setSoundSection(list);
        } else {
          setSnackBarErrorText('Please enter key name first')
        }
        
      }
      
      const handleRemoveSoundItem = (index: number) => {
          let list = [...soundSection];
        list.splice(index, 1);
       
        const soundsorted = sortData(list)
        setSoundSection(soundsorted)
    }
    const handleImageUpload = async (selectedFile: File, key:string, index:number) => {
        if (!selectedFile) {
          setSnackBarErrorText('Please select file')
          return;
        } else {
          console.log(selectedFile)
          if ( selectedFile.type === 'audio/mp3' || selectedFile.type === 'audio/mpeg') {
        
            const formData = new FormData();
            formData.append('uiCustomizationKey', key)
            formData.append("compulsoryForEmbedding", "true");
            formData.append('appId',selectedApp)
            formData.append('file', selectedFile);
            const response:any = await axios.post(
              `${getJrDomain()}unclassified/admin-api/apps/uploadFileForHarnessAssets`,
              formData,
            {
              withCredentials: true,// todo move this to interceptor
              onUploadProgress: (progressEvent: any) => {
                const { loaded , total} = progressEvent 
                const prog = Math.floor(loaded * 100/ total)
                let list = [...progress]
                list[index] = prog
                setProgress(list)
              },
            } 
            );
             
            if (response?.data?.message === "success") {
         
              setShowFileUploadSuccess(true);
              return response?.data?.url;
            }
            else {
           
              setSnackBarErrorText('File not uploaded')
            }
            
          } else {
            setSnackBarErrorText('Please select valid file type - mp3')
          } 
      }
      
      
    };
    const handleReplaceConfig = (value: any) => {
      setErrors(null)
      if (value.length !== 0) {
        value.map((item: any) => {
        
          handleValidation(Object.keys(item))
          
          item.values.map((data: any) => {
            if (data.hasOwnProperty('key')) {
              handleValidation(Object.keys(data))
              }
            })
         
        })
        setConfiguredValue(value)
        
      }
    }
    const handleValidation = (data: any) => {
      let isValid = false
   console.log(data)
      data.map((item: any) => {
          switch (item) {
            case 'key':
              break;
            case 'notes':
              break;
            case 'required':
              break;
            case 'embedAtBuildTime':
              break;
            case 'size':
              break;
            case 'values':
              break;
              case 'platform':
                break;
            default:
              setErrors(`Invalid key entered in json - ${item}`)
              isValid = true;
              break;
        }
      })
     
  }
  const getEmbedIcon = (items: any) => {
    if (items.required === true && items.embedAtBuildTime === true) {
      return (<img style={{top: '-20px'}} src='/static/img/icons/mandatory.png'/>)
    }
    if (items.required === false && items.embedAtBuildTime === true) {
      return (<img style={{top: '-20px'}} src='/static/img/icons/mandatory.png'/>)
    }
    if (items.required === true && items.embedAtBuildTime === false) {
      return (<div style={{color:'#FF4949',top: '-20px'}}>*</div>)
    }
    if (items.required === false && items.embedAtBuildTime === false) {
      return null;
    }
  }
  const sortData = (value: any) => {
    var embededRequire = value.filter((data: any) => { if (data.embedAtBuildTime == true && data.required == true) return data })
    var embed = value.filter((data: any) => { if(data.embedAtBuildTime == true && data.required == false) return data})
    var require = value.filter(function (data: any) { if(data.embedAtBuildTime == false && data.required == true) return data})
    var non = value.filter(function (data: any) { if(data.embedAtBuildTime == false && data.required == false) return data })
    return embededRequire.concat(embed).concat(require).concat(non)
  }
  return (
      <>
       <Accordion className={customThemeClasses.parentCollaps}>
                <AccordionSummary className={customThemeClasses.parentCollapsText}
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  style={{ flexDirection: 'row-reverse' }}
                  id="panel1a-header"
                >
                  <Typography>Sounds</Typography>
                  <div className={customThemeClasses.bntTopRight}>
                    <Button onClick={(e)=>handleImport('Sound',e)}>Import</Button>
                    <Button onClick={(e)=>xportArt('Sound',e)}>Export</Button>
                  </div>
                </AccordionSummary>
                <div className={customThemeClasses.brdrBtm}>
                  <div className={customThemeClasses.AccordiontopHeaderText}>
                    <div className={customThemeClasses.listingWrp}>
                      <div className={customThemeClasses.ChallangeName}>
                        <span className={customThemeClasses.titleAccordion}>Name</span>
                      </div>
                      <div className={customThemeClasses.NotesText}>
                        <span className={customThemeClasses.titleAccordion}>Duration</span>
                      </div>
                      <div className={customThemeClasses.URLBox}>
                        <span className={customThemeClasses.titleAccordion}>URL</span>
                      </div>
                      <div className={customThemeClasses.editUrlBX}>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={customThemeClasses.soundMainWrp}>
                  {soundSection ? soundSection?.map((data: any, index: number) => (
                    <div key={index} className={customThemeClasses.listingWrp}>
                      <div className={customThemeClasses.listingTextBox}>
                      {data.platform === 'android' ? <img className={customThemeClasses.imgStyle} src='/static/img/icons/androidIcon.png' />:null}
                              {data.platform === 'ios' ? <img className={customThemeClasses.imgStyle} src='/static/img/icons/appleIcon.png' />:null}
                        {data.key ? (
                          <Tooltip title="Click to edit" placement="left"><span onClick={(e: any) => handleEdit(e, index, 'key', data)}> {getEmbedIcon(data)}{data.key}
                                <Tooltip title={data.notes? data.notes: 'No notes currently'} placement="right-start">
                                  <span><HelpOutlineOutlined /></span>
                                </Tooltip>
                              </span></Tooltip>) : (<div className={customThemeClasses.inputeditable}>
                           <input placeholder="Type name" id={`soundKey${index}`} onKeyPress={(e: any)=> handleSoundItemChange(e,index,'key') }/>
                              </div>)}
                      </div>
                      <div className={customThemeClasses.listingTextNotes}>
                          {data.size ? (<Tooltip title="Click to edit" placement="left"><span >{data.size}</span></Tooltip>) :
                              (<div className={customThemeClasses.inputeditable}>
                                <input placeholder="Type duration" onKeyPress={(e: any)=> handleSoundItemChange(e,index,'notes') }/>
                              </div>)}
                          </div>
                      <div className={customThemeClasses.listingUrl}>
                      { progress[index] !==undefined && progress[index] !== 0  ? progress[index] === 100?null: (<CircularProgress variant="determinate" className={customThemeClasses.progressBarSyle} value={progress[index]} />):null}
                        {data.values[0] ? (<audio controls src={data.values[0]}></audio>) :
                              null}
                          </div>
                      
                     
                      <div className={customThemeClasses.soundBTNRight}>
                        <div className={customThemeClasses.editURLSoundDiv}>
                          {/* <Button className={customThemeClasses.blueBtn}>Edit URL</Button> */}
                          <label className={customThemeClasses.uploadImageBx} htmlFor={`audio${index}`}>
                            <input id={`audio${index}`} accept='audio/mp3' type="file"  onChange={(e: any)=> handleClickSoundItemChange(e,index,data) }/>
                            <Button variant="contained" component="span">
                              Upload mp3
                            </Button>
                          </label>
                        </div>
                        {/*<div className={customThemeClasses.playBTNSoundDiv}>
                          <Button className={customThemeClasses.playBTN} onClick={() => handleAudio(index, data, sound)}>{sound === "Play" ? (<Play />) : (<Pause />)}<></></Button>
                              </div>*/}
                        <div className={customThemeClasses.closeBTNSound}>
                          <Button className={customThemeClasses.closeBtnRight} onClick={()=>handleRemoveSoundItem(index)}><Close /></Button>

                        </div>
                      </div>
                    </div>)) : null}
                  <div className={customThemeClasses.addChallangeList}>
                    <Button onClick={() => handleSoundSection()}>
                      <AddCircleOutlineRounded /> Add
                    </Button>
                  </div>
                </div>
      </Accordion>
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
        autoHideDuration={5000}
        onClose={() => setSnackBarInfoText('')}
      >
        <Alert severity="info">
          {snackBarInfoText}
        </Alert>
      </Snackbar>
          <JSONModal ref={ModalRef}
         data={JSONInPrettyFormat}
          heading={"Sound"}
            handleExport={null}
            error={errors? errors : null}
           xportArt={null}
           action={null}
           btnName={'Replace Config'}    
           configuredValue={handleReplaceConfig}
           handlePaste={null}
           /></>
  )
}

export default SoundSection