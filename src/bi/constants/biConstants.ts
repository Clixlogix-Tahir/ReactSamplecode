import { TBiApiFields } from "../types/types";

export const EVENT_NAME = 'Event name';

export const BLITZ_DASHBOARD_TEST_URL = "https://blitzbi-test.useblitz.com";

export const BLITZ_DASHBOARD_PROD_URL = "https://prod-blitzbi-infra.useblitz.com";

export const BLITZ_DASHBOARD_AUTH_COOKIE = "X-AUTH-TOKEN";

export const AUTHORIZATION = "Authorization";

export const APP_TOKEN = "app_token";

export const EVENT_TOKEN = "event_token";

export const BLITZ_APP_ID = "blitzAppId";

export const BLITZ_APP_TOKEN = "blitzAppToken";

//TODO : currently for Dev Onboarding Bi events we are using commerce website BiAppId and BiAppToken
export const testEnvBiVars: TBiApiFields = {
    'baseUrl': BLITZ_DASHBOARD_TEST_URL,
    "biAppId": 103,
    "biAppToken": "b7090022-d8d4-4f65-a508-f097a01625ae",
}

export const prodEnvBiVars: TBiApiFields = {
    'baseUrl': BLITZ_DASHBOARD_PROD_URL,
    "biAppId": 33,
    "biAppToken": "e54870ef-cbeb-4db3-9bf5-9c995e2a1b80"
}

export enum EBoolean {
    TRUE = 'TRUE',
    FALSE = 'FALSE',
};

export enum ESignupFormFields {
    FIRST_NAME = 'firstName',
    LAST_NAME = 'lastName',
    EMAIL = 'email',
    CONFIRM_EMAIL = 'confirmEmail',
};

export enum EWebsiteTabNames {
    ACCOUNT_BALANCE_WALLET = 'account_balance_wallet',
    COLLECTIBLES = 'collectibles',
    HISTORY = 'history',
    LOGIN = 'login',
    SIGNUP = 'signup',
};

export enum ECtaNames {
    SIGN_UP = 'sign_up',
    LOGIN = 'login',
    BUY = 'buy',
    LEARN_MORE = 'learn_more',
    RESEND_OTP = 'resend_otp',
    ONBOARDING = 'onboarding',
    TRANSFER = 'transfer',
    CONTINUE = 'continue',
    SUBMIT = 'submit',
    TOGGLE = 'toggle',
    COPY_TO_CLIPBOARD = 'copy_to_clipboard',
    WITHDRAW = 'withdraw',
    GO_BACK = 'go_back',
    LOGOUT = 'logout',
};

export const biColumnsStaticFields = {

    eventNames: {
        DEVELOPER_ONBOARDING: 'developer_onboarding',
    },

    strField0Types: {
        VIEW_OPEN: 'view_open',
        CLICK: 'click',
    },

    strField1Types: {
        SIGNIN: 'sign_in',
        SIGNUP: 'sign_up',
        LOGIN: 'log_in',
        GET_STARTED: 'get_started',
        VERIFY_EMAIL: 'verify_email',
        RESEND_EMAIL: 'resend_email',
        ACCOUNT_ACTIVATED: 'account_activated',
        ADD_GAME_VIEW: 'add_game_view',
        SUBMIT: 'submit',
        ADD_ORGANIZATION_VIEW: 'add_organization_view',
        GAME_REQUEST_SUBMITTED_VIEW: 'game_request_submitted_view',
    },

    strField2Types: {
        SIGNUP: 'sign_up',
        LOGIN: 'log_in',
        ACCOUNT_ACTIVATED: 'account_activated',
        VERIFY_EMAIL: 'verify_email',
        ADD_GAME_VIEW: 'add_game_view',
        ADD_ORGANIZATION_VIEW: 'add_organization_view',
    },

};

export const biFieldNames = {
    EVENT_NAME: 'event_name',

    STR_FIELD_0: 'str_field0',
    STR_FIELD_1: 'str_field1',
    STR_FIELD_2: 'str_field2',
    STR_FIELD_3: 'str_field3',
    STR_FIELD_4: 'str_field4',
    STR_FIELD_5: 'str_field5',
    STR_FIELD_6: 'str_field6',
    STR_FIELD_7: 'str_field7',
    STR_FIELD_8: 'str_field8',
    STR_FIELD_9: 'str_field9',
    STR_FIELD_10: 'str_field10',
    STR_FIELD_11: 'str_field11',
    STR_FIELD_12: 'str_field12',
    STR_FIELD_13: 'str_field13',
    STR_FIELD_14: 'str_field14',
    STR_FIELD_15: 'str_field15',
    STR_FIELD_16: 'str_field16',
    STR_FIELD_17: 'str_field17',
    STR_FIELD_18: 'str_field18',
    STR_FIELD_19: 'str_field19',
    STR_FIELD_20: 'str_field20',
    STR_FIELD_21: 'str_field21',
    STR_FIELD_22: 'str_field22',
    STR_FIELD_23: 'str_field23',
    STR_FIELD_24: 'str_field24',

    INT_FIELD_0: 'int_field0',
    INT_FIELD_1: 'int_field1',
    INT_FIELD_2: 'int_field2',
    INT_FIELD_3: 'int_field3',
    INT_FIELD_4: 'int_field4',
    INT_FIELD_5: 'int_field5',
    INT_FIELD_6: 'int_field6',
    INT_FIELD_7: 'int_field7',
    INT_FIELD_8: 'int_field8',
    INT_FIELD_9: 'int_field9',
    INT_FIELD_10: 'int_field10',
    INT_FIELD_11: 'int_field11',
    INT_FIELD_12: 'int_field12',
    INT_FIELD_13: 'int_field13',
    INT_FIELD_14: 'int_field14',
    INT_FIELD_15: 'int_field15',
    INT_FIELD_16: 'int_field16',
    INT_FIELD_17: 'int_field17',
    INT_FIELD_18: 'int_field18',
    INT_FIELD_19: 'int_field19',

    FLOAT_FIELD_0: 'float_field0',
    FLOAT_FIELD_1: 'float_field1',
    FLOAT_FIELD_2: 'float_field2',
    FLOAT_FIELD_3: 'float_field3',
    FLOAT_FIELD_4: 'float_field4',
    FLOAT_FIELD_5: 'float_field5',
    FLOAT_FIELD_6: 'float_field6',
    FLOAT_FIELD_7: 'float_field7',
    FLOAT_FIELD_8: 'float_field8',
    FLOAT_FIELD_9: 'float_field9',
    FLOAT_FIELD_10: 'float_field10',
    FLOAT_FIELD_11: 'float_field11',
    FLOAT_FIELD_12: 'float_field12',
    FLOAT_FIELD_13: 'float_field13',
    FLOAT_FIELD_14: 'float_field14',
    FLOAT_FIELD_15: 'float_field15',
};