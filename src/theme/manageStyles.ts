import { createStyles, makeStyles, Theme } from "@material-ui/core";

const manageStyles = makeStyles((theme: Theme) =>
  createStyles({
    pendingRequest: {
      height: "100%",
    },
    header: {
      display: "flex",
      alignItems: "center",
    },
    spans: {
      margin: "10px 20px",
      color: "grey",
        fontSize: "16px",
      fontWeight: 500,
      [theme.breakpoints.down("sm")]: {
        margin: "10px",
      },
    },
    requestSpan: {
      display: "flex",
      justifyContent: "end",
    },
    spansRequset: {
      margin: "10px 0px",
      color: "grey",
      fontSize: "20px",
      display: "flex",
      justifyContent: "start",
    },
    accSet: {
      width: "100%",
      margin: "10px 50px",
      borderRadius: "20px",
      [theme.breakpoints.down("sm")]: {
        margin: "10px",
      },
      //border: '3px solid #e2e2e2',
      boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.3)",
      "& .MuiAccordionSummary-content": {
        margin: "12px 0",
        display: "flex",
        alignItems: "center",
        flexGrow: 1,
        transition: "margin 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
      },
      "&.MuiAccordion-root.Mui-expanded": {
        margin: "10px 50px",
        [theme.breakpoints.down("sm")]: {
          margin: "10px",
        },
      },
      '& .MuiAccordionSummary-expandIcon.Mui-expanded': {
        transform: 'rotate(90deg)',
      },
      
    },
    accSetHeader: {
      width: "100%",
      margin: "10px 50px",
      borderRadius: "10px",
      
      background: "transparent",
      [theme.breakpoints.down("sm")]: {
        margin: "10px 15px",
      },
    },
    accSummary: {
      boxShadow: "0 0 3px 0 rgba(0, 0, 0, 0.3)",
    },
    stepperClass: {
      margin: "20px 0",
      "& .MuiStepConnector-line": {
        display: "block",
        borderColor: "#bad5e7",
      },
      "& .MuiStepConnector-lineHorizontal": {
        borderTopStyle: "dashed",
        borderTopWidth: "3px",
      },
      "& .MuiStepLabel-label.Mui-error": {
        color: "black",
      },
      "& .MuiStepLabel-label.MuiStepLabel-alternativeLabel": {
        marginTop: "-70px",
        textAlign: "center",
        marginBottom: "55px",
      },
      "& .MuiStepLabel-labelContainer": {
        width: "100%",
        textAlign: "center",
      },
      "& .MuiStepConnector-alternativeLabel": {
        top: "15px",
        left: "calc(-50% + 20px)",
        right: "calc(50% + 20px)",
        position: "absolute",
      },
      "& .MuiStepper-root": {
        [theme.breakpoints.down("sm")]: {
          padding: "24px 10px",
        },
      },
    },
    statusDiv: {
      padding: "8px 35px 8px 36px",
      backgroundColor: "#d9f3dc",
      whiteSpace: 'nowrap',
      color: "#097718",
      display: "flex",
      borderRadius: "7px",
      alignItems: "center",
      justifyContent: "center",
      width: "150px",
      margin: "0 65px 0 67px",
      fontFamily: "GreycliffCF-Bold",
      fontSize: "14px",
      fontWeight: "bold",
      fontStretch: "normal",
      fontStyle: "normal",
      lineHeight: 1,
      textAlign: "center",
      letterSpacing: "normal",
    },

    infoDiv: {
      display: "flex",
      justifyContent: "start",
      alignItems: "start",
      marginLeft: "50px",
      [theme.breakpoints.down("sm")]: {
        marginLeft: "10px",
      },
    },
    chip: {
      whiteSpace: 'pre-wrap',
      padding: "5px 20px",
      backgroundColor: "#E9E9E9",
      margin: "10px",
      borderRadius: "5px",
      fontWeight: 500,
    },
    searchDiv: {
      display: "flex",
      alignItems: "center",
    },
    searchSpans: {
      margin: "10px 20px",
      color: "grey",
      fontSize: "20px",
      display: "flex",
      alignItems: "center",
    },
    pendinggamsRow: {
      margin: "0 35px",
      marginTop: "10px",
    },
    formControl: {
      "&.MuiFormControl-root": {
        border: 0,
        marginBottom: "20px",
        display: "inline-flex",
        padding: 0,
        position: "relative",
        minWidth: 0,
        flexDirection: "column",
        verticalAlign: "top",
      },
      "& .MuiInput-underline": {
        "&:before": {
          border: "none",
          left: 0,
          right: 0,
          bottom: 0,
          content: "\u00a0",
          position: "absolute",
          transition:
            "border-bottom-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
          borderBottom: "none",
          pointerEvents: "none",
        },
      },
    },

    datePicker: {
      position: "absolute",
      zIndex: 100,
      top: "50px",
    },
    paginationDiv: {
      display: "flex",
      justifyContent: "center",
      margin: "10px",
      alignItems: "center",
      position: 'fixed',
      left: '80px',  
      bottom: '5px',  
      right: '10px',   
      width: '100%',  
      backgroundColor: 'transparent',  
      color: 'black', 
      zIndex: 6000,
      [theme.breakpoints.down("sm")]: {
        left: "0px",
      },
    },
    limitDiv: {
      display: "flex",
      alignItems: "center",
      color: 'black',
    },
    limitLabel: {
      marginRight: "10px",
      fontSize: "larger",
    },
    limitControl: {
      padding: "10px",
      borderRadius: "5px",
      fontSize: "15px",
      width: "70px",
    },
  })
);

export default manageStyles;
