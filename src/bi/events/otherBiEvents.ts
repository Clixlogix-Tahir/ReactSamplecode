import { biApi } from "../api/bi";
import { biColumnsStaticFields } from "../constants/biConstants";
import { TBiEvent } from "../types/types";

export const otherBiEvents = {

    addGamePage: (email: string) => {
        const biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.VIEW_OPEN,
            str_field1: biColumnsStaticFields.strField1Types.ADD_GAME_VIEW,
            str_field10: email,
        };
        let successMesg = "dev is on add game page";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    submitNewGameDetails: (email: string,gameName: string, gameUrl: string, gameFormat: string,
        gamePlatform: string, otherInfo: string) => {
        const biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.CLICK,
            str_field1: biColumnsStaticFields.strField1Types.SUBMIT,
            str_field2: biColumnsStaticFields.strField2Types.ADD_GAME_VIEW,
            str_field10: email,
            str_field12: gameName,
            str_field13: gameUrl,
            str_field14: gameFormat,
            str_field15: gamePlatform,
            str_field16: otherInfo,
        };
        let successMesg = "everytime dev submits new game details";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    addOrganizationPage: (email: string) => {
        const biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.VIEW_OPEN,
            str_field1: biColumnsStaticFields.strField1Types.ADD_ORGANIZATION_VIEW,
            str_field10: email,
        };
        let successMesg = "dev is on add organization page";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    submitsOrganizationDetails: (email: string, organizatioName: string, organizationWebsite: string) => {
        const biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.CLICK,
            str_field1: biColumnsStaticFields.strField1Types.SUBMIT,
            str_field2: biColumnsStaticFields.strField2Types.ADD_ORGANIZATION_VIEW,
            str_field10: email,
            str_field20: organizatioName,
            str_field21: organizationWebsite,
        };
        let successMesg = "dev submits organization details";
        biApi.sendBIEvent(biEvent, successMesg);
    },

    gameRequestSuccessPage: (email: string, gameName: string, gameUrl: string, gameFormat: string, gamePlatform: string,
        otherInfo: string, organizatioName: string, organizationWebsite: string) => {
        const biEvent: TBiEvent = {
            event_name: biColumnsStaticFields.eventNames.DEVELOPER_ONBOARDING,
            str_field0: biColumnsStaticFields.strField0Types.VIEW_OPEN,
            str_field1: biColumnsStaticFields.strField1Types.GAME_REQUEST_SUBMITTED_VIEW,
            str_field10: email,
            str_field12: gameName,
            str_field13: gameUrl,
            str_field14: gameFormat,
            str_field15: gamePlatform,
            str_field16: otherInfo,
            str_field20: organizatioName,
            str_field21: organizationWebsite,
        };
        let successMesg = "dev is on game request success page";
        biApi.sendBIEvent(biEvent, successMesg);
    },

};


