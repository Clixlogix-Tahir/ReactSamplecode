import React, { forwardRef, useState, useImperativeHandle, useEffect } from 'react';
import { Modal, Button, Box ,Tooltip} from '@material-ui/core';
import customThemeStyles from '../theme/customeThemeStyles';
import { Close } from '@material-ui/icons';
import {Clipboard,Copy,Download} from 'react-feather'
import globalStyles from '../theme/globalStyles';
import copy from 'copy-to-clipboard'
import { CONSTANTS } from '../common/constants';

const JSONModal = forwardRef((props: any,ref: any) => {
    const classes = globalStyles();
    const customThemeClasses = customThemeStyles()
    const [open, setOpen] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const handleClose = () =>{
        setShowError(false);
        setErrorMsg('');
        if (!props.data) {
            setJSONInPrettyFormat(null);
        }
        setOpen(false)};
    const handleOpen = () => { console.log('hit modal', open); setOpen(true); };
    const [JSONInPrettyFormat, setJSONInPrettyFormat] = useState<any | null>(props.data)
    
    useImperativeHandle(
        ref,
        () => {
          return {
            openModal: () => handleOpen(),
            closeModal: () => handleClose(),
          }
        },
    )
    useEffect(() => {
        if (props.data) {
            setJSONInPrettyFormat(props.data)
        }else{
            setJSONInPrettyFormat(null)
        }
       
        if (props.error !== null || props.error !== undefined) {
            setShowError(true)
            setErrorMsg(props.error)
        } else {
            handleClose()
        }
        
    },[props])
    const handleReplaceConfig = () => {
       
            try {
                props.configuredValue(JSON.parse(JSONInPrettyFormat));
                
            } catch (error) {
               
                setShowError(true)
                setErrorMsg('Invalid Json')
                }
    }


    const handlePaste = async () => {
        navigator.clipboard.readText().then((data) => {
          
        })
        //setJSONInPrettyFormat(text);
    }
    const copyToClipBoard=()=>{
        localStorage.setItem(CONSTANTS.LOCAL_STORAGE.CLIPBOARD_DATA,JSONInPrettyFormat)
        copy(JSONInPrettyFormat, {
            debug: true,
            message: 'Press #{key} to copy',
          });
    }
    
  return (
      <div>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={customThemeClasses.mdlArt}>
            <span className={customThemeClasses.closeTextMdl} onClick={()=>handleClose()}><Close /></span>
                        <h2>{ props.heading}</h2>
        <div className={classes.iconModals}>
         
        {!props?.action &&
        <div className={classes.iconDiv}> 
        
        <Clipboard onClick={()=>handlePaste()}  className={classes.pasteAndDownload}/>
        </div>} 
        {props?.action &&
        <div className={classes.iconDiv}> 
        <Download onClick={()=>props.xportArt()}  className={classes.pasteAndDownload}/>
        <Tooltip
         title="Click to copy json"
        placement="top">
                <Copy className={classes.pasteAndDownload} onClick={()=>copyToClipBoard()}/>
                </Tooltip>
                </div>}  
                </div>
            <div className={customThemeClasses.configTextArea}>
                <textarea placeholder='Paste your JSON here....' onPaste={()=>copyToClipBoard()}  value={JSONInPrettyFormat} onChange={(e:any)=>setJSONInPrettyFormat(e.target.value as string)}></textarea>
            </div>
           {props.btnName && !props.action &&
           <div style={{justifyContent:!showError? 'flex-end':"space-between"}} className={classes.bottomText}>
                          {showError && <div className={classes.errorText}>{ errorMsg}</div>}
           <div  className={customThemeClasses.btnConfigDiv}>
           <Button onClick={() => handleReplaceConfig()}>{ props.btnName}</Button>
           </div>
            </div>
           } 
            </Box>
          </Modal>
      </div>
  )
})

export default JSONModal