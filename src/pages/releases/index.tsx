import {
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Switch,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography as MuiTypography
} from '@material-ui/core';
import {
  spacing
} from '@material-ui/system';
import React, {
  Fragment
} from 'react';
import {
  useHistory,
  useParams
} from 'react-router';
import { ROUTES } from '../../common/constants';
import globalStyles from '../../theme/globalStyles';
import { EPlatforms } from '../../types/gameConfigTypes';
import {
  TRelease
} from './releaseTypes';
import styled from 'styled-components';
import {
  MoreHorizontal
} from 'react-feather';
import ReleaseDialogs from './release-dialogs';
import ReleaseSnackbars from './release-snackbars';
import Helmet from 'react-helmet';

const Typography = styled(MuiTypography)`
  ${spacing}
`;

/** @deprecated
 * not used currently; very low chances of need in future
 */
function Releases(props: any) {
  const classes = globalStyles();
  const history = useHistory();
  const routeParams: any = useParams();
  const releases: TRelease = {}; // todo
  const [anchorEl, setAnchorEl] = React.useState<{el: HTMLButtonElement | null}[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleTabChange = (event: React.ChangeEvent<{}>, newValue: string) => {
    history.push(ROUTES.RELEASES_VIEW.replace(':platform', newValue));
  };

  const handleClick = (index: number) => (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    const newAnchors = [...anchorEl];
    newAnchors.splice(index, 1);
    newAnchors.splice(index, 0, { el: event.currentTarget});
    setAnchorEl(newAnchors);
    // setOpen((prev) => !prev);
    setOpen(!open);
  };

  const handleClose = (index: number) => {
    const newAnchors = [...anchorEl];
    newAnchors.splice(index, 1);
    newAnchors.splice(index, 0, { el: null});
    setAnchorEl(newAnchors);
  };

  const editEvent = () => {
    // todo
  };

  const cloneEvent = () => {
    // todo
  };

  const deleteEvent = () => {
    // todo
  };

  const deleteEventProceed = () => {
    // todo
  };

  return (
    <Fragment>
      <Helmet title="Release Management" />
      <Typography variant="h1" mb={4}>Release Management</Typography>
      <Paper className={classes.paperRoot}>
        <Tabs
          value={routeParams.platform as EPlatforms}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          centered
        >
          {Object.keys(EPlatforms).map(platform =>
            <Tab value={platform} key={platform} label={platform} />
          )}
        </Tabs>
      </Paper>

      <Paper className={classes.paperRoot}
        style={{ marginTop: 24 }}
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Version</TableCell>
                <TableCell>Release date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Soft update</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>todo</TableCell>
                <TableCell>todo</TableCell>
                <TableCell>todo</TableCell>
                <TableCell>
                  <Switch
                    // checked={!event.forceInvisible}
                    // disabled={event._isUpdating} todo
                    onChange={e => {
                    }}
                    name="soft update"
                    color="primary"
                  />
                </TableCell>
                <TableCell>
                  <IconButton
                    onClick={handleClick(0)}
                  >
                    <MoreHorizontal />
                  </IconButton>
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl[0] ? anchorEl[0].el : null}
                    keepMounted
                    open={Boolean(anchorEl[0] ? anchorEl[0].el : false)}
                    onClose={e => handleClose(0)}
                    PaperProps={{ style: { boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 20px' }}}
                  >
                    <MenuItem
                      onClick={editEvent}
                    >
                      Edit
                    </MenuItem>
                    <MenuItem
                      onClick={cloneEvent}
                    >
                      Clone
                    </MenuItem>
                    <MenuItem
                      onClick={deleteEvent}
                    >
                      Delete
                    </MenuItem>
                  </Menu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <ReleaseDialogs />
      <ReleaseSnackbars />
    </Fragment>
  );
}

export default Releases;
