import { APP_ID } from "../../types/types";
import { Eclixlogix-samplecodeEnvs } from "../utils";

const defaultTest = {
  // id: '57',
  // subdomain: 'blitzbi-test',
  // token: '5f3d33b5-c691-4add-9094-6a6c8b229243',
  id: '',
  subdomain: 'blitzbi-test',
  token: '',
};

const defaultTestAllEnvs = {
  [Eclixlogix-samplecodeEnvs.LOCAL]: { ...defaultTest },
  [Eclixlogix-samplecodeEnvs.TESTING]: { ...defaultTest },
  [Eclixlogix-samplecodeEnvs.AUTOMATION]: { ...defaultTest },
  [Eclixlogix-samplecodeEnvs.JUPITER]: { ...defaultTest },
  [Eclixlogix-samplecodeEnvs.QA]: { ...defaultTest },
  [Eclixlogix-samplecodeEnvs.MOON]: { ...defaultTest },
  [Eclixlogix-samplecodeEnvs.STAGE]: { ...defaultTest },
  [Eclixlogix-samplecodeEnvs.PROD]: { ...defaultTest },
  [Eclixlogix-samplecodeEnvs.PROD_TESTNET]: { ...defaultTest },
};

const blitzApps = {
  [APP_ID.clixlogix-samplecode]: {
    ...defaultTestAllEnvs,
    [Eclixlogix-samplecodeEnvs.PROD]: {
      id: '9',
      subdomain: 'prod-blitzbi-infra',
      token: '99123c5c-52a7-41a6-8b40-f346b48dbf04',
    },
  },
  [APP_ID.SOLITAIRE]: {
    ...defaultTestAllEnvs,
    [Eclixlogix-samplecodeEnvs.PROD]: {
      id: '9',
      subdomain: 'prod-blitzbi-infra',
      token: '99123c5c-52a7-41a6-8b40-f346b48dbf04',
    },
  },
  [APP_ID.SOLITAIRE_CRYPTO]: {
    ...defaultTestAllEnvs,
    [Eclixlogix-samplecodeEnvs.PROD_TESTNET]: {
      id: '32',
      subdomain: 'prod-blitzbi-infra',
      token: '10dbc9b4-6858-43e4-9168-e6a13e40aa8e',
    },
  },
  [APP_ID.TENNIS_CHAMPS]: {
    ...defaultTestAllEnvs,
    [Eclixlogix-samplecodeEnvs.PROD]: {
      id: '21',
      subdomain: 'prod-blitzbi-infra',
      token: 'c1c8d184-110b-4450-9525-8a6ec42000bf',
    },
  },
  [APP_ID.SHEEP_CLASH]: {
    ...defaultTestAllEnvs,
    [Eclixlogix-samplecodeEnvs.PROD]: {
      id: '22',
      subdomain: 'prod-blitzbi-infra',
      token: '528e0ebc-8b2e-4c88-9270-ac239975b9f2',
    },
  },
  [APP_ID.TONK_BATTLER]: {
    ...defaultTestAllEnvs,
  },
  [APP_ID.WORDPLAY]: {
    ...defaultTestAllEnvs,
  },
  [APP_ID.TRIVIA_BLITZ]: {
    ...defaultTestAllEnvs,
  },
  [APP_ID.BATTLE_CHAMPS]: {
    ...defaultTestAllEnvs,
  },
  [APP_ID.TANK_WARS]: {
    ...defaultTestAllEnvs,
  },
  [APP_ID.MATCH]: {
    ...defaultTestAllEnvs,
  },
  [APP_ID.BUBBLE]: {
    ...defaultTestAllEnvs,
  },
  [APP_ID.MUSIC_MANIA]: {
    ...defaultTestAllEnvs,
  },
};

export default blitzApps;
