import { createStyles, makeStyles, Theme } from "@material-ui/core";

const addGamesStyles = makeStyles((theme: Theme) =>
  createStyles({
    addGame: {
      height: "100%",
    },

    breadcrumDiv: {
      padding: "10px 0",
      boxShadow: "0 0 5px 0 rgba(0, 0, 0, 0.5);",
    },
    breadcrum: {
      fontSize: "20px",
      fontWeight: 700,
      color: "black",
      display: "flex",
      alignItems: "center",
    },
    circle: {
      height: "20px",
      width: "20px",
      margin: "10px",
      borderRadius: "20px",
      backgroundColor: "rgb(199, 199, 199)",
    },
    imgCheck: {
      margin: "10px",
      height: "20px",
      width: "20px",
    },
    formDiv: {
      padding: "20px",
      display: "block",
      [theme.breakpoints.down("sm")]: {
        padding: "20px",
      },
    },
    formCss: {
      display: "block",
    },
    toggleDiv: {
      margin: "0px 20px 10px 12px",
      /*'& .MuiToggleButtonGroup-groupedHorizontal': {
        '&:not(:first-child)': {
          borderLeft: 0,
          marginLeft: 0,
          borderTopLeftRadius: 0,
          borderBottomLeftRadius: 0,
          },
        '&:not(:last-child)': {
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
        
    },*/
    },
    toggle: {
      marginRight: "20px",
      minHeight: "33px",
      color: "black",
      padding: "0px 10px",
      borderRadius: "4px !important",
      border: "1px solid #d4d4d4 !important",
      lineHeight: "33px",
      fontSize: "16px",
      "&:hover": {
        backgroundColor: "#bed7fc",
        borderColor: "#4890e8 !important",
        color: "white",
      },
      "& .MuiToggleButton-root": {
        "&:hover": {
          textDecoration: "none",
          color: "white",
          backgroundColor: "#4890e8 !important",
          borderColor: "#4890e8 !important",
        },
      },
      "&.MuiToggleButton-root.Mui-selected": {
        color: "white",
        // backgroundColor: "cornflowerblue",
        backgroundColor: "#4890e8",
        borderColor: "#4890e8 !important",
      },
    },

    labelControl: {
      display: "block",
      margin: "30px 15px 10px 15px",
      fontSize: "18px",
      fontWeight: 700,
      "&  span": {
        color: "red",
        [theme.breakpoints.down("sm")]: {
          color: "red",
        },
      },
      [theme.breakpoints.down("sm")]: {
        display: "block",
        margin: "10px",
        fontSize: "18px",
        fontWeight: 500,
      },
    },
    mandatoryLabelControl: {
      display: "block",
      margin: "30px 15px 10px 3px",
      fontSize: "18px",
      fontWeight: 700,
      "&  span": {
        color: "red",
        [theme.breakpoints.down("sm")]: {
          color: "red",
        },
      },
      [theme.breakpoints.down("sm")]: {
        display: "block",
        margin: "10px",
        fontSize: "18px",
        fontWeight: 500,
      },
    },
    fieldError: {
      color: theme.palette.error.main,
      fontSize: '0.8rem',
      margin: '10px 15px 10px 15px',
    },
    toolTip: {
      '& div': {
        '& .MuiTooltip-tooltip' : {
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid black',
          fontSize: '12px',
          
      },
      },
      
      
    },
    listStyle: {
      padding: '0px 20px',
      listStyle: 'none',
      fontSize: '15px',
      '& li': {
        margin: '5px'
      }
    },
    mandatory: {
      color: 'red',
    },
    inputControl: {
      margin: "0px 20px 10px 12px",
      height: "33px",
      width: "350px",
      padding: "5px 10px",
      borderRadius: "4px",
      border: "solid 1px #d4d4d4",

      [theme.breakpoints.down("sm")]: {
        margin: "10px 20px",
        height: "30px",
        width: "200px",
      },
    },
    selectControl: {
      margin: "0px 20px 10px 15px",
      height: "33px",
      width: "350px",
      [theme.breakpoints.down("sm")]: {
        margin: "0px 20px 10px 20px",
        height: "30px",
        width: "200px",
      },
    },
    
    textareaControl: {
      margin: "0px 20px 10px 12px",
      minHeight: "50px",
      padding: "5px 10px",
      resize: "vertical",
      width: "350px",
      borderRadius: "4px",
      border: "solid 1px #d4d4d4",
      [theme.breakpoints.down("sm")]: {
        margin: "10px 20px 2px 20px",
        height: "30px",
        width: "200px",
      },
    },
    btnDiv: {
      display: "flex",
      marginRight: "300px",
      margin: "10px",
    },
    nxtBtn: {
      marginTop: "2rem",
      marginBottom: "40px",
      marginLeft: "auto",
      marginRight: "auto",
      [theme.breakpoints.down("sm")]: {
        marginTop: "2rem",
        marginBottom: "40px",
      },
    },
    nxtBtnOrg: {
      marginTop: "2rem",
      marginBottom: "40px",
      marginLeft: "300px",
    },
    backBtn: {
      marginTop: "2rem",
      marginBottom: "40px",
      backgroundColor: "white",
      marginRight: "10px",
      color: "cornflowerblue",
      display: "flex",
      justifyContent: "start",
      border: "1px solid cornflowerblue",
      "&:hover": {
        color: "white",
      },
    },

    divSeperator: {
      border: "1px solid #e7dcdc",
      margin: "10px",
    },
    addGameLayout: {
      [theme.breakpoints.down("md")]: {
        display: "block",
      },
    },

    "& .MuiGrid-grid-xs-6": {
      [theme.breakpoints.down("sm")]: {
        flexGrow: 0,
        maxWidth: "90%",
        flexBasis: "50%",
      },
    },
    developerDiv: {
      paddingRight: "50px !important",
      "&  h4": {
        fontSize: "18px",
        fontWeight: "bold",
      },
      "& p": {
        fontSize: "18px",
        lineHeight: "1",
        color: "#5e5e5e",
      },

      [theme.breakpoints.down("sm")]: {
        margin: "10px",
        width: "100%",
        wordWrap: "normal",
        wordSpacing: "normal",
      },
    },
    break: {
      display: "none",
    },
  })
);

export default addGamesStyles;
