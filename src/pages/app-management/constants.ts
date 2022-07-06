
export const AppDetailFormColumnNames: string[][] = [
    ['firebaseProjectId', 'Firebase Project Id'],
    ['biTestAppId', 'BI Test App Id'],
    ['biTestAppToken', 'BI Test App Token'],
    ['appParamUrl', 'App Param URL'],
    ['appDisplayName', 'App Display Name'],
    ['companyId', 'Company ID'],
    ['biAppId', 'BI App Id'],
    ['biAppToken', 'BI App Token'],
    ['releasedAs', 'Released As'],
    ['tapjoyAndroidAppId', 'Tapjoy Android App Id'],
    ['tapjoyIOSAppId', 'Tapjoy IOS App Id'],
    ['tapjoySecretIOS', 'Tapjoy Secret IOS'],
    ['tapjoySecretAndroid', 'Tapjoy Secret Android'],
    ['screenOrientation', 'Screen Orientation'],
    ['gameURL', 'Game URL'],
    ['domainAddress', 'Domain Address'],
    ['appleStoreName', 'Apple Store Name'],
    ['appleId', 'Apple Id'],
    ['moengageAppIdDataApiId', 'Moengage API Id'],
    ['moengageApiSecret', 'Moengage Api Secret'],
    ['dataApiKey', 'Data Api Key'],
    ['adjustAppToken', 'Adjust App Token'],
    ['branchAppId', 'branchAppId'],
    ['branchKey', 'branchKey'],
    ['branchSecret', 'branchSecret'],
    ['biManagementURL', 'BI Management URL'],
    ['zeplinURL', 'Zeplin URL'],
    ['basicAuthenticationHeaderGenerator', 'Basic Auth Header Generator'],
    ['androidApkLink', 'Android Apk Link'],
    ['facebookPixelId', 'Facebook Pixel Id'],
    ['snapchatPixelId', 'Snapchat Pixel Id'],
    ['urls', 'Urls'],
]

export enum DIALOG_POPUP_TEXT {
    DELETE_A_LEVEL = 'All the rewards for the selected level will be removed. Do you want to proceed?',
}

export enum ERewardTypesForDropDown {
    NONE = '',
    DEPOSIT_CASH = 'Deposit Cash',
    BONUS_CASH = 'Bonus Cash',
    COIN = 'COIN',
    RLY = 'RLY', // TOOD currency in this enum is looking odd
    TICKET = 'TICKET',
    XX_COINS_15_MINUTES = '2x Coins for 15 min',
    XX_COINS_30_MINUTES = '2x Coins for 30 min',
    XX_XP_15_MINUTES = '2x XP for 15 min',
    XX_XP_30_MINUTES = '2x XP for 30 min',
}

export enum imageUrlFields {
    REAL_CURRENCY_IMAGE = 'realCurrencyImage',
    VIRTUAL_CURRENCY_IMAGE = 'virtualCurrencyImage',
    TICKET_IMAGE = 'ticketImage',
    VIRTUAL_CURRENCY_MULTIPLIER_ICON_IMAGE = 'virtualCurrencyMultiplierIconImage',
    XP_ICON_IMAGE = 'xpIconImage',
    XP_MULTIPLIER_ICON_IMAGE = 'xpMultiplierIconImage'
}

export const acceptedTypes: string[] = [
    'image/png',
    'image/jpeg',
];

export const maxRewardSetsAllowed = 10;
export const maxSlotsAllowed = 20;
