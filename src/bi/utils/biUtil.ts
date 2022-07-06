import { isCurrentDashboardEnvProd } from "../../common/utils";
import { BLITZ_DASHBOARD_PROD_URL, BLITZ_DASHBOARD_TEST_URL, prodEnvBiVars, testEnvBiVars } from "../constants/biConstants";
import { TBiApiFields, TDefaultBi } from "../types/types";
import packageJson from '../../../package.json';


export const isBrowser = () => typeof window !== "undefined";

export const getDefaultBiFields = (currEnvApiFields: TBiApiFields, userId: number) : TDefaultBi => {
    const defaultBiEvent : TDefaultBi = {
        blitz_app_id: currEnvApiFields.biAppId.toString(),
        blitz_user_id: userId.toString(),
        app_version: packageJson.version,
        locale_code: (navigator.languages && navigator.languages[0]) || navigator.language,
        time_zone: new Date().getTimezoneOffset().toString(),
        user_agent: isBrowser() ? window.navigator.userAgent : '',
    };
    return defaultBiEvent;
};

export const urlHelper = {

    getBiApiFields(): TBiApiFields {
        if( isCurrentDashboardEnvProd() ){
            return prodEnvBiVars;
        }
        return testEnvBiVars;
    },

    getBlitzDashboardUrl(): string {
        if (isCurrentDashboardEnvProd()) {
            return BLITZ_DASHBOARD_PROD_URL;
        } else {
            return BLITZ_DASHBOARD_TEST_URL;
        }
    },

    // getBlitzDashboardUserRegisterUrl(): string {
    //     return this.getBlitzDashboardUrl() + "/api/user/register";
    // },

    // getBlitzDashboardCreateAppUrl(): string {
    //     return this.getBlitzDashboardUrl() + "/app/create";
    // },

    // getBlitzDashboardTeamUrl(): string {
    //     return this.getBlitzDashboardUrl() + "/api/admin/team";
    // },

    // getBlitzDashboardUpdateUserTeamUrl(userId: number): string {
    //     return this.getBlitzDashboardUrl() + "/api/admin/user/" + userId + "/updateTeam";
    // },

    // getBlitzDashboardUpdateRoleUrl(userId: number): string {
    //     return this.getBlitzDashboardUrl() + "/api/admin/user/" + userId + "/updateRole";
    // },

    // getBlitzDashboardPremiumStatusUrl(userId: number): string {
    //     return this.getBlitzDashboardUrl() + "/api/admin/user/" + userId + "/updatePremiumStatus";
    // },

};