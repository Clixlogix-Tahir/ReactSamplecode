/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button, Card as MuiCard, createStyles, Dialog,
  DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper as MuiPaper, Select, Table,
  TableBody,
  TableCell, TableContainer, TableHead,
  TableRow, TextField, Theme, Typography
} from '@material-ui/core';
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from '@material-ui/styles';
import { spacing } from "@material-ui/system";
import React, { useEffect, useState } from 'react';
import {
  MoreVertical
} from 'react-feather';
import styled from 'styled-components';
import {
  useAppDispatch, useAppSelector
} from '../../../common/hooks';
import { teamAccessDispatchers } from '../teamAccessControlSlice';
import { TCmsRole, TCmsUser, TCurrentTeamMembersProps, TEditedCmsUser } from '../teamAccessControlTypes';
import * as CONSTANTS from '../constants';

const privateClasses = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      minWidth: 150,
      width: '100%',
      margin: '1rem auto',
    },
    textSearchControl: {
      padding: '0rem 0rem 1.5rem',
    },
    dialog: { 
      '& .MuiPaper-root':{
        minWidth: 500,
      },
    },
  })
);


const Paper = styled(MuiPaper)(spacing);

const CurrentTeamMembers: React.FC<any> = (props: TCurrentTeamMembersProps) => {
  const { availableRoles } = props;
  const pvtClasses = privateClasses();
  const dispatch = useAppDispatch();
  const { userGoogleProfile } = useAppSelector(state => state.globalSlice);
  const { cmsUsers } = useAppSelector(state => state.teamAccessControlSlice);
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const [localCmsUsers, setLocalCmsUsers] = useState<TCmsUser[]>([]);
  const [emailSearchInput, setEmailSearchInput] = useState<string>('');


  //const [showEditRolePopup, setShowEditRolePopup] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsPerPage, setRecordsPerPage] = useState<number>(10);
  const [maxPaginationPages, setMaxPaginationPages] = useState<number>(1);
  const [newRoleToBeAssigned, setNewRoleToBeAssigned] = useState<string>();
  const [userForRoleChange, setUserForRoleChange] = useState<TCmsUser | null>(null);

  const companyId = userGoogleProfile && 'companyId' in userGoogleProfile ? userGoogleProfile.companyId : 2;
  const loggedInUserId = userGoogleProfile && 'id' in userGoogleProfile ? userGoogleProfile.id : 2;
  const loggedInUserRoles : TCmsRole[] | null = userGoogleProfile && 'userRoles' in userGoogleProfile ? userGoogleProfile.userRoles : null;
  
  useEffect(() => {
    dispatch(teamAccessDispatchers.getCmsUsers(companyId, 0, 100000000)).then(() => {
      dispatch(teamAccessDispatchers.getCmsUsers(companyId, 0, recordsPerPage));
    });
  }, [selectedApp]);

  useEffect(() => {
    if (cmsUsers.users.length > recordsPerPage && cmsUsers.users.length > 0) {
      setMaxPaginationPages(Math.ceil(cmsUsers.users.length / recordsPerPage));
    } else {
      setLocalCmsUsers(cmsUsers.users);
    }
  }, [cmsUsers]);

  const handlePaginationChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    dispatch(teamAccessDispatchers.getCmsUsers(companyId, page - 1, recordsPerPage));
    setEmailSearchInput('');
  };

  const handleSearch = (event: React.ChangeEvent<{ value: unknown }>) => {
    let users: TCmsUser[] = [];
    const emailId = event.target.value as string;
    setEmailSearchInput(emailId);
    const length = emailId.length as number;
    cmsUsers.users.map(user => {
      if (user.email.substring(0, length) === emailId) {
        users.push(user);
      }
    });
    setLocalCmsUsers(users);
  };

  const handleRoleEdit = (user: TCmsUser) => (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setNewRoleToBeAssigned(user.userRoles[0].roleIdentifier);
    setUserForRoleChange(user);
  };

  const handleRoleEditSave = () => {
    if (userForRoleChange && availableRoles && availableRoles.length > 0) {
      const cmsUser: TEditedCmsUser = {
        name: userForRoleChange.name,
        roleIds: [availableRoles.filter(role => role.roleIdentifier === newRoleToBeAssigned)[0].id],
      };

      dispatch(teamAccessDispatchers.updateCmsUser(cmsUser, companyId, userForRoleChange.id)).then(() => {
        setUserForRoleChange(null);
        setNewRoleToBeAssigned('');
        dispatch(teamAccessDispatchers.getCmsUsers(companyId, currentPage - 1, recordsPerPage));
        dispatch(teamAccessDispatchers.getCmsRoles());
      });
    }

  };

  const handleClose = () => {
    setUserForRoleChange(null);
  };

  const canEditRoles = (user: TCmsUser) : boolean => {
    if( user.id === loggedInUserId ){
      return false;
    }
    if(loggedInUserRoles && loggedInUserRoles[0].roleIdentifier.endsWith(CONSTANTS.MANAGER_ROLE_SUBSTRING) && user.userRoles[0].roleIdentifier.endsWith(CONSTANTS.ADMIN_ROLE_SUBSTRING) ){
      return false;
    }
    return true;
  }

  return (
    <Paper mt={12} style={{ marginTop: 5, paddingTop: 2, paddingLeft: 20, paddingRight: 20, paddingBottom: 20 }}>
      <Typography style={{ padding: '1rem 0' }} variant="h4" component="h2">Current team members</Typography>

      <TextField
        className={pvtClasses.textSearchControl}
        placeholder="Search member by email"
        type="search"
        variant="outlined"
        fullWidth
        size="small"
        value={emailSearchInput}
        onChange={handleSearch}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {/* <input type="search" id="myInput" onChange={handleSearch} placeholder="Search members by email" title="Type in a name" /> */}
      <TableContainer>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email Id</TableCell>
              <TableCell>Roles</TableCell>
              {
                loggedInUserRoles && 
                (loggedInUserRoles[0].roleIdentifier.endsWith(CONSTANTS.MANAGER_ROLE_SUBSTRING) || loggedInUserRoles[0].roleIdentifier.endsWith(CONSTANTS.ADMIN_ROLE_SUBSTRING)) && 
                <TableCell>Edit Role</TableCell>
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {
              localCmsUsers &&
              localCmsUsers.map((user, index) =>
              (
                <TableRow hover key={`${index}-${user.id}`}>
                  <TableCell key={user.id + user.name}>{user.name}</TableCell>
                  <TableCell key={user.id + user.email}>{user.email}</TableCell>
                  <TableCell key={user.id}>{user.userRoles.map((role, index) => (role.displayName)).join()}</TableCell>

                  {
                    loggedInUserRoles && (loggedInUserRoles[0].roleIdentifier.endsWith(CONSTANTS.MANAGER_ROLE_SUBSTRING) || loggedInUserRoles[0].roleIdentifier.endsWith(CONSTANTS.ADMIN_ROLE_SUBSTRING))
                    &&
                    <TableCell>
                      {
                        canEditRoles(user) &&
                        <IconButton
                          onClick={handleRoleEdit(user)}
                        >
                          <MoreVertical />
                        </IconButton>
                      }
                    </TableCell>
                  }

                </TableRow>
              ))
            }
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination count={maxPaginationPages} color="primary" size="small" onChange={handlePaginationChange} style={{ padding: 20 }} />

      {
        userForRoleChange !== null &&
        <div>
          <Dialog
            className={pvtClasses.dialog}
            open={userForRoleChange !== null}
            onClose={handleClose}>
            <DialogTitle>Edit Role: {userForRoleChange.name}</DialogTitle>
            <DialogContent>
              <FormControl className={pvtClasses.formControl}>
                <InputLabel required>Access Roles</InputLabel>
                <Select
                  //disabled={true}
                  required={true}
                  value={newRoleToBeAssigned}
                  onChange={(e) => setNewRoleToBeAssigned(e.target.value as string)}
                >
                  {
                    availableRoles && availableRoles.length > 0 &&
                    availableRoles.map((role, index) => (
                      <MenuItem value={role.roleIdentifier} key={index + role.roleIdentifier}>{role.displayName}</MenuItem>
                    ))
                  }
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleRoleEditSave}>Save</Button>
            </DialogActions>
          </Dialog>
        </div>
      }

    </Paper>
  );
}

export default CurrentTeamMembers;
