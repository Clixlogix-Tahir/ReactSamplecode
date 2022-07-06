/* eslint-disable react-hooks/exhaustive-deps */
import { Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, Typography, TableHead
} from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import UserAccounts from '.';
import {
  useAppDispatch,
  useAppSelector
} from '../../common/hooks';
import globalStyles from '../../theme/globalStyles';
import { fetchWalletRewardStatsDispatcher, fetchVirtualWalletDispatcher, fetchUserWalletTotalAmountsDispatcher, fetchUserTrueSkillDispatcher } from './userSlice';
import { ECost } from '../../types/eventTypes';
import { fetchAllUserModerationDispatcher } from '../game-config/gameConfigSlice';


const UserDetails: React.FC<any> = () => {
  const classes = globalStyles();
  const dispatch = useAppDispatch();
  const { selectedApp, isSelectedAppCrypto } = useAppSelector(state => state.gameConfigForm);
  const { searchByCriteria, virtualWallet, walletRewardStats, userWalletTotalAmounts, userTrueSkill} = useAppSelector(state => state.userSlice);
  const user = searchByCriteria.user?.appUserDto || null;
  const installedAppDto = searchByCriteria.user?.installedAppDto || null;
  const { vWallet } = virtualWallet;
  const { rewardStats } = walletRewardStats;
  const { amounts } = userWalletTotalAmounts;
  const { skillData } = userTrueSkill;
  const [depositPlusWinnings] = useState(rewardStats === null ? 0 : (rewardStats?.deposit + rewardStats?.winnings));
  const { userModeration } = useAppSelector(state => state.gameConfigForm);
  const { userModerationData, bannedApps } = userModeration;

  useEffect(() => {
    if (user) {
      dispatch(fetchVirtualWalletDispatcher(selectedApp, user.user.id));
      dispatch(fetchWalletRewardStatsDispatcher(selectedApp, user.user.id));
      dispatch(fetchUserWalletTotalAmountsDispatcher(user.user.id));
      dispatch(fetchAllUserModerationDispatcher(user.user.id));
    } else {
      console.warn('user or params.userId is missing');
    }
  }, [user]);

  useEffect(() => {
    if (user && selectedApp) {
      dispatch(fetchUserTrueSkillDispatcher(user.user.id, selectedApp));
    } else {
      console.warn('user or params.userId or appId is missing');
    }
  }, [user,selectedApp]);

  // const populateBannedApps = () => {
  //   if (!bannedApps) {
  //     setBannedApps([]);
  //   } else if (Array.isArray(installedAppDto?.device.bannedApps)) {
  //   setBannedApps(
  //     installedAppDto?.device.bannedApps
  //       .split(',')
  //       .map(a => a.trim())
  //     || []
  //   );
  //   }
  // };

  return (
    <UserAccounts>
      <Grid container spacing={5} style={{ marginTop: 24 }}>
        <Grid item sm={6} xs={12}>
          <Paper className={classes.paperRoot}>
            {searchByCriteria.error && <Alert severity="error">{searchByCriteria.error}</Alert>}
            {!searchByCriteria.error && <TableContainer className={classes.columnHeaders}>
              <Table>
                <TableBody>
                  <TableRow hover>
                    <TableCell>Phone</TableCell>
                    <TableCell>{user?.user.phone}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Email</TableCell>
                    <TableCell>{user?.user.email}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Country ISO code</TableCell>
                    <TableCell>{user?.user.countryIsoCode}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Username</TableCell>
                    <TableCell>{user?.user.userName}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Profile image</TableCell>
                    <TableCell>
                      {user?.user.profileImage && <img src={user?.user.profileImage} alt="profile" />}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Birth date</TableCell>
                    <TableCell>{user?.user.birthDate ? new Date(user?.user.birthDate).toLocaleDateString() : ''}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Win count</TableCell>
                    <TableCell>{searchByCriteria.user?.userWinCount}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Level</TableCell>
                    <TableCell>{searchByCriteria.user?.level}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Ban state</TableCell>
                    { userModerationData && 
                       <TableCell>{userModerationData.filter(um => um.moderationType==='ACCOUNT').length > 0 ? 'BANNED' : 'UNBANNED'}</TableCell>
                    }
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Banned apps</TableCell>
                    <TableCell>
                      <ul>
                        {bannedApps && bannedApps.map(appId => <li key={appId}>{appId}</li>)}
                      </ul>
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Kiwi device ID</TableCell>
                    <TableCell>{user?.deviceId}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Virtual currency</TableCell>
                    <TableCell>
                      {vWallet.filter(vw => vw.currencyType !== ECost.TICKET).map(vw =>
                        <Typography variant="body1" key={vw.id}>
                          {`${vw.amount} ${vw.currencyType}`}
                        </Typography>)}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Tickets</TableCell>
                    <TableCell>
                      {vWallet.filter(vw => vw.currencyType === ECost.TICKET).map(vw =>
                        <Typography variant="body1" key={vw.id}>
                          {`${vw.amount} ${vw.currencyType}`}
                        </Typography>)}
                    </TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Referral code</TableCell>
                    <TableCell>{user?.user?.referralCode}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Gender</TableCell>
                    <TableCell>{user?.user.gender}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>Created at</TableCell>
                    <TableCell>{user ? new Date(user.user.createdAt).toLocaleString() : ''}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>User ID</TableCell>
                    <TableCell>{user?.user.id}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>{ !isSelectedAppCrypto ? "Currency" : "JRX" } </TableCell>
                    <TableCell>USD</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>{ !isSelectedAppCrypto ? "Currency balance(deposit + winning)" : "JRX Balance" } </TableCell>
                    <TableCell>{depositPlusWinnings}</TableCell>
                  </TableRow>
                  {
                    !isSelectedAppCrypto &&
                    <TableRow hover>
                      <TableCell>Total amount deposited</TableCell>
                      <TableCell>{amounts?.depositAmt}</TableCell>
                    </TableRow>
                  }
                  {
                    !isSelectedAppCrypto &&
                    <TableRow hover>
                      <TableCell>Total bonus amout deposited</TableCell>
                      <TableCell>{amounts?.bonusAmt}</TableCell>
                    </TableRow>
                  }
                  <TableRow hover>
                    <TableCell>{ !isSelectedAppCrypto ? "Total amount won(real)" : "JRX won" } </TableCell>
                    <TableCell>{amounts?.winningsAmt}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>ID for advertiser (IFA)</TableCell>
                    <TableCell>{installedAppDto?.device.idForAdvertiser}</TableCell>
                  </TableRow>
                  <TableRow hover>
                    <TableCell>ID for vendor (IFV)</TableCell>
                    <TableCell>{installedAppDto?.device.idForVendor}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>}
          </Paper>
        </Grid>
        <Grid item sm={6} xs={12}>
          <Paper className={classes.paperRoot}>
          {!searchByCriteria.error && <TableContainer className={classes.columnHeaders}>
            <Table>
              <TableBody>
                <TableRow hover>
                  <TableCell>UTM Content</TableCell>
                  <TableCell>{installedAppDto?.utmContent}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>UTM Medium</TableCell>
                  <TableCell>{installedAppDto?.utmMedium}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>UTM Source</TableCell>
                  <TableCell>{installedAppDto?.utmSource}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>App version</TableCell>
                  <TableCell>{installedAppDto?.appVersion}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Device platform</TableCell>
                  <TableCell>{installedAppDto?.device.platform}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>OS ID</TableCell>
                  <TableCell>{installedAppDto?.device.osId}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Device model</TableCell>
                  <TableCell>{installedAppDto?.device.deviceModel}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Language</TableCell>
                  <TableCell>{user?.languageCode}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Total amount withdrawn</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>role</TableCell>
                  <TableCell>{user?.user.role}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>User composite flag</TableCell>
                  <TableCell>{user?.user.userCompositeFlag}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>First name</TableCell>
                  <TableCell>{user?.user.firstName}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Last name</TableCell>
                  <TableCell>{user?.user.lastName}</TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Payer flag</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Profile type</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow hover>
                  <TableCell>Cash reward game ban status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                  <TableRow hover>
                    <TableCell>True skill (mu-(3*sigma))</TableCell>
                    <TableCell>
                      <TableContainer >
                        <Table stickyHeader>
                          <TableHead>
                            <TableRow>
                              <TableCell>Game Id</TableCell>
                              <TableCell>Virtual Currency</TableCell>
                              <TableCell>Real Currency</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {
                              skillData &&
                              skillData.map((skillDatum, index) => (
                                <TableRow hover key={index}>
                                  <TableCell>{skillDatum.gameId}</TableCell>
                                  <TableCell>{parseFloat((skillDatum.nonCashMeanSkill - (3 * skillDatum.nonCashStandardDeviation)).toFixed(4))}</TableCell>
                                  <TableCell>{parseFloat((skillDatum.cashMeanSkill - (3 * skillDatum.cashStandardDeviation)).toFixed(4))}</TableCell>
                                </TableRow>
                              ))
                            }
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </TableCell>
                  </TableRow>
              </TableBody>
            </Table>
          </TableContainer>}
          </Paper>
        </Grid>
      </Grid>
    </UserAccounts>
  );
};

export default UserDetails;
