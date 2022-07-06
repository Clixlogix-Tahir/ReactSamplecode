import React, { useState, useEffect, createRef, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { makeStyles, Theme } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { Download, Upload } from "react-feather";
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
  Android,
  Apple,
  AddCircleOutlineRounded,
  HelpOutlineOutlined,
  PlayCircleFilled as Play,
  PauseCircleFilled as Pause,
  ContactsOutlined,
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
import { defaultAndroidPlatformData, setUpgradeToLiveLoading } from "../game-config/gameConfigSlice";
import { appManagementApi } from "../app-management/appManagementApi";
import { customThemeControlApi } from "./customThemeControlAPI";
import axios from "axios";
import { BASE_URLs } from "../../common/constants";
import { getJrDomain } from "../../common/utils";

//const Button = styled(MuiButton)<MuiButtonSpacingType>(spacing);
interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
function a11yProps(index: any) {
  return {
    id: `scrollable-auto-tab-${index}`,
    "aria-controls": `scrollable-auto-tabpanel-${index}`,
  };
}

const ArtSection = (props: any) => {
  const [artSection, setArtSection] = useState<any>([]);
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const customThemeClasses = customThemeStyles();
  const [errors, setErrors] = useState<string | null>(null);
  const [configuredValue, setConfiguredValue] = useState<any | null>(null)
  const [url, setUrl] = useState<any>();
  const [preview, setPreview] = React.useState(false);
  const [progress, setProgress] = useState<number[]>([])
  const ModalRef = useRef<any>(null);
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>('');
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>('');
  const [snackBarInfoText, setSnackBarInfoText] = useState<string>('');
  const [currentIdx, setCurrentIdx] = React.useState(-1);
  const [display, setDisplay] = useState<string>("");
  const [importFlag, setImportFlag] = useState<string>("");
  const [JSONInPrettyFormat, setJSONInPrettyFormat] = useState<string>("");
  const [showUploadFileTypeError, setShowUploadFileTypeError] = React.useState<boolean>(false);
  const [showFileNotSelectedError, setShowFileNotSelectedError] = React.useState<boolean>(false);
  const [showFileUploadSuccess, setShowFileUploadSuccess] = React.useState<boolean>(false);
  const [showFileUploadError, setShowFileUploadError] = React.useState<boolean>(false);
  const [imageUploadingFieldName, setImageUploadingFieldName] = React.useState<string>("");
  const [themeJSON, setThemeJson] = useState<any>();
  const [duplicateError, setDuplicateError] = useState<boolean>(false)
  const { apps, gamesFromAllApps, selectedApp, selectedGame } = useAppSelector(
    (state) => state.gameConfigForm
  );
  const sortData = (value: any) => {

    var embededRequire = value.filter((data: any) => { if (data.embedAtBuildTime == true && data.required == true) return data })
    var embed = value.filter((data: any) => { if (data.embedAtBuildTime == true && data.required == false) return data })
    var require = value.filter(function (data: any) { if (data.embedAtBuildTime == false && data.required == true) return data })
    var non = value.filter(function (data: any) { if (data.embedAtBuildTime == false && data.required == false) return data })
    return embededRequire.concat(embed).concat(require).concat(non)
  }

  useEffect(() => {
    if (props.data?.length !== 0) {
      setArtSection(props.data);
    }
    if (props.validationData) {
      setThemeJson(props.validationData)
    }
  }, [props.data, props.validationData]);

  useEffect(() => {
    if (errors === null) {
      setArtSection(configuredValue);
      ModalRef.current.closeModal()
      setErrors(null)
      if (configuredValue !== null) {
        setSnackBarSuccessText('Configuration Replaced!');
      }
      let art = [...artSection]
      const sortedArt = art.map((data: any) => {
        data.values = sortData(data.values)
        return data
      })
      setArtSection(sortedArt)
    }
  }, [errors, configuredValue])


  const addSectionArt = (value: string) => {
    let data = {
      key: "",
      notes: "",
      size: "",
      required: false,
      embedAtBuildTime: false,
      values: [],
      platform: '',
    };
    setArtSection([...artSection, { ...data }]);
    setSnackBarInfoText('Press Enter to save value')
  };


  useEffect(() => {
    props.artSectionData(artSection);
  }, [artSection]);
  const handleChangeExpanded =
    (idx: number) => {
      setCurrentIdx((currentValue: number) => (currentValue !== idx ? idx : -1));
    };
  const addSubSection = (value: any, index: number) => {
    let data = {
      key: "",
      notes: "",
      size: "",
      required: false,
      embedAtBuildTime: false,
      values: [],
      platform: '',
    };

    let list = [...artSection];

    list[index]["values"].push({ ...data });
    setArtSection(list);
    setSnackBarInfoText('Press Enter to save value')
  };

  const handleChangeEvent = (e: any, index: number) => {
    if (e.key === "Enter") {
      e.preventDefault();

      artSection.forEach((data: any, idx: number) => {
        if (idx === index) {
          let list = [...artSection];
          list[idx]["key"] = e.target.value;
          setArtSection(list);
        }
      });
    }
  };

  const handleItemChange = (e: any, index: number, data: any, idx: number, value: any, str: string) => {
    let key = value;
    let list = [...artSection];

    if (e.key === "Enter") {
      if (selectedApp) {
        e.preventDefault();
        if (e.target.value) {
          let valid = false;
          themeJSON.theme.images.map((item: any) => {

            console.log(value)
            item.values.map((data: any) => {
              if (data.hasOwnProperty('key')) {
                console.log(e.target.value, data.key, typeof e.target.value, typeof data.key)
                if (e.target.value === data.key) {
                  valid = true
                  list[index][`values`][idx][str] = e.target.value;
                  list[index][`values`][idx]['size'] = data.size;
                  list[index][`values`][idx]['notes'] = data.notes;
                  list[index][`values`][idx]['required'] = data.required;
                  list[index][`values`][idx]['embedAtBuildTime'] = data.embedAtBuildTime;

                  setArtSection(list);
                }
              }
            })
          })
          if (!valid) {
            setSnackBarErrorText('This key is not valid, please try valid one.')
          }
          let art = [...artSection]
          const sortedArt = art.map((data: any) => {
            data.values = sortData(data.values)
            return data
          })
          setArtSection(sortedArt)
        } else {
          setSnackBarErrorText('Please enter some value')
        }
      } else {
        setSnackBarErrorText('Please selecet game');
      }
    }
  };
  const handleClickItemChange = async (e: any, index: number, data: any, idx: number, value: any, str: string) => {

    let list = [...artSection];
    e.preventDefault();
    if (data.key) {
      if (e.target.files[0]) {
        const file = e.target.files[0];
        const url = URL.createObjectURL(file);
        const img = new Image();
        img.src = url;
        img.onload = async function () {
          const width = parseInt(data.size.split('x')[0])
          const height = parseInt(data.size.split('x')[1])
          if (img.width === width && img.height === height) {
            list[index][`values`][idx][str][0] = await handleImageUpload(file, data.key, index, idx)
            setArtSection(list);
          } else {
            setSnackBarErrorText(`Please upload file with correct dimensions- ${data.size}`)
          }
        }
      } else {
        setSnackBarErrorText('Plesae select file')
      }
    } else {
      setSnackBarErrorText('Please enter the key name first')
    }



  };
  const handleRemoveItem = (index: number, key?: string, idx?: null | number) => {
    if (!key) {
      let list = [...artSection];
      list.splice(index, 1);
      setArtSection(list);
    } else {

      if (idx !== null || idx !== undefined) {
        let list = [...artSection];
        list[index][`${key}`].splice(idx, 1);
        setArtSection(list);
      }
      let art = [...artSection]
      const sortedArt = art.map((data: any) => {
        data.values = sortData(data.values)
        return data
      })
      setArtSection(sortedArt)
    }
  };
  const xportArt = async (str: string, e: React.MouseEvent<HTMLButtonElement>) => {
    // I am assuming that "this.state.myData"
    // is an object and I wrote it to file as
    // json
    e.stopPropagation();
    const fileName = "file";
    let json = JSON.stringify(artSection, undefined, 4);
    const blob = new Blob([json], { type: "application/json" });
    const href = await URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName + ".json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImport = (str: string, e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setJSONInPrettyFormat(JSON.stringify(artSection, undefined, 4));

    setImportFlag(str);
    if (ModalRef.current) {

      ModalRef.current.openModal();
    }
  };

  const handleImageUpload = async (selectedFile: File, key: string, index: number, idx: number) => {
    if (!selectedFile) {
      setSnackBarErrorText('Please select File');
      return;
    }
    else {
      if (
        selectedFile.type === "image/jpeg" ||
        selectedFile.type === "image/png"
      ) {
        console.log('file here ', selectedFile)
        const formData = new FormData();
        formData.append("uiCustomizationKey", key);
        formData.append("compulsoryForEmbedding", "true");
        formData.append("appId", selectedApp);
        formData.append("file", selectedFile);

        const response: any = await axios.post(
          `${getJrDomain()}unclassified/admin-api/apps/uploadFileForHarnessAssets`,
          formData,
          {
            withCredentials: true,// todo move this to interceptor
            onUploadProgress: (progressEvent: any) => {
              const { loaded, total } = progressEvent
              const prog = Math.floor(loaded * 100 / total)
              let list = [...progress]
              list[parseInt(`${index}${idx}`)] = prog
              setProgress(list)
            },
          }
        );
        setImageUploadingFieldName("");

        if (response?.data?.message === "success") {


          return response?.data?.url;
        } else {

          setSnackBarErrorText('File not uploaded')
        }

      } else {
        setSnackBarErrorText('Please select valid file of png type');
      }
    }

  };
  const handlePreview = (str: string, data: any) => {
    setUrl(data);

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
  const handleValidation = (data: any) => {
    let isValid = "";

    data.map((item: any) => {
      console.log(item)
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
        case 'platform':
          break;
        case "values":
          break;
        default:
          setErrors(`Invalid key entered in json - ${item}`);
          break;
      }
    });
  }

  const handleEdit = (e: any, index: number, data: any, idx: number, value: any, str: string) => {
    let list = [...artSection];

    e.preventDefault();
    const keyValue = data.key;
    console.log(keyValue)
    list[index][`values`][idx][str] = "";
    setTimeout(() => {
      const element = document.getElementById(`artKey${index}${idx}`) as HTMLInputElement;
      console.log('element', element)
      if (element) {
        element.value = keyValue
      }
    }, 100)


    setArtSection(list);
    setSnackBarInfoText('Press Enter to save value')
  };
  const getEmbedIcon = (items: any) => {
    if (items.required === true && items.embedAtBuildTime === true) {
      return (<img style={{ top: '-20px' }} src='/static/img/icons/mandatory.png' />)
    }
    if (items.required === false && items.embedAtBuildTime === true) {
      return (<img style={{ top: '-20px' }} src='/static/img/icons/mandatory.png' />)
    }
    if (items.required === true && items.embedAtBuildTime === false) {
      return (<div style={{ color: '#FF4949', top: '-20px' }}>*</div>)
    }
    if (items.required === false && items.embedAtBuildTime === false) {
      return null;
    }
  }



  return (
    <>
      {!errors ? (
        <Accordion className={customThemeClasses.parentCollaps}>

          <AccordionSummary
            className={customThemeClasses.parentCollapsText}

            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            style={{ flexDirection: "row-reverse" }}
            id="panel1a-header"
          >
            <Typography>Art Work</Typography>
            <div className={customThemeClasses.bntTopRight}>
              <Button onClick={(e) => handleImport("Art", e)}>Import</Button>
              <Button onClick={(e) => xportArt("Art", e)}>Export</Button>
            </div>
          </AccordionSummary>
          <div className={customThemeClasses.AccordiontopHeaderText}>
            <div className={customThemeClasses.listingWrp}>
              <div className={customThemeClasses.ChallangeName}>
                <span className={customThemeClasses.titleAccordion}>Name</span>
              </div>
              <div className={customThemeClasses.NotesText}>
                <span className={customThemeClasses.titleAccordion}>Size</span>
              </div>
              <div className={customThemeClasses.URLBox}>
                <span className={customThemeClasses.titleAccordion}>Files</span>
              </div>
              <div className={customThemeClasses.editUrlBX}></div>
            </div>
          </div>
          {artSection
            ? artSection?.map((data: any, index: number) => (
              <Accordion key={index} className={customThemeClasses.innerAccordion}>
                <AccordionSummary
                  expandIcon={<ExpandMore />}
                  aria-controls="panel1a-content"
                  style={{ flexDirection: "row-reverse" }}
                  id="panel1a-header"
                >
                  {data.key ? (<Typography>{data.key}</Typography>) : (<input autoFocus className={customThemeClasses.inputedLabel} onKeyPress={(e: any) => handleChangeEvent(e, index)} />)}
                  <Button onClick={() => handleRemoveItem(index)} className={customThemeClasses.closeBtnRight}><Close /></Button>
                </AccordionSummary>

                <AccordionDetails>
                  {data
                    ? data.values?.map((items: any, idx: number) => (
                      <div key={idx} className={customThemeClasses.listingWrp}>
                        <div className={customThemeClasses.listingTextBox}>
                          <div
                            className={customThemeClasses.listingTextWrp}
                          >
                            {items.platform === 'android' ? <span className={customThemeClasses.andIcnWrp}><img className={customThemeClasses.imgStyle} src='/static/img/icons/androidIcon.png' /></span> : null}
                            {items.platform === 'ios' ? <span className={customThemeClasses.andIcnWrp}><img className={customThemeClasses.imgStyle} src='/static/img/icons/appleIcon.png' /> </span> : null}
                            {items.key ? (<Tooltip
                              title="Click to edit"
                              placement="left"
                            ><span onClick={(e) => handleEdit(e, index, items, idx, data.key, "key")}>{getEmbedIcon(items)}{items.key} <Tooltip
                              title={items.notes ? items.notes : 'No notes currently'}
                              placement="right-start"
                            ><span>
                                <HelpOutlineOutlined />
                              </span>
                            </Tooltip>
                              </span>
                            </Tooltip>
                            ) : (
                              <div
                                className={customThemeClasses.inputeditable}
                              >
                                <input placeholder="Type name" id={`artKey${index}${idx}`} onKeyPress={(e: any) =>
                                  handleItemChange(e, index, items, idx, data.key, "key")} />
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={customThemeClasses.listingTextNotes}
                        >
                          {items.size ? (
                            <span >{items.size}</span>

                          ) : null}
                        </div>
                        <div className={customThemeClasses.listingUrl}>

                          {progress[parseInt(`${index}${idx}`)] !== undefined && progress[parseInt(`${index}${idx}`)] !== 0 ? progress[parseInt(`${index}${idx}`)] === 100 ? null : (<CircularProgress variant="determinate" className={customThemeClasses.progressBarSyle} value={progress[parseInt(`${index}${idx}`)]} />) : null}
                          {items.values[0] ? (
                            <Button className={customThemeClasses.previewBtn} onClick={() => handlePreview("Artwork", items.values[0])}>
                              Preview
                            </Button>
                          ) : null}
                        </div>
                        <div className={customThemeClasses.editUrlBtns}>
                          {/* <Button className={customThemeClasses.blueBtn}>Edit URL</Button> */}
                          <label
                            className={customThemeClasses.uploadImageBx}
                            htmlFor={`${index}${idx}`}
                          >
                            <input accept="image/png" id={`${index}${idx}`} type="file"
                              onChange={(e: any) => handleClickItemChange(e, index, items, idx, data.key, "values")}
                            />
                            <Button variant="contained" component="span">
                              Upload Image
                            </Button>
                          </label>
                          <Button
                            className={customThemeClasses.closeBtnRight}
                            onClick={() =>
                              handleRemoveItem(index, "values", idx)
                            }
                          >
                            <Close />
                          </Button>
                        </div>
                      </div>
                    ))
                    : null}

                  <div className={customThemeClasses.addChallangeList}>
                    <Button onClick={() => addSubSection(data.keys, index)}>
                      <AddCircleOutlineRounded /> Add
                    </Button>
                  </div>
                </AccordionDetails>
              </Accordion>
            ))
            : null}

          <div className={customThemeClasses.addSectionRow}>
            <Button onClick={() => addSectionArt("")}>
              <AddCircleOutlineRounded /> Add Section
            </Button>
          </div>
        </Accordion>
      ) : null}
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
      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className={customThemeClasses.imgPreviewMdlContainer}>
          <div
          >
            <figure className={customThemeClasses.imgPrevWrp}>
              <img style={{ maxWidth: "80%" }} src={url} />
            </figure>
            <span className={customThemeClasses.closeColorMdl} onClick={() => setPreview(false)}>
              <Close />
            </span>
          </div>
          <span className={customThemeClasses.perviewImgUrl}>{url}</span>
        </Box>
      </Modal>
      <JSONModal
        ref={ModalRef}
        data={JSONInPrettyFormat}
        heading={"Art Work"}
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

export default ArtSection;
