import { createStyles, makeStyles, Theme } from "@material-ui/core";

const detailsStyles = makeStyles((theme: Theme) =>
  createStyles({
    detail:{
        padding: '10px',
    },
    header:{
        padding: '20px',
        fontSize: '30px',
    },
    headControl:{
        margin: '30px',
        fontSize: '20px',
        fontWeight: 800,
    },
    labelControl:{
        margin: '20px 30px',
        fontSize: '20px',
    },
    gameDiv:{
        margin: '30px',
        display: 'flex',
        padding: '5px',
        alignItems: 'center',
        border: '1px solid grey',
        borderRadius: '10px',
        width: 'fit-content',
    },
    pics:{
        height: '30px',
        width: '30px',
    },
    contrl: {
        margin: '10px',
    },
    status:{
        padding: '10px',
        backgroundColor : '#d9f3dc',
        color : '#097718',
        borderRadius: '10px',
        fontWeight: 500,
      },
    statusControl: {
        margin: '10px',
        padding: '10px',
        backgroundColor : '#d9f3dc',
        color : '#097718',
        borderRadius: '5px',
        fontWeight: 500,
        fontSize:'14px',
    }
  })
);

export default detailsStyles;