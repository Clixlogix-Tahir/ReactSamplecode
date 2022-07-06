/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box, Grid, Paper
} from '@material-ui/core';
import React from 'react';
import globalStyles from '../../theme/globalStyles';
import { ReactComponent as ExternalLinkIcon } from '../../custom-icons/ExternalLink.svg';
import { ReactComponent as TennisChampIcon } from '../../custom-icons/TennisChamp.svg';
import { ShadowedHeading, UnpaddedContainer } from '../../components/StyledComponents';


const NftPublishingServices: React.FC<any> = () => {
  const classes = globalStyles();

  return (
    <UnpaddedContainer>
      <Paper className={classes.paperRoot}>
        <Box>
          <Grid container>
            <Grid item xs={12} style={{ overflow:'hidden' }}>
              <ShadowedHeading><TennisChampIcon /> NFTs</ShadowedHeading>
              <Box className="main">
                <Grid container spacing={8}>
                  <Grid item xs={6}>
                    <h2>NFT Publishing Service Coming Soon</h2>
                    <p>Unique tokenized assets with in-game benefits that you can offer to your players. clixlogix-samplecode offers an integrated pipeline to turn your playable assets into minted NFT's that can be offered for sale to players. Arrange a Genesis drop to fund your game or offer playable NFT's to an established game community. Our platform handles all the merchandising, marketing, and payments complexity.</p>

                    <h2>Send us your query</h2>
                    <p>
                      Write to us at&nbsp;
                      <a
                        href="mailto:support@onclixlogix-samplecode.com?subject=NFT%20publishing%20service%20inquiry%20%3Cyour%20company%20name%3E"
                        target="_blank"
                        rel="noopener noreferrer"
                      >support@onclixlogix-samplecode.com</a>
                      <ExternalLinkIcon />
                    </p>
                  </Grid>
                  <Grid item xs={6} justify='center'>
                    <img src="https://assets.onclixlogix-samplecode.com/website/img/nfts.png" alt="tennis champ character"
                      width={350} height={322}
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

export default NftPublishingServices;
