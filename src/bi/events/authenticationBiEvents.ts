//import constants from '../../constants';
import { biApi } from "../api/bi";
import { biColumnsStaticFields } from "../constants/biConstants";
import { TBiEvent } from "../types/types";

export const authenticationBiEvents = {

    signupTab: () => {
        let biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.VIEW_OPEN,
            str_field1: biColumnsStaticFields.strField1Types.SIGNUP,
        };
        let successMesg = "dev is on signup tab";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    loginTab: () => {
        let biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.VIEW_OPEN,
            str_field1: biColumnsStaticFields.strField1Types.LOGIN,
        };
        let successMesg = "dev is on login tab";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    signupInfoEntered: (email: string, name: string) => {
        let biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.CLICK,
            str_field1: biColumnsStaticFields.strField1Types.GET_STARTED,
            str_field2: biColumnsStaticFields.strField2Types.SIGNUP,
            str_field10: email,
            str_field11: name,
        };
        let successMesg = "dev provides name,email and password to signup";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    emailVerificationPage: (email: string, fromSignUpPage: boolean) => {
        let biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.VIEW_OPEN,
            str_field1: biColumnsStaticFields.strField1Types.VERIFY_EMAIL,
            str_field2: fromSignUpPage ? biColumnsStaticFields.strField2Types.SIGNUP : biColumnsStaticFields.strField2Types.LOGIN,
            str_field10: email,
        };
        let successMesg = "dev lands on email verification page through signup";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    resendConfirmationEmail: (email: string, signUp: boolean) => {
        let biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.CLICK,
            str_field1: biColumnsStaticFields.strField1Types.RESEND_EMAIL,
            str_field2: signUp ? biColumnsStaticFields.strField2Types.SIGNUP : biColumnsStaticFields.strField2Types.LOGIN,
            str_field10: email,
        };
        let successMesg = "dev clicks on resend confirmation email";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    accountActivatedPage: (email: string) => {
        let biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.VIEW_OPEN,
            str_field1: biColumnsStaticFields.strField1Types.ACCOUNT_ACTIVATED,
            str_field2: biColumnsStaticFields.strField2Types.SIGNUP,
            str_field10: email,
        };
        let successMesg = "dev lands on account activated page";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    //TODO
    // loginAccountActivated: (email: string) => { 
    //     let biEvent: TBiEvent = {
    //         event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
    //         str_field0: biColumnsStaticFields.strField0Types.VIEW_OPEN,
    //         str_field1: biColumnsStaticFields.strField1Types.ACCOUNT_ACTIVATED,
    //         str_field2: biColumnsStaticFields.strField2Types.LOGIN,
    //         str_field10: email,
    //     };
    //     biApi.sendBIEvent(biEvent, successMesg);
    //     console.log("BI Log success ( dev lands on account activated page(login) )");
    // },

    proceedToLoginFromActivationPage: (email: string) => {
        let biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.CLICK,
            str_field1: biColumnsStaticFields.strField1Types.SIGNIN,
            str_field2: biColumnsStaticFields.strField2Types.ACCOUNT_ACTIVATED,
            str_field10: email,
        };
        let successMesg = "dev proceeds to login from activation page";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    proceedToLoginFromVerificationPage: (email: string) => {
        let biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.CLICK,
            str_field1: biColumnsStaticFields.strField1Types.SIGNIN,
            str_field2: biColumnsStaticFields.strField2Types.VERIFY_EMAIL,
            str_field10: email,
        };
        let successMesg = "dev proceeds to login from verification page";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    clicksLogin: (email: string) => {
        let biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.CLICK,
            str_field1: biColumnsStaticFields.strField1Types.LOGIN,
            str_field10: email,
        };
        let successMesg = "dev clicks login post account activation or in general";
        biApi.sendBIEvent(biEvent, successMesg);
    },

};


