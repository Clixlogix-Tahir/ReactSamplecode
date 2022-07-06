/* eslint-disable react-hooks/exhaustive-deps */
import {
  createStyles,
  Paper, Theme, Typography
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';
import { useAppSelector } from '../../../common/hooks';
import globalStyles from '../../../theme/globalStyles';
import { clixlogix-samplecodeCompanyName } from '../constants';
import { TAccessRoleAndDescriptionProps } from '../teamAccessControlTypes';
import { jrxRolesAndDescription, rolesAndDescription } from './roles-description-constants';


const privateClasses = makeStyles((theme: Theme) =>
  createStyles({
    userModControls: {
      marginTop: 0,
      padding: '0.5rem 2rem 2rem',
      //paddingBottom: theme.spacing(6),
      '& form': {
        display: 'flex',
        flexDirection: 'column',
      },
      '& .MuiButton-root': {
        margin: '1rem auto',
      },
    },
    // formControl: {
    //   minWidth: 150,
    //   width: '100%',
    //   margin: '1rem auto',
    // },
    heading: {
      textAlign: 'center',
      paddingTop: '1rem',
      paddingBottom: '2rem',
    },
    roleTitles: {
      //color: '#5B0B17',
      fontWeight: 'bold',
      paddingBottom: '0rem',
    }
  })
);


const AccessRoleAndDescription: React.FC<any> = (props: TAccessRoleAndDescriptionProps) => {
  const { availableRoles } = props;
  const classes = globalStyles();
  const pvtClasses = privateClasses();
  const { userGoogleProfile } = useAppSelector(state => state.globalSlice);
  //const userEmail = userGoogleProfile ? userGoogleProfile.email : '';
  const companyName = (userGoogleProfile && 'companyName' in userGoogleProfile) ? userGoogleProfile.companyName : '';

  return (
    <Paper className={`${classes.paperRoot} ${pvtClasses.userModControls}`}>
      <Typography className={pvtClasses.heading} variant="h4" component="h2">Access role description</Typography>
      <div>
        {
          companyName &&
            companyName.localeCompare(clixlogix-samplecodeCompanyName) === 0
            ?
            (
              jrxRolesAndDescription.map((entry, index) =>
                <React.Fragment key={`${index}-rolesAndDescription`}>
                  <span className={pvtClasses.roleTitles}>{entry[0]}</span>
                  <p><small>{entry[1]}</small></p>
                </React.Fragment>
              )
            )
            :
            (
              rolesAndDescription.map((entry, index) =>
                <React.Fragment key={`${index}-rolesAndDescription`}>
                  <span className={pvtClasses.roleTitles}>{companyName} {entry[0]}</span>
                  <p><small>{entry[1]}</small></p>
                </React.Fragment>
              )
            )
        }
      </div>
    </Paper>
  );
}

export default AccessRoleAndDescription;
