import { createStyles, makeStyles, Theme } from "@material-ui/core";

const globalStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperRoot: {
      flexGrow: 1,
    },
    fieldError: {
      color: theme.palette.error.main,
      fontSize: '0.8rem',
      marginTop: '-1.5rem',
    },
    fieldError2: {
      color: theme.palette.error.main,
      fontSize: '0.8rem',
      margin: 0,
    },
    fullIframe: {
      position: 'absolute',
      height: 'calc(100vh - 64px)',
      width: '100%',
      top: -60,
      left: 0,
      '& iframe': {
        position: 'absolute',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        border: 0,
      }
    },
    loggedOutFullIframe: {
      height: 'calc(100vh - 66px)',
      top: 0,
    },
    columnHeaders: {
      '& tr > td:first-child': {
        fontWeight: 'bold',
        width: 200,
        [theme.breakpoints.up('sm')]: {
          width: 250,
        }
      },
    },
    rowHeaders: {
      '& tr:first-child > td': {
        fontWeight: 'bold',
        width: 200,
        [theme.breakpoints.up('sm')]: {
          width: 250,
        }
      },
    },
    loaderRoot: {
      flexGrow: 1,
      display: 'flex',
      justifyContent: 'space-between',
    },
    loader: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '40vh',
    },
    customScrollbar: {
      '&::-webkit-scrollbar': {
        width: '0.5em',
        height: '0.5em',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        // boxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: '#666',
        borderRadius: '0.25em',
        // outline: '1px solid slategrey',
      },
    },
    spaceBetween: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    indent: {
      padding: 8,
      marginBottom: 8,
      backgroundColor: 'rgb(25 118 210 / 7%)',
      borderRadius: 4,
    },
    activeLinks:{
      backgroundColor: '#686a94',
      padding: '6px 23px',
      borderRadius: '20px',
      fontSize: '20px',
    },
    tip :{
      position: 'absolute',
      '& span': {
        display: 'block',
        position: 'absolute',
        top: '20px',
        left: '365px',
        width: '280px',
        height: 'auto',
        padding: '5px',
        zIndex: 100,
        background: '#fff',
        color: 'black',
        '& -moz-border-radius': '5px',
        /* this works only in camino/firefox */
        '& -webkit-border-radius': '5px',
        '&::before': {
          content: '""',
          display: 'block',
          width: 0,
          height: 0,
          position: 'absolute',
          borderTop: '8px solid transparent',
          borderBottom: '8px solid transparent',
          borderRight: '8px solid #fff',
          left: '-8px',
          top: '7px',
        }
      },
      [theme.breakpoints.down('sm')]:{
        '& span': {
          display: 'block',
          position: 'absolute',
          top: '50px',
          left: '30px',
          width: '280px',
          height: 'auto',
          padding: '5px',
          zIndex: 100,
          background: '#fff',
          color: 'black',
          '& -moz-border-radius': '5px',
          /* this works only in camino/firefox */
          '& -webkit-border-radius': '5px',
        }
      },
    },
    buttonHeader:{
      display:'flex',
      justifyContent:'space-between'
    },
    iconModals:{
      display:'flex',
      justifyContent:'flex-end',
      position:'relative'
    },
    pasteAndDownload:{
      height:'20px',
      width:'20px',
      cursor:'pointer',
      right: '0px',
      marginRight:'5px',
      marginTop:'5px'
    },
    iconDiv:{
    justifyContent: "space-between",
    display: "flex",
    position: "absolute"
    },
    bottomText:{
      display:'flex',
      alignItems:'center',
      justifyContent:'center'
    },
    errorText:{
      color:'red'
    }
  }),
);

export default globalStyles;
