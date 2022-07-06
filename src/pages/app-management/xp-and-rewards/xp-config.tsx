/* eslint-disable react-hooks/exhaustive-deps */
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import React from 'react';
import { XHR_STATE } from '../../../common/constants';
import { useAppDispatch, useAppSelector } from '../../../common/hooks';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { appManagementDispatchers } from '../appManagementSlice';


function XpConfig(props: any) {
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const dispatch = useAppDispatch();
  const { userXpInfo } = useAppSelector(state => state.appManagementSlice);
  const { info } = userXpInfo;

  React.useEffect(() => {
    if (selectedApp) {
      dispatch(appManagementDispatchers.getUserXpInfo(selectedApp));
    }
  }, [selectedApp]);

  return (
    <div style={{ width: '100%' }}>
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h3" style={{ padding: 16 }}>
        XP Configuration
      </Typography>
      </AccordionSummary>
      <AccordionDetails>
      <TableContainer style={{ wordBreak: 'break-word' }}>
        <Table stickyHeader size="small">
          <TableBody>
            <TableRow>
              <TableCell>
                Level 1 XP
              </TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.start}
              </TableCell>
              <TableCell>
                Time Bonus
              </TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.timeBonus}
              </TableCell>
            
              <TableCell rowSpan={8}>
                <Typography variant="h4" style={{ padding: 16 }}>
                  XP Calculation Formula
                </Typography>
                {info && <ul>
                  <li>Level 1 : {info.start}</li>
                  <li>Level 2 : {info.start + info.increment * (2 - 1)}</li>
                  <li>Level 3 : {(info.start + info.increment * (2 - 1)) + info.increment * (3 - 1)}</li>
                  <li>Level 4 : {(info.start + info.increment * (3 - 1)) + info.increment * (4 - 1)}</li>
                  <li>Level 5 : {(info.start + info.increment * (4 - 1)) + info.increment * (5 - 1)}</li>
                  <li>...</li>
                  <li>Level n :<br />Level n-1 : {info.increment} x (n-1)</li>
                </ul>}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                Increment Level N-1
              </TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.increment}
              </TableCell>
              <TableCell>Win Bonus Multiplier</TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.winBonusMultiplier}
              </TableCell>
              
            </TableRow>

            <TableRow>
              <TableCell>
                Min Session Duration To Give Xp In Secs
              </TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.minSessionDurationToGiveXpInSecs}
              </TableCell>
              <TableCell>Cash Game Bonus Pivot Amount</TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.cashGameBonusPivotAmount}
              </TableCell>
              
            </TableRow>

            <TableRow>
              <TableCell>
                Min Base XP
              </TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.minIncreaseXp}
              </TableCell>
              <TableCell>Cash Game Bonus Multiplier Below Pivot</TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.cashGameBonusMultiplierBelowPivot}
              </TableCell>
              
            </TableRow>

            <TableRow>
              <TableCell>
                Max Base XP
              </TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.maxIncreaseXp}
              </TableCell>
              <TableCell>
                Cash Game Bonus Multiplier Above Pivot
              </TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.cashGameBonusMultiplierAbovePivot}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>Rematch Bonus Max Multiplier</TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.rematchBonusMaxMultiplier}
              </TableCell>
              <TableCell>Rematch Bonus Step Multiplier</TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.rematchBonusStepMultiplier}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                First Game For Day Multiplier
              </TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.firstGameForDayMultiplier}
              </TableCell>
              <TableCell>Rematch Bonus Min Multiplier</TableCell>
              <TableCell>
                {info?.rematchBonusMinMultiplier}
              </TableCell>
            </TableRow>

            <TableRow>
              <TableCell>
                Private Game Bonus Multiplier
              </TableCell>
              <TableCell>
                {userXpInfo.loading === XHR_STATE.IN_PROGRESS && <Skeleton width={20} />}
                {info?.privateGameBonusMultiplier}
              </TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>

          </TableBody>
        </Table>
      </TableContainer>
      </AccordionDetails>
    </Accordion>
    
    </div>
  );
}

export default XpConfig;