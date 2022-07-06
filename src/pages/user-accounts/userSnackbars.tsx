import {
  Snackbar
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { Fragment } from 'react';
import {
  useAppDispatch,
  useAppSelector
} from '../../common/hooks';
import {
  markAmountPendingFromWinningSetError,
  markPendingAsPaidSetError,
  revertPaymentSetError
} from './userSlice';

interface IUserSnackbarProps {
  //
}

function UserSnackbars(props: IUserSnackbarProps) {
  const dispatch = useAppDispatch();
  const {
    markAmountPendingFromWinning,
    markPendingAsPaid,
    revertPayment
  } = useAppSelector(state => state.userSlice);

  return (
    <Fragment>
      <Snackbar
        open={Boolean(markAmountPendingFromWinning.error)}
        autoHideDuration={3000}
        onClose={() => dispatch(markAmountPendingFromWinningSetError(''))}
      >
        <Alert severity="error"
          onClose={() => dispatch(markAmountPendingFromWinningSetError(''))}
        >
          {markAmountPendingFromWinning.error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(markPendingAsPaid.error)}
        autoHideDuration={3000}
        onClose={() => dispatch(markPendingAsPaidSetError(''))}
      >
        <Alert severity="error"
          onClose={() => dispatch(markPendingAsPaidSetError(''))}
        >
          {markPendingAsPaid.error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={Boolean(revertPayment.error)}
        autoHideDuration={3000}
        onClose={() => dispatch(revertPaymentSetError(''))}
      >
        <Alert severity="error"
          onClose={() => dispatch(revertPaymentSetError(''))}
        >
          {revertPayment.error}
        </Alert>
      </Snackbar>
    </Fragment>
  );
}

export default UserSnackbars;
