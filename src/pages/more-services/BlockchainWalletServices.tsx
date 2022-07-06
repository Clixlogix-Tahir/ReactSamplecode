/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box, Grid, Paper
} from '@material-ui/core';
import React from 'react';
import globalStyles from '../../theme/globalStyles';
import { ReactComponent as ExternalLinkIcon } from '../../custom-icons/ExternalLink.svg';
import { ReactComponent as WalletIcon } from '../../custom-icons/Wallet.svg';
import { ShadowedHeading, UnpaddedContainer } from '../../components/StyledComponents';


const BlockchainWalletServices: React.FC<any> = () => {
  const classes = globalStyles();

  return (
    <UnpaddedContainer>
      <Paper className={classes.paperRoot}>
        <Box>
          <Grid container>
            <Grid item xs={12} style={{ overflow:'hidden' }}>
              <ShadowedHeading><WalletIcon /> Wallet</ShadowedHeading>
              <Box className="main">
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <h2>Blockchain Wallet Service Coming Soon</h2>
                    <p>The clixlogix-samplecode blockchain wallet allows for easy on-boarding of naive players with the flexibility required for seasoned crypto users.</p>
                    <p>Payment rails for fiat on-boarding, KYC/AML, NFT support, and the $JRX token...we've handled it all to make it easy for you to build a game with your community participating in your success.</p>

                    <h2>Send us your query</h2>
                    <p>
                      Write to us at&nbsp;
                      <a
                        href="mailto:support@onclixlogix-samplecode.com?subject=Blockchain%20wallet%20service%20inquiry%20%3Cyour%20company%20name%3E"
                        target="_blank"
                        rel="noopener noreferrer"
                      >support@onclixlogix-samplecode.com</a>
                      <ExternalLinkIcon />
                    </p>
                  </Grid>
                  <Grid item xs={6}>
                    <img src="https://assets.onclixlogix-samplecode.com/website/img/wallet.png" alt="screenshots"
                      width={392} height={388}
                      style={{ maxWidth: '100%', marginLeft: 10 }}
                    />
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </UnpaddedContainer>

  );
}

export default BlockchainWalletServices;
