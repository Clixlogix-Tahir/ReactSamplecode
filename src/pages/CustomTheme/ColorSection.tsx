import React, { useState, useEffect, createRef, useRef } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';
import { Download, Upload } from "react-feather"
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

//const Button = styled(MuiButton)<MuiButtonSpacingType>(spacing);




const ColorSection = (props: any) => {
    const [colorSection, setColorSection] = useState<any>([])
    const customThemeClasses = customThemeStyles();
  const [url, setUrl] = useState<any>()
  const [themeJSON, setThemeJSON] = useState<any>();
  const [errors, setErrors] = useState<string | null>(null)
  const [configuredValue, setConfiguredValue] = useState<any | null>(null)
  const [preview, setPreview] = React.useState(false);
  const ModalRef = useRef<any>(null);
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>('');
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>('');
  const [snackBarInfoText, setSnackBarInfoText] = useState<string>('');
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
        setColorSection(props.data)
      }
      if (props.validationData) {
        setThemeJSON(props.validationData)
      }
      
    }, [props.data,props.validationData]);
    useEffect(() => {
        props.colorSectionData(colorSection)
    }, [colorSection])
    useEffect(() => {
      if (errors === null) {
        setColorSection(configuredValue);
        ModalRef.current.closeModal()
        setErrors(null)
        if (configuredValue !== null) {
          setSnackBarSuccessText('Configuration Replaced!');
        }
        let colours = [...colorSection]
    const colorSorted = colours.map((data: any) => {
      data.values = sortData(data?.values)
      return data
    })
    setColorSection(colorSorted)
      }
    },[errors,configuredValue])
  const xportArt = async (str: string, e:React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const fileName = "file";
      const json = JSON.stringify(colorSection,undefined,4);
      const blob = new Blob([json],{type:'application/json'});
      const href = await URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = href;
      link.download = fileName + ".json";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
  
      const handlePaletteValue =( data:any,placeValue: number,keyName: any, outerIndex : number,index: number)=>{
       
        if (data.R === undefined && data.G === undefined && data.B === undefined && data.A === undefined) {
          
        } else {
          let list = [...colorSection]
         
          list[outerIndex]['values'][index]['values'][placeValue] = `${data.R} ${data.G} ${data.B} ${data.A}`
          setColorSection(list)
        }
       ;
    }
    const handleColorLayers = (e: any, index: number, key: string, idx: number) => {
      if (e.key === "Enter") {
        if (e.target.value) {
          if (selectedApp) {
            let isValid = false;
          themeJSON.theme.colors.map((item: any) => {
            item.values.map((data: any) => {
              if (data.hasOwnProperty('key')) {
               
                if (e.target.value === data.key) {
                  isValid = true
                  let list = [...colorSection];
                  list[index]["values"][idx]["key"] = e.target.value;
                  list[index]["values"][idx]['size'] =data.size;
                  list[index]["values"][idx]['platform'] =data.platform;
                  
                  list[index]["values"][idx]['notes'] =data.notes;
                  list[index]["values"][idx]['required'] = data.required;
                  list[index]["values"][idx]['embedAtBuildTime'] = data.embedAtBuildTime;
                  setColorSection(list);
                }
             }
            })
            if (!isValid) {
              setSnackBarErrorText('This key is not valid, please try valid one.')
            }
            let colours = [...colorSection]
    const colorSorted = colours.map((data: any) => {
      data.values = sortData(data?.values)
      return data
    })
    setColorSection(colorSorted)
          })
          } else {
            setSnackBarErrorText('Please select game')
          }
          
        } else {
          setSnackBarErrorText('Plesae enter some value')
          }
          
        }
       
  }
  const handleEdit = (e: any, index: number, key: string, idx: number,data:any) => {
    let list = [...colorSection];
    const keyValue =data.key;
    console.log(keyValue)
    list[index]['values'][idx]['key'] = '';
     setTimeout(() => {
       const element = document.getElementById(`input${index}${idx}`) as HTMLInputElement;
     console.log('element',element)
     if (element) {
       element.value = keyValue
     }
     },100)
     
     
     setColorSection(list);
     setSnackBarInfoText('Press Enter to save value')
  }
      
      const handleColorChangeEvent = (e: any , index: number) => {
        if (e.key === "Enter") {
          e.preventDefault();
         
          colorSection.forEach(( data: any,idx: number) => {
            if (idx === index) {
              let list = [...colorSection];
              list[idx]['key'] = e.target.value;
              setColorSection(list);
            }
            
          })
        }
      } 
  const addColorSectionArt = (value: string) => {
    let data = {
      key: "",
      notes: "",
      required: false,
      embedAtBuildTime: false,
      platform:'',
      values: []
    }
    setColorSection([...colorSection, {...data}]);
      
      }
  const addColorsSubSection = (value: any, index: number) => {
    let data = {
      key: "",
      notes: "",
      size: 0,
      required: false,
      embedAtBuildTime: false,
      platform:'',
      values: []
    }
        let key = value[0];
     
        let list = [...colorSection];
        list[index][`values`].push({...data})
        setColorSection(list);
        setSnackBarInfoText('Press Enter to save value')
      }
      const handleRemoveColorItem = (index: number, key?: string, idx?: null | number) => {
        if (!key) {
          let list = [...colorSection];
          list.splice(index, 1);
          setColorSection(list);
        } else {
       
          if (idx !== null || idx !== undefined) {
            let list = [...colorSection];
            list[index]['values'].splice(idx, 1);
            
            
    const colorSorted = list.map((data: any) => {
      data.values = sortData(data?.values)
      return data
    })
    setColorSection(colorSorted)
            
          }
        }
    }
    const handleImport = (str: string,e:React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
        setJSONInPrettyFormat(JSON.stringify(colorSection, undefined, 4));
        
         setImportFlag(str);
         if (ModalRef.current) {
           ModalRef.current.openModal()
         }
        
    }
    const handlePreview = (str: string, data: any) => {
        
          let arr: string[] = [];
      
        data.map((x: any) => { 
          x.split(' ').map((y: any) => {
            arr.push(y)
          })
        })
        switch (arr.length) {
            case 4:
              setUrl(`rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]})`)
              break;
            case 8:
              setUrl(`linear-gradient(rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]}),rgba(${arr[4]},${arr[5]},${arr[6]},${arr[7]}))`)
              break;
            case 12:
              setUrl(`linear-gradient(rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]}),
              rgba(${arr[4]} , ${arr[5]},${arr[6]},${arr[7]})
              ,rgba(${arr[8]} , ${arr[9]},${arr[10]},${arr[11]}))`)
              break;
            case 16:
              setUrl(`linear-gradient(rgba(${arr[0]},${arr[1]},${arr[2]},${arr[3]}),
              rgba(${arr[4]},${arr[5]},${arr[6]},${arr[7]})
              ,rgba(${arr[8]},${arr[9]},${arr[10]},${arr[11]})
              ,rgba(${arr[12]},${arr[13]},${arr[15]},${arr[15]}))`)
              break;
          }
          
       
        setDisplay(str);
        setPreview(true);
        
    }
    
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
    let isValid = ""
  
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
            case 'platform':
              break;
          case 'size':
            break;
          case 'values':
            break;
          default:
           setErrors(`Invalid key entered in json - ${item}`)
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
                  <Typography>Colors</Typography>
                  <div className={customThemeClasses.bntTopRight}>
                    <Button onClick={(e)=>handleImport('Color',e)}>Import</Button>
                    <Button onClick={(e)=>xportArt('Color',e)}>Export</Button>
                  </div>
                </AccordionSummary>
                {colorSection? colorSection?.map((data: any, index: number)=>(<Accordion key={index} className={customThemeClasses.innerAccordion}>
                  <AccordionSummary
                    key={index}
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-content"
                    style={{ flexDirection: 'row-reverse' }}
                    id="panel1a-header"
                  >
                    {data.key ? (<Typography>{data.key}</Typography>) : (<input placeholder="Type name" autoFocus className={customThemeClasses.inputedLabel} onKeyPress={(e: any)=> handleColorChangeEvent(e,index) }/>)}
                    <Button className={customThemeClasses.closeBtnRight} onClick={()=>handleRemoveColorItem(index)}><Close /></Button>
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
                            ><h3 onClick={(e: any) => handleEdit(e, index, data.key, idx,items)} className={customThemeClasses.typeName}>{getEmbedIcon(items)}{items.key}<Tooltip
                            title={items.notes? items.notes: 'No notes currently'}
                            placement="right-start"
                          ><HelpOutlineOutlined /></Tooltip></h3></Tooltip>) : (<input style={{ marginBottom: '10px' }} id={`input${index}{idx}`} onKeyPress={(e: any) => handleColorLayers(e, index, data.key, idx)} />)}
                      <div key={idx} className={customThemeClasses.colorMainWrp}>
                            {items.size === "1" ? (<ColorPalette palette={items.values[0]} placeValue={0} keyName={data.key} outerIndex={index} index={idx} values={handlePaletteValue} />) :
                              (<> <ColorPalette palette={items.values[0]} placeValue={0} keyName={data.key} outerIndex={index} index={idx} values={handlePaletteValue} />
                        <ColorPalette palette={items.values[1]} placeValue={1} keyName={data.key}  outerIndex={index} index={idx} values={handlePaletteValue} />
                        <ColorPalette palette={items.values[2]} placeValue={2} keyName={data.key}  outerIndex={index} index={idx} values={handlePaletteValue} />
                        <ColorPalette palette={items.values[3]} placeValue={3} keyName={data.key}  outerIndex={index} index={idx} values={handlePaletteValue} /></>)}
                        <div className={customThemeClasses.previewCloseBox}>
                          <div className={customThemeClasses.perviewBtnBx}>
                              <Button className={customThemeClasses.previewBtn}
                                onClick={() => handlePreview('Color', items.values)}>Preview</Button>
                          </div>
                            <Button className={customThemeClasses.closeBtnRight}
                              onClick={() => handleRemoveColorItem(index, Object.keys(data)[0], idx)}><Close /></Button>
                        </div>
                            </div>
                      </div>)):null}
                  
                    <div className={customThemeClasses.addChallangeList}>
                      <Button onClick={() => addColorsSubSection(Object.keys(data), index)}>
                        <AddCircleOutlineRounded /> Add
                      </Button>
                    </div>
                  </AccordionDetails>
                </Accordion>)): null}
                <div className={customThemeClasses.addSectionRow}>
                  <Button onClick={()=>addColorSectionArt('')}>
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
          onClose={()=> setPreview(false)}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={customThemeClasses.imgPreviewMdlContainer}>
            {display === 'Color' ?(<div className={customThemeClasses.colorPreWrp} style={{ background: url ? url : 'white' }}>
              <span className={customThemeClasses.closeColorMdl} onClick={()=>setPreview(false)}><Close/>
              </span>
            </div>): (<img style={{maxWidth: '80%'}} src={url}/>)}
           
            <span className={customThemeClasses.perviewImgUrl}>{url}</span>
          </Box>
      </Modal>
      <JSONModal ref={ModalRef}
         data={JSONInPrettyFormat}
          heading={"Color"}
            handleExport={null}
            error={errors? errors : null}
           xportArt={null}
           action={null}
           btnName={'Replace Config'} 
           configuredValue={handleReplaceConfig}
           handlePaste={null}
           />
      </>
  )
}

export default ColorSection