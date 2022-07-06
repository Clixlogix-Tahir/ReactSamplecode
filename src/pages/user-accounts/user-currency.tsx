/* eslint-disable react-hooks/exhaustive-deps */
import { Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import UserAccounts from '.';
import globalStyles from '../../theme/globalStyles';
import {
  fetchVirtualWalletLedgerDispatcher,
  searchByCriteraDispatcher
} from './userSlice';
import { URL_SEARCH_KEY_SEARCH_CRITERIA, URL_SEARCH_KEY_SEARCH_TERM } from '../../common/constants';
import { Alert } from '@material-ui/lab';
import {
  useAppDispatch,
  useAppSelector,
  useUrlQuery
} from '../../common/hooks';

const UserVirtualCurrency: React.FC<any> = () => {
  const classes = globalStyles();
  const dispatch = useAppDispatch();
  const searchQuery = useUrlQuery();
  const searchCriteria = searchQuery.get(URL_SEARCH_KEY_SEARCH_CRITERIA) || '';
  const searchTerm = searchQuery.get(URL_SEARCH_KEY_SEARCH_TERM) || '';
  const { selectedApp } = useAppSelector(state => state.gameConfigForm);
  const {
    fetchVirtualWalletLedger,
    searchByCriteria,
  } = useAppSelector(state => state.userSlice);
  const user = searchByCriteria.user?.appUserDto || null;
  const { wallet } = fetchVirtualWalletLedger;
  // const { rewardStats } = walletRewardStats;
  // const [pendingAmount, setPendingAmount] = useState(0);
  // const [idForRevert, setIdForRevert] = useState(0);
  // const [showMarkPendingConfirm, setShowMarkPendingConfirm] = useState(false);
  // const [markPendingError, setMarkPendingError] = useState('');
  // const [showPendingPaidConfirm, setShowPendingPaidConfirm] = useState(false);
  // const [showRevertConfirm, setShowRevertConfirm] = useState(false);
  // const [showTaxAlert, setShowTaxAlert] = useState(false);

  useEffect(() => {
    if (selectedApp && searchCriteria && searchTerm) {
      dispatch(searchByCriteraDispatcher(selectedApp, searchCriteria, searchTerm));
    } else {
      console.warn('cannot find user; search criteria missing');
    }
  }, [selectedApp]);

  useEffect(() => {
    if (user && selectedApp) {
      console.log('dwfevrvf');
      dispatch(fetchVirtualWalletLedgerDispatcher(selectedApp, user.user.id));
      //dispatch(fetchWalletRewardStatsDispatcher(selectedApp, user.user.id));
    }
  }, [user]);

  // const refreshLedgerAndStats = () => {
  //   setShowPendingPaidConfirm(false);
  //   if (user && user.user.id) {
  //     dispatch(fetchWalletLedgerDispatcher(selectedApp, user.user.id));
  //     dispatch(fetchWalletRewardStatsDispatcher(selectedApp, user.user.id));
  //   } else {
  //     console.warn('user.user.id not found in refreshLedgerAndStats');
  //   }
  // };

  // const showMarkPendingDialog = (e: React.FormEvent) => {
  //   let errorMsg = '';
  //   e.preventDefault();
  //   if (pendingAmount <= (rewardStats?.winnings || -Infinity) && pendingAmount >= 0) {
  //     setShowMarkPendingConfirm(true);
  //     setMarkPendingError(errorMsg);
  //     if (rewardStats) {
  //       console.info(rewardStats.totalWithdrawalsThisYear, pendingAmount, rewardStats.totalWithdrawalsThisYear + pendingAmount >= 1);
  //       setShowTaxAlert(rewardStats.currencyCode === ECurrency.USD && Boolean(rewardStats.totalWithdrawalsThisYear + pendingAmount >= NO_TAX_LIMIT));
  //     }
  //   } else {
  //     errorMsg = 'invalid amount';
  //     if (!rewardStats || pendingAmount > rewardStats.winnings) {
  //       errorMsg = `Amount should be less than or equal to winnings amount (${rewardStats?.winnings}).`;
  //     }
  //     if (pendingAmount < WITHDRAW_WINNING_THRESHOLD) {
  //       errorMsg = `Amount is below threshold for withdrawal (${WITHDRAW_WINNING_THRESHOLD}).`;
  //     }
  //     setMarkPendingError(errorMsg);
  //   }
  // };

  // const markPendingProceed = () => {
  //   if (searchByCriteria.user && user && user.user.id) {
  //     dispatch(markAmountPendingFromWinningDispatcher(
  //       selectedApp,
  //       user.user.id,
  //       pendingAmount,
  //       {
  //         onSuccess: () => {
  //           setShowMarkPendingConfirm(false);
  //           refreshLedgerAndStats();
  //           setPendingAmount(0);
  //         }
  //       }
  //     ));
  //   } else {
  //     console.warn('markAmountPendingFromWinningSubmit: appId and userId are required');
  //   }
  // };

  // const markPendingAsPaidClick = () => {
  //   setShowPendingPaidConfirm(true);
  // };

  // const markPendingAsPaidProceed = () => {
  //   if (searchByCriteria.user && user && user.user.id) {
  //     dispatch(markPendingAsPaidDispatcher(
  //       selectedApp,
  //       user.user.id,
  //       {
  //         onSuccess: () => {
  //           setShowPendingPaidConfirm(false);
  //           refreshLedgerAndStats();
  //           setPendingAmount(0);
  //         }
  //       }
  //     ));
  //   } else {
  //     console.warn('markPendingAsPaidClick: appId, userId and transactionId are required');
  //   }
  // };

  // const revertClick = (id: number) => {
  //   setIdForRevert(id);
  //   setShowRevertConfirm(true);
  // };

  // const revertProceed = () => {
  //   if (searchByCriteria.user && user && user.user.id) {
  //     dispatch(revertPaymentDispatcher(
  //       selectedApp,
  //       user.user.id,
  //       idForRevert,
  //       {
  //         onSuccess: () => {
  //           setShowRevertConfirm(false);
  //           refreshLedgerAndStats();
  //           setPendingAmount(0);
  //         },
  //       }
  //     ));
  //   } else {
  //     console.warn('revertClick: appId and userId are required');
  //   }
  // };

  // const hideMarkPendingConfirm = () => {
  //   setShowMarkPendingConfirm(false);
  // };

  // const hidePendingPaidConfirm = () => {
  //   setShowPendingPaidConfirm(false);
  // };

  // const hideRevertConfirm = () => {
  //   setShowRevertConfirm(false);
  // };

  return (
    <UserAccounts>
      {/* <Grid container spacing={6} style={{ marginTop: 12 }}>
        <Grid item xs={12} sm={6}>
          <Shadow>
            <Card>
              <TableContainer>
                <Table stickyHeader size="small">
                  <TableBody>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="subtitle1">Total withdrawals this year (VC)</Typography>
                      </TableCell>
                      <TableCell>
                        {walletRewardStats.loading !== XHR_STATE.IN_PROGRESS &&
                          <strong>{rewardStats?.totalWithdrawalsThisYear}</strong>}
                        {walletRewardStats.loading === XHR_STATE.IN_PROGRESS &&
                          <Skeleton width={100} />}
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="subtitle1">Pending withdrawals</Typography>
                      </TableCell>
                      <TableCell>
                        {walletRewardStats.loading !== XHR_STATE.IN_PROGRESS &&
                          <strong>{rewardStats?.pendingWithdrawals}</strong>}
                        {walletRewardStats.loading === XHR_STATE.IN_PROGRESS &&
                          <Skeleton width={100} />}
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="subtitle1">Deposits</Typography>
                      </TableCell>
                      <TableCell>
                        {walletRewardStats.loading !== XHR_STATE.IN_PROGRESS &&
                          <strong>{rewardStats?.deposit}</strong>}
                        {walletRewardStats.loading === XHR_STATE.IN_PROGRESS &&
                          <Skeleton width={100} />}
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="subtitle1">Bonus</Typography>
                      </TableCell>
                      <TableCell>
                        {walletRewardStats.loading !== XHR_STATE.IN_PROGRESS &&
                          <strong>{rewardStats?.bonus}</strong>}
                        {walletRewardStats.loading === XHR_STATE.IN_PROGRESS &&
                          <Skeleton width={100} />}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Shadow>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Shadow>
            <Card>
              <TableContainer>
                <Table stickyHeader size="small">
                  <TableBody>
                    <TableRow hover>
                      <TableCell>
                        <Typography variant="subtitle1">Currency</Typography>
                      </TableCell>
                      <TableCell>
                        {walletRewardStats.loading !== XHR_STATE.IN_PROGRESS &&
                          <strong>{rewardStats?.currencyCode}</strong>}
                        {walletRewardStats.loading === XHR_STATE.IN_PROGRESS &&
                          <Skeleton width={100} />}
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell><Typography variant="subtitle1">Wallet Currency</Typography></TableCell>
                      <TableCell>
                        {walletRewardStats.loading !== XHR_STATE.IN_PROGRESS &&
                          <strong>{rewardStats?.walletCurrencyCode}</strong>}
                        {walletRewardStats.loading === XHR_STATE.IN_PROGRESS &&
                          <Skeleton width={100} />}
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell><Typography variant="subtitle1">Winnings</Typography></TableCell>
                      <TableCell>
                        {walletRewardStats.loading !== XHR_STATE.IN_PROGRESS &&
                          <strong>{rewardStats?.winnings}</strong>}
                        {walletRewardStats.loading === XHR_STATE.IN_PROGRESS &&
                          <Skeleton width={100} />}
                      </TableCell>
                    </TableRow>
                    <TableRow hover>
                      <TableCell><Typography variant="subtitle1">Total</Typography></TableCell>
                      <TableCell>
                        {walletRewardStats.loading !== XHR_STATE.IN_PROGRESS &&
                          <strong>{rewardStats?.total}</strong>}
                        {walletRewardStats.loading === XHR_STATE.IN_PROGRESS &&
                          <Skeleton width={100} />}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Shadow>
        </Grid>
      </Grid> */}

      <Paper className={classes.paperRoot} style={{ marginTop: 24 }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Platform</TableCell>
                <TableCell>Currency Type</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Transaction Info</TableCell>
                {/* <TableCell>Actions</TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {wallet.map(entry =>
                <TableRow hover key={entry.id}>
                  <TableCell>{entry.id}</TableCell>
                  <TableCell>{new Date(entry.createdAt).toLocaleString()}</TableCell>
                  <TableCell>{entry.amount}</TableCell>
                  <TableCell>{entry.platform}</TableCell>
                  <TableCell>{entry.currencyType}</TableCell>
                  <TableCell>{entry.action}</TableCell>
                  <TableCell>{entry.description}</TableCell>
                  <TableCell><span style={{ wordBreak: 'break-all' }}>{entry.transactionId}</span></TableCell>
                  <TableCell>{entry.transactionInfo}</TableCell>
                  {/* <TableCell>
                    {!entry.isReverted && <Button variant="outlined" color="primary" size="small"
                      disabled={revertPayment.loading === XHR_STATE.IN_PROGRESS}
                      onClick={e => revertClick(entry.id)}
                    >
                      Revert
                    </Button>}
                    {entry.isReverted &&
                      <Chip color="primary" label="Reverted"/>}
                  </TableCell> */}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        {wallet.length === 0 && <Alert severity="warning">No transaction data yet</Alert>}
      </Paper>

      {/* <HandyDialog
        open={showMarkPendingConfirm}
        title="Confirmation for mark as pending"
        content={
          <TableContainer>
            <Table stickyHeader size="small">
              <TableBody>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>{user?.user.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>
                    {
                      (user?.user.firstName || user?.user.lastName) ?
                      `${user?.user.firstName} ${user?.user.lastName}`
                      : `(name not set)`
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Amount</TableCell>
                  <TableCell>{pendingAmount}</TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                {showTaxAlert &&
                <TableRow>
                  <TableCell colSpan={2}>
                    <Alert severity="info" style={{ marginTop: 24 }}>
                      Withdrawn amount will exceed {NO_TAX_LIMIT}. This has tax implications.
                    </Alert>
                  </TableCell>
                </TableRow>}
                {pendingAmount < WITHDRAW_WINNING_THRESHOLD &&
                <TableRow>
                  <TableCell colSpan={2}>
                      <Alert severity="warning" style={{ marginTop: 24 }}>
                        Withdrawable amount should be at least {WITHDRAW_WINNING_THRESHOLD}.
                      </Alert>
                  </TableCell>
                </TableRow>}
              </TableFooter>
            </Table>
          </TableContainer>
        }
        onClose={hideMarkPendingConfirm}
        onCancelClick={hideMarkPendingConfirm}
        onOkClick={markPendingProceed}
        okDisabled={markAmountPendingFromWinning.loading === XHR_STATE.IN_PROGRESS ||
          pendingAmount < WITHDRAW_WINNING_THRESHOLD}
        cancelDisabled={markAmountPendingFromWinning.loading === XHR_STATE.IN_PROGRESS}
        okText="Proceed"
      />

      <HandyDialog
        open={showPendingPaidConfirm}
        title="Confirmation for marking pending as paid"
        content={
          <TableContainer>
            <Table stickyHeader size="small">
              <TableBody>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>{user?.user.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>
                    {
                      (user?.user.firstName || user?.user.lastName) ?
                      `${user?.user.firstName} ${user?.user.lastName}`
                      : `(name not set)`
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Entry ID</TableCell>
                  <TableCell>{wallet.find(w => w.source === ECurrencyPlatform.PAY_LOCKED)?.id || '(not found)'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        }
        onClose={hidePendingPaidConfirm}
        onCancelClick={hidePendingPaidConfirm}
        onOkClick={markPendingAsPaidProceed}
        okDisabled={markPendingAsPaid.loading === XHR_STATE.IN_PROGRESS}
        cancelDisabled={markPendingAsPaid.loading === XHR_STATE.IN_PROGRESS}
      />

      <HandyDialog
        open={showRevertConfirm}
        title="Confirmation for revert"
        content={
          <TableContainer>
            <Table stickyHeader size="small">
              <TableBody>
                <TableRow>
                  <TableCell>User ID</TableCell>
                  <TableCell>{user?.user.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>User Name</TableCell>
                  <TableCell>
                    {
                      (user?.user.firstName || user?.user.lastName) ?
                      `${user?.user.firstName} ${user?.user.lastName}`
                      : `(name not set)`
                    }
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Entry ID</TableCell>
                  <TableCell>{idForRevert}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        }
        onClose={hideRevertConfirm}
        onCancelClick={hideRevertConfirm}
        onOkClick={revertProceed}
        okDisabled={revertPayment.loading === XHR_STATE.IN_PROGRESS}
        cancelDisabled={revertPayment.loading === XHR_STATE.IN_PROGRESS}
      />

      <HandyDialog
        open={markPendingError !== ''}
        title="Invalid Amount"
        content={
          <Alert severity="warning">{markPendingError}</Alert>
        }
        onClose={() => setMarkPendingError('')}
        onOkClick={() => setMarkPendingError('')}
        okText="Go Back"
      />

      <UserSnackbars /> */}
    </UserAccounts>
  );
};

export default UserVirtualCurrency;