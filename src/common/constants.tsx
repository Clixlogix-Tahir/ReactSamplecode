import { EVersions } from "../types/gameConfigTypes";
import { Eclixlogix-samplecodeEnvs, getclixlogix-samplecodeEnv } from "../common/utils";
import blitzApps from "./constants/blitz-apps";
import tickers from "./constants/charts";

export const ADMIN_USER_AUTH_TOKEN = 'jrx-admin-user-auth-token';

export const BASE_URLs = {
  //development: "http://localhost:9006/",
  //development: "http://qa.onclixlogix-samplecode.com:9006/",
  development: "http://automation.onclixlogix-samplecode.com:9006/",
  //development: "http://testing.onclixlogix-samplecode.com:9006/",

  test: "/",
  // development: 'https://testl.com:9006/',
  production: "/",
  assetPrefix: "https://assets.onclixlogix-samplecode.com/website/",
  // production: 'https://test.com:9006/',  // todo use this for prod
};

export const URL_PART_APP_ID = ":appId";
export const URL_PART_GAME_ID = ":gameId";
export const URL_SEARCH_KEY_SEARCH_CRITERIA = "searchCriteria";
export const URL_SEARCH_KEY_SEARCH_TERM = "searchTerm";
export const URL_SEARCH_KEY_EVENT_TYPE = "type";
export const URL_SEARCH_KEY_CLONE_ID = "cloneId";
export const URL_PART_CHALLENGE_ID = ":challengeId";


export enum XHR_STATE {
  ASLEEP,
  IN_PROGRESS,
  COMPLETE, // todo deprecrate COMPLETE. Use ASLEEP instead.
}

export enum BATTLE_ENTRY_TYPES {
  REAL = "REAL",
  VIRTUAL = "VIRTUAL",
}

export const CONSTANTS = {
  SIGNUP_PAGE: "signup_page",
  SIGNIN_PAGE: "signin_page",
  AUTHENTICATION_ERROR_USER_EMAIL_NOT_VERIFIED: "User email not verified",
  tickers,
  URL_SEARCH_KEYS: {
    invitation_key: "invitation_key",
  },
  LOCAL_STORAGE: {
    GOOGLE_PROFILE: "userGoogleProfile",
    DEFAULT_BI: "defaultBi",
    CLIPBOARD_DATA: "JSON_DATA",
  },
  JSON_LOGIC_KEYS: {
    dsi: "dsi",
    minXpLevel: "minXpLevel",
  },
  BLITZ_APP: blitzApps,
  DOCS: {
    [Eclixlogix-samplecodeEnvs.LOCAL]: {
      root: "http://localhost:3008",
      url: "http://localhost:3008/docs/unity-integration/overview",
      url2: "http://localhost:3008/docs/unity-integration/overview",
    },
    [Eclixlogix-samplecodeEnvs.TESTING]: {
      root: "https://docs-qa.onclixlogix-samplecode.com",
      url: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
      url2: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
    },
    [Eclixlogix-samplecodeEnvs.AUTOMATION]: {
      root: "https://docs-qa.onclixlogix-samplecode.com",
      url: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
      url2: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
    },
    [Eclixlogix-samplecodeEnvs.JUPITER]: {
      root: "https://docs-qa.onclixlogix-samplecode.com",
      url: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
      url2: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
    },
    [Eclixlogix-samplecodeEnvs.QA]: {
      root: "https://docs-qa.onclixlogix-samplecode.com",
      url: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
      url2: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
    },
    [Eclixlogix-samplecodeEnvs.MOON]: {
      root: "https://docs-qa.onclixlogix-samplecode.com",
      url: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
      url2: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
    },
    [Eclixlogix-samplecodeEnvs.STAGE]: {
      root: "https://docs-qa.onclixlogix-samplecode.com",
      url: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
      url2: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
    },
    [Eclixlogix-samplecodeEnvs.PROD]: {
      root: "https://docs.onclixlogix-samplecode.com",
      url: "https://docs.onclixlogix-samplecode.com/docs/unity-integration/overview",
      url2: "https://docs.onclixlogix-samplecode.com/docs/unity-integration/overview",
    },
    [Eclixlogix-samplecodeEnvs.PROD_TESTNET]: {
      root: "https://docs-qa.onclixlogix-samplecode.com",
      url: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
      url2: "https://docs-qa.onclixlogix-samplecode.com/docs/unity-integration/overview",
    },
  },
  MISC: {
    GAME_TYPE_NEW_GAME: "New Game",
    SAMPLE_APP: "SAMPLE_APP",
    SAMPLE_GAME: "SAMPLE_GAME",
  },
  tempBiIdMap: {
    "jrx.clixlogix-samplecode": "",
    "onclixlogix-samplecode.solitaire": "9",
    "onclixlogix-samplecode.tennischamps": "21",
    "onclixlogix-samplecode.sheepclash": "22",
    "onclixlogix-samplecode.tonkbattler": "",
    "onclixlogix-samplecode.wordplay": "23",
    "onclixlogix-samplecode.trivia": "24",
    "onclixlogix-samplecode.battlechamps": "25",
    "onclixlogix-samplecode.tankwars": "26",
    "onclixlogix-samplecode.match": "29",
    "onclixlogix-samplecode.bubble": "28",
    "onclixlogix-samplecode.musicmania": "30",
    "onclixlogix-samplecode.jrxsolitaireblitz": "32",
  } as { [key: string]: string },
};


export const ROUTES = {
  OVERVIEW: `/overview/${URL_PART_APP_ID}`,
  CREATE_APP: `/create-app`,
  APP_MANAGEMENT: `/app/${URL_PART_APP_ID}`,
  APP_DETAILS: `/app/${URL_PART_APP_ID}/app-details`,
  APP_XP_AND_REWARDS: `/app/${URL_PART_APP_ID}/xp-and-rewards`,
  APP_DAILY_CHECKINS: `/app/${URL_PART_APP_ID}/daily-checkins`,

  REQUEST: "/request",
  REQUEST_ADD_GAME_REQUEST: "/add-game-request",
  REQUEST_PENDING_REQUEST: "/pending-game-request",
  RQUEST_ADD_ORGANIZATION: "/add-organization",
  RQUEST_SUCCESS: "/request-success",
  REQUEST_MANAGEMENT: "/manage-request",

  VIEW_USER_PROFILE: "/view-user-profile",
  ORGANIZATION_DETAILS: "/organization-details",

  CUSTOM_THEME: `/custom-theme/${URL_PART_APP_ID}`,

  GAME_CONFIG: "/game-config",
  GAME_CONFIG_CREATE: "/create-game-config", // todo use appId here
  GAME_CONFIG_DRAFT: `/game-config/${URL_PART_APP_ID}/${URL_PART_GAME_ID}/draft`,
  GAME_CONFIG_CURRENT_LIVE: `/game-config/${URL_PART_APP_ID}/${URL_PART_GAME_ID}/current-live`,
  GAME_CONFIG_PREVIOUS_LIVE: `/game-config/${URL_PART_APP_ID}/${URL_PART_GAME_ID}/previous-live`,
  GAME_CONFIG_CURRENT_TEST: `/game-config/${URL_PART_APP_ID}/${URL_PART_GAME_ID}/current-test`,

  EVENTS_ROUTE:"/events-root",
  EVENTS: `/events/${URL_PART_APP_ID}`,
  EVENTS_CHOOSE_TYPE: `/choose-event-type/${URL_PART_APP_ID}`,
  CREATE_EVENT: `/create-event/${URL_PART_APP_ID}`,
  EDIT_EVENT: `/event/${URL_PART_APP_ID}/:id`, // todo refactor :id
  VIEW_CASH_PRODUCTS: `/cash-products/${URL_PART_APP_ID}`,

  RELEASES: "/releases",

  ANALYTICS: `/analytics/${URL_PART_APP_ID}`,
  ANALYTICS_volume: `/analytics-volume/${URL_PART_APP_ID}`,
  ANALYTICS_app_performance: `/analytics-app-performance/${URL_PART_APP_ID}`,
  ANALYTICS_engagement: `/analytics-engagement/${URL_PART_APP_ID}`,
  ANALYTICS_retention: `/analytics-retention/${URL_PART_APP_ID}`,
  ANALYTICS_monetization: `/analytics-monetization/${URL_PART_APP_ID}`,
  ANALYTICS_source_wise: `/analytics-source-wise/${URL_PART_APP_ID}`,
  ANALYTICS_virtual_currency: `/analytics-virtual_currency/${URL_PART_APP_ID}`,
  ANALYTICS_viral: `/analytics-viral/${URL_PART_APP_ID}`,
  ANALYTICS_others: `/analytics-others/${URL_PART_APP_ID}`,

  RELEASES_VIEW: "/releases/:platform",
  RELEASES_CREATE: "/create-release",
  RELEASES_EDIT: "/release/:id",

  USERS: `/users/${URL_PART_APP_ID}`,
  USER_DETAILS: `/user/${URL_PART_APP_ID}`,
  USER_WALLET: `/user/${URL_PART_APP_ID}/wallet`,
  USER_CURRENCY: `/user/${URL_PART_APP_ID}/currency`,
  USER_ACCESS: `/user/${URL_PART_APP_ID}/access`,
  USERS_MANAGEMENT: `/user/${URL_PART_APP_ID}/management`,

  SETTINGS: `/settings`,

  TEAM_ACCESS_CONTROL_MANAGEMENT: `/settings/team-access-control-management`,
  LOGIN: "/auth/sign-in",
  SIGNUP: "/auth/sign-up",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  VERIFY_OTP: "/auth/verifyOtp",
  VERIFY_MAIL: "/auth/verifyEmail",
  CONFIRM_MAIL: "/verifyAccount",

  CHALLENGES: `/challenges/${URL_PART_APP_ID}`,
  CREATE_CHALLENGE: `/create-challenge/${URL_PART_APP_ID}`,
  EDIT_CHALLENGE: `/challenge/${URL_PART_APP_ID}/${URL_PART_CHALLENGE_ID}`,

  LEADERBOARDS: `/leaderboards/${URL_PART_APP_ID}`,
  CREATE_LEADERBOARD: `/create-leaderboard/${URL_PART_APP_ID}`,
  EDIT_LEADERBOARD: `/leaderboard/${URL_PART_APP_ID}/:id`,

  DOCS: "/dev-docs",
  DOCS_UNITY_HARNESS: `${CONSTANTS.DOCS[getclixlogix-samplecodeEnv()].url}`,
  DOCS_NATIVE_HARNESS: `${CONSTANTS.DOCS[getclixlogix-samplecodeEnv()].url}`,

  DOCS_STATIC: "/docs",
  DOCS_STATIC_UNITY_HARNESS: `${CONSTANTS.DOCS[getclixlogix-samplecodeEnv()].url}`,
  DOCS_STATIC_NATIVE_HARNESS: `${CONSTANTS.DOCS[getclixlogix-samplecodeEnv()].url}`,

  NFT_PUBLISHING_SERVICES: "/docs/nft-publishing-services",
  BLOCKCHAIN_WALLET_SERVICES: "/blockchain-wallet-services",
};


export const GAME_VERSION_FROM_ROUTE: any = {};
GAME_VERSION_FROM_ROUTE[ROUTES.GAME_CONFIG_CREATE] = "-CREATE-";
GAME_VERSION_FROM_ROUTE[ROUTES.GAME_CONFIG_DRAFT] = EVersions.DRAFT;
GAME_VERSION_FROM_ROUTE[ROUTES.GAME_CONFIG_CURRENT_LIVE] = EVersions.LIVE;
GAME_VERSION_FROM_ROUTE[ROUTES.GAME_CONFIG_PREVIOUS_LIVE] = EVersions.LAST_LIVE;
GAME_VERSION_FROM_ROUTE[ROUTES.GAME_CONFIG_CURRENT_TEST] =
  EVersions.PREVIEW_LIVE;
