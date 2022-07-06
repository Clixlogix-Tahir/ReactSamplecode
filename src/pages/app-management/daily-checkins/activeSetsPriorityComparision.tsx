/* eslint-disable react-hooks/exhaustive-deps */
import { Card as MuiCard, createStyles } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { spacing } from "@material-ui/system";
import React from 'react';
import styled from 'styled-components';
import { TActiveSetsPriorityComparision, TDailyCheckinRewardSet } from '../appManagementTypes';

const Card = styled(MuiCard)`
  ${spacing};
  box-shadow: none;
`;

const useStyles = makeStyles((theme) => createStyles({
  root: {
    width: '100%',
  },
  holder: {
    padding: '1rem',
    display: 'inline-flex',
    alignItems: 'center',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: 'normal',
  },
  headerRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  content: {
  },

}));

function ActiveSetsPriorityComparision(props: TActiveSetsPriorityComparision) {
  const classes = useStyles();
  const { rewardSets } = props;
  const activeSetsHeading = 'Active sets in order of their priority : ';
  const noSetsPresentHeading = 'No sets present';
  let activeRewardSets : TDailyCheckinRewardSet[] = rewardSets.filter(set => set.active === true).sort((a,b) => a.rewardSetNum-b.rewardSetNum);

  return (
    <React.Fragment>
      <Card>

        <div className={classes.holder}>
          <div className={classes.heading}> {rewardSets?.length === 0 ? noSetsPresentHeading : activeSetsHeading} </div> &nbsp;
          <div className={classes.content}>
            {
              activeRewardSets && 
              activeRewardSets.map((set,index) => (
                `Set ${set.index} ${index < activeRewardSets.length-1 ? '> ' : ' '}` 
              ))
            }
          </div>
        </div>

      </Card>
    </React.Fragment>
  );
}

export default ActiveSetsPriorityComparision;