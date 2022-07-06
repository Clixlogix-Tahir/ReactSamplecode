import { TFormFieldString } from "../../types/formFields";
import { TAppDetails, TAppDetailsRequest, TAppForm } from "./appManagementTypes";

export const toAppManagementForm = (app: TAppDetails): TAppForm => {
  const stringField: TFormFieldString = {
    value: '',
    error: '',
    required: false,
  };
  const form: TAppForm = {
    appId: { ...stringField, value: app.appId },
    //currency: { ...stringField, value: app.currency },
    firebaseProjectId: { ...stringField, value: app.firebaseProjectId },
    biTestAppId: { ...stringField, value: app.biTestAppId },
    biTestAppToken: { ...stringField, value: app.biTestAppToken },
    appParamUrl: { ...stringField, value: app.appParamUrl },
    appDisplayName: { ...stringField, value: app.appDisplayName },
    companyId: { ...stringField, value: app.companyId },
    //currencyDisplayName: { ...stringField, value: app.currencyDisplayName },
    biAppId: { ...stringField, value: app.biAppId },
    biAppToken: { ...stringField, value: app.biAppToken },
    releasedAs: { ...stringField, value: app.releasedAs },
    tapjoyAndroidAppId: { ...stringField, value: app.tapjoyAndroidAppId },
    tapjoyIOSAppId: { ...stringField, value: app.tapjoyIOSAppId },
    tapjoySecretIOS: { ...stringField, value: app.tapjoySecretIOS },
    tapjoySecretAndroid: { ...stringField, value: app.tapjoySecretAndroid },
    screenOrientation: { ...stringField, value: app.screenOrientation },
    gameURL: { ...stringField, value: app.gameURL },
    domainAddress: { ...stringField, value: app.domainAddress },
    appleStoreName: { ...stringField, value: app.appleStoreName },
    appleId: { ...stringField, value: app.appleId },
    moengageAppIdDataApiId: { ...stringField, value: app.moengageAppIdDataApiId },
    moengageApiSecret: { ...stringField, value: app.moengageApiSecret },
    dataApiKey: { ...stringField, value: app.dataApiKey },
    adjustAppToken: { ...stringField, value: app.adjustAppToken },
    branchAppId: { ...stringField, value: app.branchAppId },
    branchKey: { ...stringField, value: app.branchKey },
    branchSecret: { ...stringField, value: app.branchSecret },
    biManagementURL: { ...stringField, value: app.biManagementURL },
    zeplinURL: { ...stringField, value: app.zeplinURL },
    basicAuthenticationHeaderGenerator: { ...stringField, value: app.basicAuthenticationHeaderGenerator },
    androidApkLink: { ...stringField, value: app.androidApkLink },
    facebookPixelId: { ...stringField, value: app.facebookPixelId },
    snapchatPixelId: { ...stringField, value: app.snapchatPixelId },

    //urls
    virtualCurrencyImage: { ...stringField, value:  "" },
    ticketImage: { ...stringField, value:  "" },
    realCurrencyImage: { ...stringField, value:  "" },
    virtualCurrencyMultiplierIconImage: { ...stringField, value:  "" },
    xpIconImage: { ...stringField, value: "" },
    xpMultiplierIconImage: { ...stringField, value: "" }
  };
  return form;
};

export const toAppDetailsRequest = (appDetails: TAppForm): TAppDetailsRequest => {
  const app: TAppDetailsRequest = {
    appId: appDetails.appId.value,
    firebaseProjectId: appDetails.firebaseProjectId.value,
    biTestAppId: appDetails.biTestAppId.value,
    biTestAppToken: appDetails.biTestAppToken.value,
    appParamUrl: appDetails.appParamUrl.value,
    appDisplayName: appDetails.appDisplayName.value,
    companyId: appDetails.companyId.value,
    biAppId: appDetails.biAppId.value,
    biAppToken: appDetails.biAppToken.value,
    releasedAs: appDetails.releasedAs.value,
    tapjoyAndroidAppId: appDetails.tapjoyAndroidAppId.value,
    tapjoyIOSAppId: appDetails.tapjoyIOSAppId.value,
    tapjoySecretIOS: appDetails.tapjoySecretIOS.value,
    tapjoySecretAndroid: appDetails.tapjoySecretAndroid.value,
    screenOrientation: appDetails.screenOrientation.value,
    gameURL: appDetails.gameURL.value,
    domainAddress: appDetails.domainAddress.value,
    appleStoreName: appDetails.appleStoreName.value,
    appleId: appDetails.appleId.value,
    moengageAppIdDataApiId: appDetails.moengageAppIdDataApiId.value,
    moengageApiSecret: appDetails.moengageApiSecret.value,
    dataApiKey: appDetails.dataApiKey.value,
    adjustAppToken: appDetails.adjustAppToken.value,
    branchAppId: appDetails.branchAppId.value,
    branchKey: appDetails.branchKey.value,
    branchSecret: appDetails.branchSecret.value,
    biManagementURL: appDetails.biManagementURL.value,
    zeplinURL: appDetails.zeplinURL.value,
    basicAuthenticationHeaderGenerator: appDetails.basicAuthenticationHeaderGenerator.value,
    androidApkLink: appDetails.androidApkLink.value,
    facebookPixelId: appDetails.facebookPixelId.value,
    snapchatPixelId: appDetails.snapchatPixelId.value,
    urls: {
      virtualCurrencyImage: "",
      ticketImage: "",
      realCurrencyImage: "",
      virtualCurrencyMultiplierIconImage: "",
      xpIconImage: "",
      xpMultiplierIconImage: ""
    },
  };
  console.info('app', app);
  return app;
};