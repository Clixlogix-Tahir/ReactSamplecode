import { CircularProgress, Grid, Paper } from '@material-ui/core';
import React from 'react';
import globalStyles from '../theme/globalStyles';

function LoaderPaper(props: any) {
  const classes = globalStyles();
  return (
    <Grid container spacing={6}>
      <Grid item xs={12}>
        <Paper className={`${classes.loaderRoot} ${classes.loader}`}>
          <CircularProgress />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default LoaderPaper;