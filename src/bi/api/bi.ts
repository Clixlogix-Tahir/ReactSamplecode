import axios from 'axios';
import { CONSTANTS } from '../../common/constants';
import { TBiApiFields, TBiEvent, TDefaultBi } from '../types/types';
import { isBrowser, urlHelper } from '../utils/biUtil';

export const biApi = {

    sendBIEvent: async (biEvent: TBiEvent, successMesg: string) => {
        const apiFields: TBiApiFields = urlHelper.getBiApiFields();
        const defaultBi: TDefaultBi | null = JSON.parse(isBrowser() ? localStorage.getItem(CONSTANTS.LOCAL_STORAGE.DEFAULT_BI) || '{}' : '{}');
        if (defaultBi) {
            biEvent = { ...biEvent, ...defaultBi };
        }
        try {
            const { data } = await axios.post(
                `${apiFields.baseUrl}/app/${apiFields.biAppId}/event`,
                { ...biEvent, },
                {
                    headers: {
                        'blitzAppId': apiFields.biAppId.toString(),
                        'blitzAppToken': apiFields.biAppToken,
                        'Content-Type': 'application/json',
                        //'Access-Control-Allow-Credentials': true, //TODO: is this header required.( currently works fine without it)
                    },
                },
            );
            console.log('BI log success ' + successMesg);
            return data;
        } catch (e) {
            console.error('BI Log request failed\n', e);
            throw e;
        }
    },


    // TODO : Currently commented out,, might require later...
    // userRegister: async (biEvent) => {
    //     try {
    //             const { data } = await axios.post(
    //                 urlHelper.getBlitzDashboardUserRegisterUrl(),
    //                 {
    //                     ...biEvent,  // only requires name, email and passwd
    //                 },
    //                 {
    //                     headers: {
    //                         'blitzAppId': 0,
    //                         'blitzAppToken': "",
    //                         'Content-Type': 'application/json',
    //                     },
    //                 },
    //             ).then((data) => {
    //                 console.log('BI log success (event => everytime dev submits new game details)');
    //                 return data;
    //             });
    //             return data;
    //     } catch (e) {
    //         console.error('BI Log request failed\n', e);
    //         throw e;
    //     }
    // },

    // createApp: async (biEvent) => {
    //     try {
    //             const { data } = await axios.post(
    //                 urlHelper.getBlitzDashboardCreateAppUrl(),
    //                 {
    //                     ...biEvent,  // only requires name, email and teamId
    //                 },
    //                 {
    //                     headers: {
    //                         'blitzAppId': 0,
    //                         'blitzAppToken': "",
    //                         'Content-Type': 'application/json',
    //                     },
    //                 },
    //             ).then((data) => {
    //                 console.log('BI log success (event => everytime dev submits new game details)');
    //                 return data;
    //             });
    //             return data;
    //     } catch (e) {
    //         console.error('BI Log request failed\n', e);
    //         throw e;
    //     }
    // },

    // updateUserPremiumStatus: async (biEvent) => {
    //     try {
    //             const { data } = await axios.post(
    //                 urlHelper.getBlitzDashboardCreateAppUrl(),
    //                 {
    //                     ...biEvent,  // only requires name, email and teamId
    //                 },
    //                 {
    //                     headers: {
    //                         'blitzAppId': 0,
    //                         'blitzAppToken': "",
    //                         'Content-Type': 'application/json',
    //                     },
    //                 },
    //             ).then((data) => {
    //                 console.log('BI log success (event => everytime dev submits new game details)');
    //                 return data;
    //             });
    //             return data;
    //     } catch (e) {
    //         console.error('BI Log request failed\n', e);
    //         throw e;
    //     }
    // },

};

