import React, { useState, useEffect, createRef, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import { Download, Upload } from "react-feather";
import * as CONSTANTS_TEAM_ACCESS from "../team-access-control-management/constants";
import axios from "axios";
import { BASE_URLs } from "../../common/constants";
import { getJrDomain } from "../../common/utils";
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
import ColorPalette from "../../components/ColorPalette";
import { setUpgradeToLiveLoading } from "../game-config/gameConfigSlice";
import { appManagementApi } from "../app-management/appManagementApi";
import { customThemeControlApi } from "./customThemeControlAPI";
import { Player, Controls } from "@lottiefiles/react-lottie-player";


const AnimationSection = (props: any) => {
  const [animationSection, setAnimationSection] = useState<any>([]);
  
  const [themeJSON, setThemeJson] = useState<any>();
  const [lottieSection, setLottieSection] = useState<any>([]);
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>("");
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>("");
  const [snackBarInfoText, setSnackBarInfoText] = useState<string>('');
  const customThemeClasses = customThemeStyles();
  const [errors, setErrors] = useState<string | null>(null);
  const [configuredValue, setConfiguredValue] = useState<any | null>(null)
  const [url, setUrl] = useState<any>();
  const [preview, setPreview] = React.useState(false);
  const [selectPreview, setSelectPreview] = React.useState(false);
  const ModalRef = useRef<any>(null);
  const [display, setDisplay] = useState<string>("");
  const [select, setSelect] = useState<string | null>(null);
  const [importFlag, setImportFlag] = useState<string>("");
  const [JSONInPrettyFormat, setJSONInPrettyFormat] = useState<string>("");
  const [duplicateError, setDuplicateError ] = useState<boolean>(false)
  const [progress, setProgress] = useState<number[]>([])
  const [showUploadFileTypeError, setShowUploadFileTypeError] =
    React.useState<boolean>(false);
  const [showFileNotSelectedError, setShowFileNotSelectedError] =
    React.useState<boolean>(false);
  const [showFileUploadSuccess, setShowFileUploadSuccess] =
    React.useState<boolean>(false);
  const [showFileUploadError, setShowFileUploadError] =
    React.useState<boolean>(false);
  const [imageUploadingFieldName, setImageUploadingFieldName] =
    React.useState<string>("");
  const { apps, gamesFromAllApps, selectedApp, selectedGame } = useAppSelector(
    (state) => state.gameConfigForm
  );
  useEffect(() => {
    if (props.animationData?.length !== 0) {
      setAnimationSection(props.animationData);
    }
    if (props.lottieData?.length !== 0) {
      setLottieSection(props.lottieData);
    }
    if (props.validationData) {
      setThemeJson(props.validationData)
    }
  }, [props.animationData, props.lottieData,props.validationData]);
  useEffect(() => {
    let data = {
      lottieSection,
      animationSection,
    };
    props.animationSectionData(data);
  }, [lottieSection, animationSection]);
  
  useEffect(() => {
    if (errors === null) {
      if (select === 'Files') {
        setLottieSection(configuredValue)
      }
      if(select === 'Colors') {
        setAnimationSection(configuredValue)
      }
      ModalRef.current.closeModal()
      setErrors(null)
      if (configuredValue !== null) {
        setSnackBarSuccessText('Configuration Replaced!');
        setSelectPreview(false)
      }
      let lotColor = [...animationSection]
      const lottieSorted = lotColor.map((data: any) => {
        data.values = sortData(data?.values)
        return data
      })
      setAnimationSection(lottieSorted)
      let files = [...lottieSection]
    const sortedLottie = sortData(files)
    setLottieSection(sortedLottie)
    }
  },[errors,configuredValue])
  const addSectionLottie = () => {
    let data = {
      key: "",
      notes: "",
      size: "",
      required: false,
      embedAtBuildTime: false,
      platform:'',
      values: [],
    };
    setLottieSection([...lottieSection, { ...data }]);
    setSnackBarInfoText('Press Enter to save value')
  };

  const handleLottieItemChange = (e: any, index: number, str: string) => {
    if (e.key === "Enter") {
      if (selectedApp) {
        
      } else {
        
      }
      if (e.target.value) {
        e.preventDefault();
        let isValid = false;
        themeJSON.theme.lottie_files.map((data: any) => {
          if (e.target.value === data.key) {
            isValid = true;
                let list = [...lottieSection];
                list[index][str] = e.target.value;
                list[index]['size'] =data.size;
                list[index]['notes'] =data.notes;
                list[index]['required'] = data.required;
                list[index]['embedAtBuildTime'] = data.embedAtBuildTime;
                list[index]['platform'] = data.platform;
                setLottieSection(list);
              } 
        })
        if (!isValid) {
          setSnackBarErrorText('This key is not valid, please try valid one.')
        }
        let files = [...lottieSection]
    const sortedLottie = sortData(files)
    setLottieSection(sortedLottie)
      }
      else {
        setSnackBarErrorText('Please enter some value')
      }
    }
  };
  const handleEdit = (e: any, index: number, str: string,data:any) => {
    let list = [...lottieSection];
   
    
    const keyValue =data.key;
   console.log(keyValue)
   list[index][str] = '';
    setTimeout(() => {
      const element = document.getElementById(`lottie${index}`) as HTMLInputElement;
    console.log('element',element)
    if (element) {
      element.value = keyValue
    }
    },100)
    
    
    setLottieSection(list);
    setSnackBarInfoText('Press Enter to save value')
  }

  const handleClickLottieItemChange = async (
    e: any,
    index: number,
    data: any
  ) => {
    if (data.key) {
      let list = [...lottieSection];
    e.preventDefault();
   

    e.preventDefault();

    list[index]["values"][0] = await handleImageUpload(e.target.files[0], data.key,index);
    setLottieSection(list);
    } else {
      setSnackBarErrorText('Please enter the key name first')
    }
    
  };
  const handleRemoveLottieItem = (index: number) => {
    let list = [...lottieSection];
    list.splice(index, 1);
    
    const sortedLottie = sortData(list)
    setLottieSection(sortedLottie)
  };

  const handleImageUpload = async (selectedFile: File, key: string,index: number) => {
    if (!selectedFile) {
      setSnackBarErrorText('Please select file')
      return;
    } else {
      if (selectedFile.type === "application/json") {
    
        const formData = new FormData();
        formData.append("uiCustomizationKey", key);
        formData.append("compulsoryForEmbedding", "true");
        formData.append("appId", selectedApp);
        formData.append("file", selectedFile);
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
        setImageUploadingFieldName("");
        console.log(response)
        if (response?.data?.message === "success") {
          setShowFileUploadSuccess(true);
          return response?.data?.url;
        } else {
          setSnackBarErrorText('File not uploaded');
        }
        
      } else {
        setSnackBarErrorText('Please select valid file - Lottie-JSON')
      }
    }};

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const xportArt = async (str: string,e:React.MouseEvent<HTMLButtonElement>) => {
    // I am assuming that "this.state.myData"
    // is an object and I wrote it to file as
    // json
    e.stopPropagation();
    const json = JSON.stringify({ lottieFiles:lottieSection, lottieColors:animationSection}, undefined, 4);
    const fileName = "file";

    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAnimationPaletteValue = (
    data: any,
    placeValue: number,
    keyName: any,
    outerIndex: number,
    index: number
  ) => {
   
    let list = [...animationSection];
    if (
      data.R === undefined &&
      data.G === undefined &&
      data.B === undefined &&
      data.A === undefined
    ) {
    } else {
      list[outerIndex]["values"][index]["values"][
        placeValue
      ] = `${data.R} ${data.G} ${data.B} ${data.A}`;
      setAnimationSection(list);
    }
  };

  const handleAnimationChangeEvent = (e: any, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      animationSection.forEach((data: any, idx: number) => {
        if (idx === index) {
          let list = [...animationSection];
          list[idx]["key"] = e.target.value;
          setAnimationSection(list);
        }
      });
    }
  };
  const addAnimationSection = (value: string) => {
    let data = {
      key: "",
      notes: "",
      required: false,
      embedAtBuildTime: false,
      platform:'',
      values: [],
    };
    setAnimationSection([...animationSection, { ...data }]);
  };
  const addAnimationSubSection = (value: any, index: number) => {
    let data = {
      key: "",
      notes: "",
      required: false,
      embedAtBuildTime: false,
      values: [],
      platform:'',
    };
    let key = value;
  
    let list = [...animationSection];
    list[index][`values`].push({ ...data });
    setAnimationSection(list);
    setSnackBarInfoText('Press Enter to save value')
  
  };
  const handleRemoveAnimationItem = (
    index: number,
    key?: string,
    idx?: null | number
  ) => {
    if (!key) {
      let list = [...animationSection];
      list.splice(index, 1);
      setAnimationSection(list);
    } else {
    
      if (idx !== null || idx !== undefined) {
        let list = [...animationSection];
        list[index][`values`].splice(idx, 1);

       
        const lottieSorted = list.map((data: any) => {
          data.values = sortData(data?.values)
          return data
        })
        setAnimationSection(lottieSorted)
      }
    }
  };

  const handleImport = (e: React.MouseEvent<HTMLButtonElement>, str: string) => {
    e.stopPropagation();
    setSelectPreview(true);
    let data = {
      lottieSection,
      animationSection,
    };
    /*setJSONInPrettyFormat(JSON.stringify(data, undefined, 4));
       
        setImportFlag(str);
        if (ModalRef.current) {
          ModalRef.current.openModal()
        }*/
  };
  const handleAnimationLayers = ( e: any,index: number,key: string,idx: number ) => {
    if (e.key === "Enter") {
      if (e.target.value) {
        let isValid = false;
        themeJSON.theme.lottie_colors.map((item: any) => {
          item.values.map((data: any) => {
            if (data.hasOwnProperty('key')) {
             
              if (e.target.value === data.key) {
                isValid = true;
                let list = [...animationSection];
                list[index]["values"][idx]["key"] = e.target.value;
                list[index]["values"][idx]['platform'] =data.platform;
                list[index]["values"][idx]['size'] =data.size;
                list[index]["values"][idx]['notes'] =data.notes;
                list[index]["values"][idx]['required'] = data.required;
                list[index]["values"][idx]['embedAtBuildTime'] = data.embedAtBuildTime;
                setAnimationSection(list);
              }
           }
          })
          if (!isValid) {
            setSnackBarErrorText('This key is not valid, please try valid one.')
          }
        })
        let lotColor = [...animationSection]
        const lottieSorted = lotColor.map((data: any) => {
          data.values = sortData(data?.values)
          return data
        })
        setAnimationSection(lottieSorted)
        
      } else {
        setSnackBarErrorText('Enter some value')
      }
     
    }
  };
  const handleEditAnimation = (e: any, index: number, key: string, idx: number,data:any) => {
    let list = [...animationSection];
        
    
    
    const keyValue =data.key;
   console.log(keyValue)
   list[index]["values"][idx]["key"] = '';
    setTimeout(() => {
      const element = document.getElementById(`colors${ index }${ idx }`) as HTMLInputElement;
    console.log('element',element)
    if (element) {
      element.value = keyValue
    }
    },100)
    
    
    setAnimationSection(list);
    setSnackBarInfoText('Press Enter to save value')
  }
  const handlePreview = (str: string, data: any) => {
    if (str === "Artwork") {
      setUrl(data);
    } else {
      let arr: string[] = [];
     
      data.map((x: any) => {
        x.split(" ").map((y: any) => {
          arr.push(y);
        });
      });
      switch (arr.length) {
        case 4:
          setUrl(`rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`);
          break;
        case 8:
          setUrl(`linear-gradient(rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]}),
          rgba(${arr[4]},${arr[5]},${arr[6]},${arr[7]}))`);
          break;
        case 12:
          setUrl(`linear-gradient(rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]}),
            rgba(${arr[4]} , ${arr[5]},${arr[6]},${arr[7]})
            ,rgba(${arr[8]} , ${arr[9]},${arr[10]},${arr[11]}))`);
          break;
        case 16:
          setUrl(`linear-gradient(rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]}),
            rgba(${arr[4]},${arr[5]},${arr[6]},${arr[7]})
            ,rgba(${arr[8]},${arr[9]},${arr[10]},${arr[11]})
            ,rgba(${arr[12]},${arr[13]},${arr[15]},${arr[15]}))`);
          break;
      }
    }

    setDisplay(str);
    setPreview(true);
  };
  const handleReplaceConfig = (value: any) => {
   setErrors(null)

    if (value.length !== 0) {
      value.map((item: any) => {
    
        handleValidation(Object.keys(item));

        item.values.map((data: any) => {
          if (data.hasOwnProperty("key")) {
            handleValidation(Object.keys(data));
          }
        });
      });

     setConfiguredValue(value)
    }
  };
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
  const handleValidation = (data: any) => {
    let isValid = "";
   
    data.map((item: any) => {
      switch (item) {
        case "key":
          break;
        case "notes":
          break;
        case "required":
          break;
        case "embedAtBuildTime":
          break;
        case "size":
          break;
        case "values":
          break;
        case "lottieColors":
          break;
          case 'platform':
            break;
        case "lottieFiles":
          break;
        default:
          setErrors(`Invalid key entered in json - ${item}`);
          break;
      }
    });
    
  };
  const handleSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.persist();
    
    if (select) {
      if (ModalRef.current) {
        ModalRef.current.openModal();
      }
      if (select === "Files") {
        setJSONInPrettyFormat(JSON.stringify(lottieSection, undefined, 4));
      } else {
        setJSONInPrettyFormat(JSON.stringify(animationSection, undefined, 4));
        setImportFlag("Colors");
      }
    }
  };
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
        <AccordionSummary
          className={customThemeClasses.parentCollapsText}
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          style={{ flexDirection: "row-reverse" }}
          id="panel1a-header"
        >
          <Typography>Animation</Typography>
          <div className={customThemeClasses.bntTopRight}>
            <Button onClick={(e) => handleImport(e,"Animation")}>Import</Button>
            <Button onClick={(e) => xportArt("Animation",e)}>Export</Button>
          </div>
        </AccordionSummary>
        <div className={customThemeClasses.AccordiontopHeaderText}>
          <div className={customThemeClasses.listingWrp}>
            <div className={customThemeClasses.ChallangeName}>
              <span className={customThemeClasses.titleAccordion}>Name</span>
            </div>
            <div className={customThemeClasses.NotesText}>
              <span className={customThemeClasses.titleAccordion}></span>
            </div>
            <div className={customThemeClasses.URLBox}>
              <span className={customThemeClasses.titleAccordion}>URL</span>
            </div>
            <div className={customThemeClasses.editUrlBX}></div>
          </div>
        </div>
        <h4 className={customThemeClasses.heading}>Lottie files</h4>
        <div className={customThemeClasses.soundMainWrp}>
          {lottieSection
            ? lottieSection?.map((data: any, index: number) => (
                <div  key={index} className={customThemeClasses.listingWrp}>
                <div className={customThemeClasses.listingTextBox}>
                {data.platform === 'android' ? <img className={customThemeClasses.imgStyle} src='/static/img/icons/androidIcon.png' />:null}
                              {data.platform === 'ios' ? <img className={customThemeClasses.imgStyle} src='/static/img/icons/appleIcon.png' />:null}
                  {data.key ? (
                     <Tooltip
                     title="Click to edit"
                     placement="left"
                   >
                      <span
                        onClick={(e: any)=> handleEdit(e, index, "key",data)}
                      >
                        { getEmbedIcon(data)} {data.key}
                        <Tooltip
                          title={data.notes? data.notes: 'No notes currently'}
                          placement="right-start"
                        >
                          <span>
                            <HelpOutlineOutlined />
                          </span>
                        </Tooltip>
                      </span>
                      </Tooltip>
                    ) : (
                      <div className={customThemeClasses.inputeditable}>
                        <input placeholder="Type name" id={`lottie${index}`} onKeyPress={(e: any) => handleLottieItemChange(e, index, "key")}/>
                      </div>
                    )}
                  </div>
                  <div className={customThemeClasses.listingTextNotes}>
                 
                  </div>
                <div className={customThemeClasses.listingUrl}>
                  { progress[index] !==undefined && progress[index] !== 0  ? progress[index] === 100?null: (<CircularProgress variant="determinate" className={customThemeClasses.progressBarSyle} value={progress[index]} />):null}
                    {data.values[0] ?(  <Button className={customThemeClasses.previewBtn} onClick={() =>handlePreview("Artwork", data.values[0])}>
                                  Preview
                                </Button>) : null}
                  </div>

                  <div className={customThemeClasses.soundBTNRight}>
                    <div className={customThemeClasses.editURLSoundDiv}>
                      {/* <Button className={customThemeClasses.blueBtn}>Edit URL</Button> */}
                      <label className={customThemeClasses.uploadImageBx} htmlFor={`json${index}`}>
                      <input id={`json${index}`} accept="application/json" type="file" key={index}
                        onChange={(e: any) => handleClickLottieItemChange(e, index, data)}/>
                        <Button variant="contained" component="span">
                          Upload File
                        </Button>
                      </label>
                    </div>

                    <div className={customThemeClasses.closeBTNSound}>
                      <Button className={customThemeClasses.closeBtnRight} onClick={() => handleRemoveLottieItem(index)}>
                        <Close />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            : null}

          <div className={customThemeClasses.addChallangeList}>
            <Button onClick={() => addSectionLottie()}>
              <AddCircleOutlineRounded /> Add Section
            </Button>
          </div>
        </div>

        {/*----------------------Lottie Colors-------------------------------------- */ }
        <h4 className={customThemeClasses.heading}>Lottie Colors</h4>
        {animationSection
          ? animationSection?.map((data: any, index: number) => (
              <Accordion key={index} className={customThemeClasses.innerAccordion}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  style={{ flexDirection: "row-reverse" }}
                  id="panel1a-header"
                >
                  {data.key ? ( <Typography>{data.key}</Typography>) : (
                    <input placeholder="Type name" autoFocus className={customThemeClasses.inputedLabel}
                      onKeyPress={(e: any) =>handleAnimationChangeEvent(e, index)}/>)}
                  <Button className={customThemeClasses.closeBtnRight} onClick={() => handleRemoveAnimationItem(index)}>
                    <Close />
                  </Button>
                </AccordionSummary>

                <AccordionDetails>
                  {data ? data?.values?.map((items: any, idx: number) => (
                    <div key={idx}>
                       {items.platform === 'android' ? <img className={customThemeClasses.imgStyle} src='/static/img/icons/androidIcon.png' />:null}
                              {items.platform === 'ios' ? <img className={customThemeClasses.imgStyle} src='/static/img/icons/appleIcon.png' />:null}
                          {items.key ? (
                            <Tooltip
                            title="Click to edit"
                            placement="left"
                        >
                          <span onClick={(e: any) =>
                                (e: any) =>
                                handleEditAnimation(e, index, data.key, idx,items)}
                            className={customThemeClasses.typeName}>
                            { getEmbedIcon(items)} {items.key}
                          <Tooltip
                          title={items.notes? items.notes: 'No notes currently'}
                          placement="right-start"
                        >
                              <HelpOutlineOutlined />
                            </Tooltip>
                          </span>
                          </Tooltip>
                          ) : (
                            <input
                            style={{ marginBottom: "10px" }}
                            id={`colors${index}${idx}`}
                              onKeyPress={(e: any) =>
                                handleAnimationLayers(e, index, data.key, idx)
                              }
                            />
                          )}
                          <div className={customThemeClasses.colorMainWrp}>
                        {items.size === "1" ? (<ColorPalette palette={items.values[0]} placeValue={0} keyName={data.key} outerIndex={index} index={idx} values={handleAnimationPaletteValue} />): (<><ColorPalette palette={items.values[0]} placeValue={0} keyName={data.key} outerIndex={index} index={idx} values={handleAnimationPaletteValue} />
                          <ColorPalette palette={items.values[1]} placeValue={1} keyName={data.key} outerIndex={index} index={idx} values={handleAnimationPaletteValue} />
                          <ColorPalette palette={items.values[2]} placeValue={2} keyName={data.key} outerIndex={index} index={idx} values={handleAnimationPaletteValue} />
                          <ColorPalette palette={items.values[3]} placeValue={3} keyName={data.key} outerIndex={index} index={idx} values={handleAnimationPaletteValue} /></>)}
                            <div className={customThemeClasses.previewCloseBox}>
                              <div className={customThemeClasses.perviewBtnBx}>
                                <Button className={customThemeClasses.previewBtn} onClick={() => handlePreview("Color", items.values) }>
                                  Preview
                                </Button>
                              </div>
                              <Button
                                className={customThemeClasses.closeBtnRight}
                                onClick={() =>handleRemoveAnimationItem(index,data.key,idx)}>
                                <Close />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    : null}

                  <div className={customThemeClasses.addChallangeList}>
                    <Button
                      onClick={() => addAnimationSubSection(data.key, index)}
                    >
                      <AddCircleOutlineRounded /> Add
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
          : null}

        <div className={customThemeClasses.addSectionRow}>
          <Button onClick={() => addAnimationSection("")}>
            <AddCircleOutlineRounded /> Add Section
          </Button>
        </div>
      </Accordion>
      <Snackbar
        open={Boolean(snackBarErrorText)}
        autoHideDuration={3000}
        onClose={() => setSnackBarErrorText("")}
      >
        <Alert severity="error">{snackBarErrorText}</Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(snackBarSuccessText)}
        autoHideDuration={3000}
        onClose={() => setSnackBarSuccessText("")}
      >
        <Alert severity="success">{snackBarSuccessText}</Alert>
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
      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={customThemeClasses.imgPreviewMdlContainer}>
          {display === "Color" ? (
            <div
              className={customThemeClasses.colorPreWrp}
              style={{ background: url ? url : "white" }}
            >
              <span
                className={customThemeClasses.closeColorMdl}
                onClick={() => setPreview(false)}
              >
                <Close />
              </span>
            </div>
          ) : (
            <Player
              autoplay
              loop
              src={url}
              style={{ height: '300px', width: '300px' }}
            >
              <Controls visible={true} buttons={['play', 'repeat', 'frame', 'debug']} />
            </Player>
          )}

          <span className={customThemeClasses.perviewImgUrl}>{url}</span>
        </Box>
      </Modal>
      <Modal
        open={selectPreview}
        onClose={() => setSelectPreview(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={customThemeClasses.imgPreviewMdlContainer}>
          <div className={customThemeClasses.selectDiv}>
            <div>
              <FormControl>
                <FormLabel id="demo-row-radio-buttons-group-label">
                  Select Lottie Section to import
                </FormLabel>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  value={select}
                  onChange={(e: any) => setSelect(e.target.value)}
                >
                  <FormControlLabel
                    value="Files"
                    control={<Radio />}
                    label="Lottie Files"
                  />
                  <FormControlLabel
                    value="Colors"
                    control={<Radio />}
                    label="Lottie Colors"
                  />
                </RadioGroup>
              </FormControl>
            </div>
            <Button
              style={{marginRight: '10px'}}
              className={customThemeClasses.blueBtn}
              onClick={() => setSelectPreview(false)}
            >
              Close
            </Button>
            <Button
              className={customThemeClasses.blueBtn}
              onClick={(e) => handleSelect(e)}
            >
              Select
            </Button>
          </div>
        </Box>
      </Modal>
      <JSONModal
        ref={ModalRef}
          data={JSONInPrettyFormat}
          heading={"Animation"}
       handleExport={null}
        error={errors ? errors : null}
        xportArt={null}
        action={null}
        btnName={"Replace Config"}
        configuredValue={handleReplaceConfig}
        handlePaste={null}
      />
    </>
  );
};

export default AnimationSection;
