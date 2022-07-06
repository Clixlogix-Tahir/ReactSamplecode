/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Container,
  createStyles,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select, Snackbar, TextField, Theme, Typography
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';
import React, { FormEvent, useEffect, useState } from 'react';
import { XHR_STATE } from '../../../common/constants';
import {
  useAppDispatch,
  useAppSelector
} from '../../../common/hooks';
import globalStyles from '../../../theme/globalStyles';
import { teamAccessDispatchers } from '../teamAccessControlSlice';
import { TEmailInvite, TInviteTeamMemberProps } from '../teamAccessControlTypes';


const privateClasses = makeStyles((theme: Theme) =>
  createStyles({
    userModControls: {
      marginTop: 0,
      // padding: '0.5rem 5rem 13.6rem',
      //paddingBottom: theme.spacing(6),
      '& form': {
        display: 'flex',
        flexDirection: 'column',
      },
      '& .MuiButton-root': {
        margin: '1rem auto',
      },
    },
    formControl: {
      minWidth: 100,
      width: '100%',
      margin: '1rem 0',
    },
    dropDownControl: {
      minWidth: 150,
      width: '75%',
      margin: '1rem auto',
    },
    headingControl: {
      textAlign: 'center',
      paddingTop: '1.5rem',
      paddingBottom: '1rem',
    },
    inviteTeamContentDiv: {
      paddingTop: '2rem',
      margin: '0 auto 5rem',
      maxWidth: 350,
    },
  })
);

const InviteTeamMember: React.FC<any> = (props: TInviteTeamMemberProps) => {
  const { availableRoles } = props;
  const classes = globalStyles();
  const pvtClasses = privateClasses();
  const dispatch = useAppDispatch();

  const { userGoogleProfile } = useAppSelector(state => state.globalSlice);
  const { cmsEmailInvite } = useAppSelector(state => state.teamAccessControlSlice);
  const [memberName, setMemberName] = useState<string>('');
  const [memberEmail, setMemberEmail] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [snackBarSuccessText, setSnackBarSuccessText] = useState<string>('');
  const [snackBarErrorText, setSnackBarErrorText] = useState<string>('');

  const companyId = userGoogleProfile && 'companyId' in userGoogleProfile ? userGoogleProfile.companyId : 2;
  const senderEmail = userGoogleProfile ? userGoogleProfile.email : '';

  // useEffect(() => {
  //   if (cmsEmailInvite.data !== null && cmsEmailInvite.error === '' && cmsEmailInvite.loading === XHR_STATE.COMPLETE) {
  //     setSnackBarSuccessText('Email invite sent successfully.');
  //   }
  //   else if (cmsEmailInvite.error !== '' && cmsEmailInvite.loading === XHR_STATE.ASLEEP) {
  //     setSnackBarErrorText(cmsEmailInvite.error);
  //   }
  // }, [cmsEmailInvite]);

  const sendEmailInvite = (event: FormEvent) => {
    event.preventDefault();

    const emailInviteDto: TEmailInvite = {
      name: memberName,
      invitorEmail: senderEmail,
      email: memberEmail,
      roleIdentifier: selectedRole,
      companyId: companyId,
    };

    dispatch(teamAccessDispatchers.sendEmailInvited(
      emailInviteDto,
      {
        success: () => {
          setMemberName('');
          setMemberEmail('');
          setSelectedRole('');
          setSnackBarSuccessText('Email invite sent successfully.');
        },
        error: () => {
          setSnackBarErrorText(cmsEmailInvite.error);
        },
      },
    ));
  }

  return (
    <Paper className={`${classes.paperRoot} ${pvtClasses.userModControls}`}>
      <Typography className={pvtClasses.headingControl} variant="h4" component="h2">Invite team member</Typography>
      <Container maxWidth="xs">
        <form onSubmit={sendEmailInvite}>

          <div className={pvtClasses.inviteTeamContentDiv}>
            <FormControl className={pvtClasses.formControl}>
              <TextField
                label="Member name"
                name="team member name"
                value={memberName}
                onChange={e => setMemberName(e.target.value as string)}
                required
              />
            </FormControl>

            <FormControl className={pvtClasses.formControl}>
              <TextField
                type="email"
                name="invitee-team-member-email"
                label="Member email"
                value={memberEmail}
                onChange={e => setMemberEmail(e.target.value as string)}
              />
            </FormControl>

            <FormControl className={pvtClasses.formControl}>
              <InputLabel >Select a role...</InputLabel>
              <Select
                value={selectedRole}
                onChange={e => setSelectedRole(e.target.value as string)}>
                <MenuItem value="" />
                {
                  availableRoles && availableRoles.length > 0 &&
                  availableRoles.map((role, index) => (
                    <MenuItem
                      value={role.roleIdentifier as string}
                      key={index + role.roleIdentifier}
                    >
                      {role.displayName}
                    </MenuItem>
                  ))
                }
              </Select>
            </FormControl>

          </div>



          <Button type="submit"
            disabled={memberName === '' || memberEmail === '' || selectedRole === ''}
            variant="contained"
            color="primary"
          >Send Invite</Button>

        </form>
      </Container>

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

    </Paper>
  );
};

export default InviteTeamMember;


