import GamesIcon from "@material-ui/icons/Games";
import React from "react";
// import {
//   useAppSelector
// } from '../common/hooks';
// import { TCmsRole } from "../pages/team-access-control-management/teamAccessControlTypes";
// import { ECmsRoles } from "../types/eventTypes";
import {
  Clock,
  BookOpen,
  Monitor,
  Sliders,
  Package,
  PieChart,
  User,
  MessageSquare,
  Users,
  Award,
  Home,
} from "react-feather";
import { ROUTES } from "../common/constants";
import async from "../components/Async";
import { Announcement, Brush } from "@material-ui/icons";

// Auth components
const SignIn = async(() => import("../pages/auth/SignInForm"));
const OtpVerificationForm = async(() => import("../pages/auth/OtpVerificationForm"));
const SignUp = async(() => import("../pages/auth/SignUpForm"));
const ForgotPassword = async(() => import("../pages/auth/ForgotPassword"));
const ResetPassword = async(() => import("../pages/auth/ResetPassword"));
const Page404 = async(() => import("../pages/auth/Page404"));
const Page500 = async(() => import("../pages/auth/Page500"));
const VerifyEmail = async(() => import("../pages/auth/VerifyEmail"));
const MailConfirm = async(() => import("../pages/auth/MailConfirm"));

const Overview = async(() => import("../pages/overview"));
const CreateApp = async(() => import("../pages/overview/create-app"));
const AppManagement = async(() => import("../pages/app-management"));
const AppDetails = async(() => import("../pages/app-management/app-details"));
const AppXpAndRewards = async(
  () => import("../pages/app-management/xp-and-rewards")
);
const AppDailyCheckins = async(
  () => import("../pages/app-management/daily-checkins/index")
);
const GameConfig = async(() => import("../pages/game-config"));
const GameCreate = async(() => import("../pages/request/AddGame"));
const AddOrg = async(() => import("../pages/request/AddOrganization"));
const RequestSuccess = async(
  () => import("../pages/request/GameRequestSuccess")
);
const PendingRequest = async(() => import("../pages/request/PendingGame"));
const ManageRequest = async(()=>import("../pages/request/ManageRequest"))

const UserProfile = async(() => import("../pages/Details/UserProfile"));
const OrganizationDetails = async(() => import("../pages/Details/OrganizationDetails"))

const CustomTheme = async(() => import("../pages/CustomTheme/CustomTheme"));

const Events = async(() => import("../pages/events/index-events"));
const Leaderboards = async(() => import("../pages/events/index-leaderboards"));
const ChooseEventType = async(() => import("../pages/events/chooseEventType"));
const CreateEvent = async(() => import("../pages/events/create/event/create-event-container"));
const CreateLeaderboard = async(() => import("../pages/events/create/leaderboard/create-leaderboard-container"));
const CashProducts = async(() => import("../pages/events/cashProducts"));
const Blank = async(() => import("../pages/pages/Blank"));
const DocsJr = async(() => import("../pages/docs-jr"));
const Welcome = async(() => import("../pages/docs/Welcome"));
// const Landing = async(() => import("../pages/landing/index"));
const Analytics = async(() => import("../pages/analytics"));
const AnalyticsTab = async(() => import("../pages/analytics/analytics-tab"));
const UserAccounts = async(() => import("../pages/user-accounts"));
const UserDetails = async(() => import("../pages/user-accounts/user-details"));
const UserWallet = async(() => import("../pages/user-accounts/user-wallet"));
const UserCurrency = async(
  () => import("../pages/user-accounts/user-currency")
);
const UserAccess = async(() => import("../pages/user-accounts/access/index"));
const UserModeration = async(
  () => import("../pages/user-accounts/user-moderation")
);
const TeamAccessControlManagement = async(
  () => import("../pages/team-access-control-management/index")
);
const Challenges = async(() => import("../pages/challenges"));
const CreateOrEditChallenge = async(() => import("../pages/challenges/create-or-edit"));
const BlockchainWalletServices = async(() => import("../pages/more-services/BlockchainWalletServices"));
const NftPublishingServices = async(() => import("../pages/more-services/NftPublishingServices"));
// const Releases = async(() => import("../pages/releases"));
// const CreateOrEditRelease = async(() => import("../pages/releases/createOrEdit"));

const appManagementRoutes = {
  id: "App Details",
  path: ROUTES.APP_MANAGEMENT,
  icon: <Package />,
  children: null,
  component: AppManagement,
};

const overviewRoute = {
  id: "Overview",
  path: ROUTES.OVERVIEW,
  icon: <Home />,
  children: null,
  component: Overview,
};
const userProfileRoute = {
  id: "User Profile",
  path: ROUTES.VIEW_USER_PROFILE,
  icon: null,
  children: null,
  component: UserProfile,
};
const organizationDetailRoute = {
  id: "Organization Details",
  path: ROUTES.ORGANIZATION_DETAILS,
  icon: null,
  children: null,
  component: OrganizationDetails,
};

const createAppRoute = {
  id: "Overview",
  path: ROUTES.CREATE_APP,
  icon: <Home />,
  children: null,
  component: CreateApp,
};



const addOrganizationRoute = {
  id: "Request",
  path: ROUTES.RQUEST_ADD_ORGANIZATION,
  icon: null,
  children: null,
  component: AddOrg,
};
const requestSuccessRoute = {
  id: "Dashboard",
  path: ROUTES.RQUEST_SUCCESS,
  icon: null,
  children: null,
  component: RequestSuccess,
};

//todo : change the naming of routes
const appDetailsRoute = {
  id: "App Details",
  path: ROUTES.APP_DETAILS,
  icon: <Package />,
  children: null,
  component: AppDetails,
};

const appXpAndRewardsRoute = {
  id: "App Xp and Rewards",
  path: ROUTES.APP_XP_AND_REWARDS,
  icon: <Package />,
  children: null,
  component: AppXpAndRewards,
};

const appDailyCheckinsRoute = {
  id: "App Daily Checkins",
  path: ROUTES.APP_DAILY_CHECKINS,
  icon: <Package />,
  children: null,
  component: AppDailyCheckins,
};
const requestRoutes = {
  id: "Request",
  path: ROUTES.REQUEST,
  icon: <Announcement />,
  containsHome: true,
  children: [
    {
      path: ROUTES.REQUEST_ADD_GAME_REQUEST,
      name: "Add Game",
      component: GameCreate,
    }, 
    {
      path: ROUTES.REQUEST_PENDING_REQUEST,
      name: "Game Requests",
      component: PendingRequest,
    },
    {
      path: ROUTES.REQUEST_MANAGEMENT,
      name: "Request Management",
      component: ManageRequest,
    },
  ],
  childrenNotVisibleInSidebar: [
    {
      id: "Request",
      path: ROUTES.RQUEST_ADD_ORGANIZATION,
      icon: null,
      children: null,
      component: AddOrg,
    },
  ],
  component: null,
};
const customThemeRoute = {
  id: "Custom Theme",
  path: ROUTES.CUSTOM_THEME,
  icon: <Brush />,
  component: CustomTheme,
  children: null,
};
const gameConfigRoutes = {
  id: "Game Config",
  path: ROUTES.GAME_CONFIG,
  icon: <GamesIcon />,
  containsHome: true,
  children: [
    {
      path: ROUTES.GAME_CONFIG_CREATE,
      name: "Create",
      component: GameConfig,
    },
    {
      path: ROUTES.GAME_CONFIG_DRAFT,
      name: "Edit",
      component: GameConfig,
    },
  ],
  component: null,
};

const gcCurrLiveRoute = {
  id: "Current Live",
  path: ROUTES.GAME_CONFIG_CURRENT_LIVE,
  // name: "Current Live",
  component: GameConfig,
  children: null,
};

const gcPrevLiveRoute = {
  id: "Previous Live",
  path: ROUTES.GAME_CONFIG_PREVIOUS_LIVE,
  // name: "Current Live",
  component: GameConfig,
  children: null,
};

const gcCurrTestRoute = {
  id: "Current Test",
  path: ROUTES.GAME_CONFIG_CURRENT_TEST,
  // name: "Current Live",
  component: GameConfig,
  children: null,
};

const eventsRoutes = {
  id: "Events",
  path: ROUTES.EVENTS_ROUTE,
  icon: <Clock />,
  children: [
    {
      path: ROUTES.EVENTS_CHOOSE_TYPE,
      name: "Create Event",
      component: ChooseEventType,
    },
    {
      path: ROUTES.EVENTS,
      name: "Events",
      component: Events,
    },
    {
      path: ROUTES.VIEW_CASH_PRODUCTS,
      name: "Products",
      component: CashProducts,
    },
  ],
  childrenNotVisibleInSidebar: [
    {
      path: ROUTES.CREATE_EVENT,
      name: "Create Selected Event",
      component: CreateEvent,
    },
    {
      path: ROUTES.EDIT_EVENT,
      name: "Edit Event",
      component: CreateEvent,
    },
  ],
  component: null,
};

const moreRoutes = {
  id: "More Services",
  path: "/more-services",
  icon: <Clock />,
  children: [
    {
      path: ROUTES.BLOCKCHAIN_WALLET_SERVICES,
      name: "Blockchain Wallet",
      component: BlockchainWalletServices,
    },
    {
      path: ROUTES.NFT_PUBLISHING_SERVICES,
      name: "NFT Publishing",
      component: NftPublishingServices,
    },
  ],
  component: null
};

const createEventRoute = {
  id: "Create Selected Event",
  path: ROUTES.CREATE_EVENT,
  icon: <PieChart />,
  // badge: "8",
  component: CreateEvent,
  children: null,
};

const editEventRoute = {
  id: "Edit Event",
  path: ROUTES.EDIT_EVENT,
  component: CreateEvent,
  children: null,
};

const leaderboardsRoute = {
  id: "Leaderboards",
  path: ROUTES.LEADERBOARDS,
  icon: <Monitor />,
  // badge: "8",
  component: Leaderboards,
  children: null
};

const createLeaderboardRoute = {
  id: "Create Leaderboard",
  path: ROUTES.CREATE_LEADERBOARD,
  icon: <PieChart />,
  // badge: "8",
  component: CreateLeaderboard,
  children: null
};

const editLeaderboardRoute = {
  id: "Edit Leaderboard",
  path: ROUTES.EDIT_LEADERBOARD,
  icon: <PieChart />,
  // badge: "8",
  component: CreateLeaderboard,
  children: null
};

const analyticsRoutes = {
  id: "Analytics",
  path: ROUTES.ANALYTICS,
  icon: <PieChart />,
  // badge: "8",
  component: Analytics,
  children: [
    {
      path: ROUTES.ANALYTICS,
      name: "Overview",
      component: AnalyticsTab,
    },
    {
      path: ROUTES.ANALYTICS_volume,
      name: "Volume",
      component: AnalyticsTab,
    },
    {
      path: ROUTES.ANALYTICS_app_performance,
      name: "App Performance",
      component: AnalyticsTab,
    },
    {
      path: ROUTES.ANALYTICS_engagement,
      name: "Engagement",
      component: AnalyticsTab,
    },
    {
      path: ROUTES.ANALYTICS_monetization,
      name: "Monetization",
      component: AnalyticsTab,
    },
    {
      path: ROUTES.ANALYTICS_retention,
      name: "Retention",
      component: AnalyticsTab,
    },
    {
      path: ROUTES.ANALYTICS_source_wise,
      name: "Source-wise",
      component: AnalyticsTab,
    },
    {
      path: ROUTES.ANALYTICS_virtual_currency,
      name: "Virtual Currency",
      component: AnalyticsTab,
    },
    {
      path: ROUTES.ANALYTICS_viral,
      name: "Viral",
      component: AnalyticsTab,
    },
    {
      path: ROUTES.ANALYTICS_others,
      name: "Others",
      component: AnalyticsTab,
    },
  ],
};

const usersRoutes = {
  id: "Users",
  path: ROUTES.USERS,
  icon: <Users />,
  children: null,
  component: UserAccounts,
};

const userDetailsRoutes = {
  id: "User Details",
  path: ROUTES.USER_DETAILS,
  icon: <User />,
  children: null,
  component: UserDetails,
};

const userWalletRoutes = {
  id: "User Wallet",
  path: ROUTES.USER_WALLET,
  icon: <User />,
  children: null,
  component: UserWallet,
};

const userCurrencyRoutes = {
  id: "User Currency Details",
  path: ROUTES.USER_CURRENCY,
  icon: <User />,
  children: null,
  component: UserCurrency,
};

const userAccessRoutes = {
  id: "User Access Controls",
  path: ROUTES.USER_ACCESS,
  icon: <User />,
  children: null,
  component: UserAccess,
};

const userModerationRoutes = {
  id: "User Moderation",
  path: ROUTES.USERS_MANAGEMENT,
  icon: <User />,
  children: null,
  component: UserModeration,
};

const challengesRoutes = {
  id: "Challenges",
  path: ROUTES.CHALLENGES,
  icon: <Award />,
  children: null,
  component: Challenges,
};

const createChallengeRoute = {
  id: "Create Challenge",
  path: ROUTES.CREATE_CHALLENGE,
  icon: <PieChart />,
  // badge: "8",
  component: CreateOrEditChallenge,
  children: null,
};

const editChallengeRoute = {
  id: "Edit Challenge",
  path: ROUTES.EDIT_CHALLENGE,
  component: CreateOrEditChallenge,
  children: null,
};

// const leaderboardsRoutes = {
//   id: "Leaderboards",
//   path: ROUTES.LEADERBOARDS,
//   icon: <MoreVertical />,
//   children: null,
//   component: Leaderboards
// };

// const createLeaderboardsRoute = {
//   id: "Create Leaderboard",
//   path: ROUTES.CREATE_LEADERBOARDS,
//   component: CreateOrEditLeaderboard,
//   children: null
// };

// const editLeaderboardsRoute = {
//   id: "Edit Leaderboard",
//   path: ROUTES.EDIT_LEADERBOARDS,
//   component: CreateOrEditLeaderboard,
//   children: null,
// };

// const releaseRoutes = {
//   id: "Releases",
//   icon: <Cloud />,
//   path: "/releases-root",
//   children: [
//     {
//       path: ROUTES.RELEASES_VIEW,
//       name: "View",
//       component: Releases,
//     },
//     {
//       path: ROUTES.RELEASES_CREATE,
//       name: "Create",
//       component: CreateOrEditRelease,
//     },
//   ],
//   component: null
// };

// const releaseEditRoute = {
//   id: "User Moderation",
//   path: ROUTES.RELEASES_EDIT,
//   icon: <User />,
//   children: null,
//   component: CreateOrEditRelease
// };

const authRoutes = {
  id: "Auth",
  path: "/auth",
  icon: <Users />,
  children: [
    {
      path: ROUTES.LOGIN,
      name: "Sign In",
      component: SignIn,
    },
    {
      path: ROUTES.VERIFY_OTP,
      name: "Verify OTP",
      component: OtpVerificationForm,
    },
    {
      path: ROUTES.SIGNUP,
      name: "Sign Up",
      component: SignUp,
    },
    {
      path: ROUTES.FORGOT_PASSWORD,
      name: "Reset Password",
      component: ForgotPassword,
    },
    {
      path: ROUTES.RESET_PASSWORD,
      name: "Reset Password",
      component: ResetPassword,
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404,
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500,
    },
    {
      path: ROUTES.VERIFY_MAIL,
      name: "Verify Email",
      component: VerifyEmail,
    },
    {
      path: ROUTES.CONFIRM_MAIL,
      name: "Mail Confirm",
      component: MailConfirm,
    },
  ],
  component: null,
};

const learningRoutes = {
  id: "Documentation",
  // path: ROUTES.DOCS,
  path: ROUTES.DOCS_NATIVE_HARNESS,
  icon: <BookOpen />,
  children: null,
  component: DocsJr,
  externalLink: true,
};

// docs page when signed out
const learningRoutesStatic = {
  id: "Documentation",
  path: ROUTES.DOCS_STATIC,
  icon: <BookOpen />,
  children: null,
  component: null,
  externalLink: true,
};

/** docs page when signed out
 * this page has links to all the guides
 */
const docsRootSignedOutRoutes = {
  id: "Docs Root Signed Out",
  path: ROUTES.DOCS_STATIC,
  icon: <BookOpen />,
  // component: Landing,
  component: DocsJr,
  children: null,
  externalLink: true,
};

const landingPageRoutes = {
  id: "Landing",
  path: "/",
  icon: <Monitor />,
  // component: Landing,
  component: SignIn,
  children: null,
};

const supportRoutes = {
  id: "Support",
  path: "/support",
  icon: <MessageSquare />,
  children: null,
  component: Welcome,
};

// This route is not visisble in the sidebar
const privateRoutes = {
  id: "Private",
  path: "/private",
  component: Blank,
  children: null,
};

const teamAccessControlManagementRoutes = {
  id: "Settings",
  path: ROUTES.TEAM_ACCESS_CONTROL_MANAGEMENT,
  // badge: "v1.2.0",
  icon: <Sliders />,
  children: null,
  component: TeamAccessControlManagement,
};

// Routes using the Dashboard layout
export const staticRoutes = [landingPageRoutes];
export const dashboardLayoutRoutes = [
  overviewRoute,
  customThemeRoute,
  userProfileRoute,
  organizationDetailRoute,
  requestRoutes,
  createAppRoute,
  addOrganizationRoute,
  requestSuccessRoute,
  appManagementRoutes,
  appDetailsRoute,
  appXpAndRewardsRoute,
  appDailyCheckinsRoute,
  gameConfigRoutes,
  gcCurrLiveRoute,
  gcPrevLiveRoute,
  gcCurrTestRoute,
  eventsRoutes,
  createEventRoute,
  editEventRoute,
  leaderboardsRoute,
  createLeaderboardRoute,
  editLeaderboardRoute,
  analyticsRoutes,
  usersRoutes,
  userDetailsRoutes,
  userWalletRoutes,
  userCurrencyRoutes,
  userAccessRoutes,
  userModerationRoutes,
  challengesRoutes,
  createChallengeRoute,
  editChallengeRoute,
  // releaseRoutes,
  // releaseEditRoute,
  learningRoutes,
  supportRoutes,
  teamAccessControlManagementRoutes,
  landingPageRoutes,
  moreRoutes,
  privateRoutes
];

// Routes using the Auth layout
export const authLayoutRoutes = [
  authRoutes,
  learningRoutesStatic,
  docsRootSignedOutRoutes,
];

// Routes visible in the sidebar
export const sidebarRoutes = [
  overviewRoute,
  requestRoutes,
  customThemeRoute,
  appManagementRoutes,
  gameConfigRoutes,
  eventsRoutes,
  analyticsRoutes,
  usersRoutes,
  challengesRoutes,
  leaderboardsRoute,
  // releaseRoutes,  // todo all files in src/releases might be redundant
  learningRoutes,
  // supportRoutes,
  moreRoutes,
  teamAccessControlManagementRoutes,
];
