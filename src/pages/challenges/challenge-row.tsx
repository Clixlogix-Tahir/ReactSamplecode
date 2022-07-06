/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  TableCell,
  TableRow,
} from '@material-ui/core';
import React from 'react';
import { MoreHorizontal } from 'react-feather';
import { Link } from 'react-router-dom';
import { EVENT_URL_PARAMS } from '../../common/common-types';
import {
  ROUTES,
  URL_PART_APP_ID,
  URL_PART_CHALLENGE_ID,
  URL_SEARCH_KEY_CLONE_ID,
  XHR_STATE
} from '../../common/constants';
import {
  useAppDispatch,
  useAppSelector
} from '../../common/hooks';
import { ChallengesDispatchers } from './challenges-slice';
import { TChallenge } from './challenges-types';

type TChallengeRowProps = {
  challenge: TChallenge
};

function ChallengeRow({ challenge } : TChallengeRowProps) {
  const dispatch = useAppDispatch();
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const {
    challenges,
    deletingChallenge
  } = useAppSelector(state => state.challengesSlice);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = React.useState(false);

  const start = React.useMemo(() => new Date(challenge.startAt * 1000).toLocaleString(), [challenge]);
  const nextStartAt = React.useMemo(() => new Date(challenge.nextStartAt * 1000).toLocaleString(), [challenge]);

  function handleMenuToggleClick(event: React.MouseEvent<HTMLButtonElement>) {
    setAnchorEl(event?.currentTarget);
  }

  function handleClose(): void {
    setAnchorEl(null);
  }

  function deleteClick(challenge: TChallenge): void {
    setIsDeleteModalVisible(true);
  }

  function hideDeleteModal() {
    setIsDeleteModalVisible(false);
  }

  function deleteProceed(challenge: TChallenge) {
    dispatch(ChallengesDispatchers.deleteChallenge(
      selectedApp,
      challenge.id,
      {
        success: () => {
          hideDeleteModal();
          dispatch(ChallengesDispatchers.getChallengesSuccess(
            challenges.challengesList.filter(c => c.id !== challenge.id)
          ));
        },
      }
    ));
  }

  return (
    <React.Fragment>
      <TableRow hover>
        <TableCell>
          <Link
            to={ROUTES.EDIT_CHALLENGE.replace(URL_PART_APP_ID, selectedApp)
              .replace(URL_PART_CHALLENGE_ID, challenge.id + '') +
              `?${EVENT_URL_PARAMS.mode}=${EVENT_URL_PARAMS.modeValue}`}
            title="View Challenge details"
          >
            {challenge.id}
          </Link>
        </TableCell>
        <TableCell>{challenge.seasonChallengeName}</TableCell>
        <TableCell>{start}</TableCell>
        <TableCell>{nextStartAt} <small>({challenge.nextStartAt})</small></TableCell>
        <TableCell>{challenge.duration}</TableCell>
        <TableCell>{challenge.seasonChallengeStatus}</TableCell>
        <TableCell>{challenge.currency}</TableCell>
        <TableCell>
          {challenge.dailyChallengeList.map((list, listIndex) =>
            <ul key={`ul-${challenge.id}-${listIndex}`}>
              {list.map((chall, challIndex) =>
                <li key={`chall-${challenge.id}-${challIndex}`}>{chall.challengeName}</li>
              )}
            </ul>
          )}
        </TableCell>
        <TableCell>
        <ul>
          {challenge.seasonChallengeList.map((chall, challIndex) =>
            <li key={`chall-${challenge.id}-${challIndex}`}>
              {chall.challengeName}
            </li>
          )}
          </ul>
        </TableCell>
        <TableCell>
          <IconButton
            onClick={handleMenuToggleClick}
          >
            <MoreHorizontal />
          </IconButton>
          <Menu
            id="challenge-options-menu"
            anchorEl={anchorEl}
            // keepMounted
            open={Boolean(anchorEl)}
            onClose={e => handleClose()}
            PaperProps={{ style: { boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 20px' }}}
          >
            <MenuItem
              component={Link}
              to={ROUTES.EDIT_CHALLENGE.replace(URL_PART_APP_ID, selectedApp)
                .replace(URL_PART_CHALLENGE_ID, challenge.id + '') +
                `?${EVENT_URL_PARAMS.mode}=${EVENT_URL_PARAMS.modeValue}`}
            >
              View
            </MenuItem>
            <MenuItem
              component={Link}
              to={ROUTES.EDIT_CHALLENGE.replace(URL_PART_APP_ID, selectedApp)
                .replace(URL_PART_CHALLENGE_ID, challenge.id + '')}
            >
              Edit
            </MenuItem>
            <MenuItem
              component={Link}
              to={`${ROUTES.CREATE_CHALLENGE.replace(URL_PART_APP_ID, selectedApp)}?${URL_SEARCH_KEY_CLONE_ID}=${challenge.id}`}
            >
              Clone
            </MenuItem>
            <MenuItem
              onClick={e => deleteClick(challenge)}
            >
              Delete
            </MenuItem>
          </Menu>
        </TableCell>
      </TableRow>

      <Dialog
        open={isDeleteModalVisible}
        onClose={hideDeleteModal}
        scroll="paper"
        aria-labelledby="delete event"
        aria-describedby="delete event confirmation popup"
        disableBackdropClick={true}
        // fullScreen={fullScreen}
        // maxWidth="xl"
      >
        <DialogTitle id="delete-challenge-dialog-title">
          Are You Sure You Want to Delete this Challenge?
        </DialogTitle>
        <DialogContent dividers={true}>
          The Challenge with id {challenge.id} cannot be restored once it is deleted.
        </DialogContent>
        <DialogActions>
          <Button onClick={hideDeleteModal} color="primary"
            disabled={deletingChallenge.loading === XHR_STATE.IN_PROGRESS}
          >
            Cancel
          </Button>
          <Button
            onClick={e => deleteProceed(challenge)}
            disabled={deletingChallenge.loading === XHR_STATE.IN_PROGRESS}
            variant="contained" color="primary">
            Delete Event
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ChallengeRow;
