import { createStyles, makeStyles, Theme } from "@material-ui/core";
import { NoEncryption } from "@material-ui/icons";

const headerStyles = makeStyles((theme: Theme) =>
  createStyles({
    headerBg: {
      //   background: "#1b2a92",
      backgroundImage:
        "linear-gradient(to bottom, #1b2a92, #1b2a92), linear-gradient(94deg, #293ec1 -2%, #1b2a92 37%, #050c49 99%)",
    },
    headerNudge: {
      position: "absolute",
      backgroundColor: "white",
      padding: "10px",
      display: "block",
      textAlign: "center",
      top: "50px",
      width: "250px",
      borderRadius: "10px",
      boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.5)",
      color: "black",
      zIndex: 20,
      marginRight: "200px",
    },
    nudgeBtn: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      "& span": {
        fontWeight: 600,
        color: "cornflowerblue",
        marginRight: "10px",
        cursor: "pointer",
      },
    },

    addOrgBtn: {
      backgroundColor: "rgb(72, 144, 232)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      "& span": {
        color: "#fff",
        "&:hover": {
          color: "rgb(72, 144, 232)",
        },
      },
      "&:hover": {
        backgroundColor: "white",
        display: "flex",
        border: "1px solid rgb(72, 144, 232)",
        justifyContent: "center",
        alignItems: "center",
      },
    },
    menuItem: {
      padding: "10px 20px",
      textDecoration: "none",
      display: "block",
      "&:hover": {
        backgroundColor: "#bed7fc",
        color: "white",
      },
      fontStyle: "none",
      color: "black",
    },
    menu: {
      display: "block",
      padding: "10px",
    },
    activeClass: {
      background: "#bed7fc",
      color: "white",
    },
    menuElements: {
      fontStyle: "none",
      margin: "0px 20px",
      textDecoration: "none",
      color: "black",
    },
    dialog: {
      float: "right",
    },
    navProfile: {
      display: "flex",
      justifyContent: "end",
      alignItems: "center",
      width: "100%",
    },
    profileDiv: {
      display: "flex",
      alignItems: "center",
    },
    profile: {
      color: "white",
      fontSize: "15px",
      lineHeight: "1.2",
      margin: "10px",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
    },
  })
);

export default headerStyles;
