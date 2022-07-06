/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box, Grid
} from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import {
  useAppDispatch, useAppSelector
} from '../../common/hooks';
import AccessRoleAndDescription from './access-role-description/index';
import CurrentTeamMembers from './current-team-members/index';
import InviteTeamMember from './invite-team-member/index';
import { TCmsRole } from './teamAccessControlTypes';
import { teamAccessDispatchers } from './teamAccessControlSlice';


const TeamAccessControlManagement: React.FC<any> = () => {
  const dispatch = useAppDispatch();
  const { cmsRoles } = useAppSelector(state => state.teamAccessControlSlice);
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const [availableRoles, setAvailableRoles] = useState<TCmsRole[]>(cmsRoles.roles);

  useEffect(() => {
    dispatch(teamAccessDispatchers.getCmsRoles());
  }, [selectedApp]);

  useEffect(() => {
    setAvailableRoles(cmsRoles.roles);
  }, [cmsRoles]);

  return (
    <div>
      <Box>
        <Grid container spacing={2}> {/* rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}> */}
          <Grid item xs={6}>
            <AccessRoleAndDescription
              availableRoles={availableRoles} />
          </Grid>

          <Grid item xs={6}>
            <InviteTeamMember
              availableRoles={availableRoles} />
          </Grid>

          <Grid item xs={12}>
            <CurrentTeamMembers
              availableRoles={availableRoles} />
          </Grid>
        </Grid>
      </Box>
    </div>

  );
}

export default TeamAccessControlManagement;

