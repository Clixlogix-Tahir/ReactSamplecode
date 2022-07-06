import axios from "axios"
import { getJrDomain } from "../../common/utils";
import {
    TReqAddDTo,
    TReqAddDataType,
    TReqListBasic,
    TReqListResp,
    TAddOrg,
    TAddOrgResp,
  TReqStatus
} from './requestsControlTypes';

const queryConvertor = (obj:any) => {
    const query = Object.keys(obj)
    .map(key => `${key}=${obj[key]}`)
        .join('&');
    
    return query;
}


export const requestControlApi = {
    requestAdd: async(
        reqDTo: TReqAddDTo,
        companyId: number,
    ): Promise<TReqAddDataType> => {
        
        const { data } = await axios.post(
            `${getJrDomain()}cms-user-management/companies/${companyId}/appRequests`,
            reqDTo,
            { withCredentials: true },
        )
        return data;
    },

    getRequestList: async(
        reqListDTo: TReqListBasic,
        companyId:number,
    ): Promise<TReqListResp[]> => {
        const query = queryConvertor(reqListDTo);
        const { data } = await axios.get(
            `${getJrDomain()}cms-user-management/companies/${companyId}/appRequests?${query}`,
            { withCredentials: true },
        )
        return data;
    },
    reqChange: async(
        reqChangeDTo: TReqStatus,
        companyId: number,
        appRequestId: number,
    ): Promise<any> => {
        const { data } = await axios.patch(
            `${getJrDomain()}cms-user-management/companies/${companyId}/appRequests/${appRequestId}`,reqChangeDTo,
            { withCredentials: true },
        )
        return data;
    },

    addOrg: async (
        orgDTo: TAddOrg,
        companyId:number,
    ): Promise<TAddOrgResp> => {
        const { data } = await axios.post(
            `${getJrDomain()}cms-user-management/companies/${companyId}`,orgDTo,
            { withCredentials: true },
        )
        return data;
    },
    getOrg: async(
        companyId:number,
    ): Promise<TAddOrgResp> => {
        const { data } = await axios.get(
            `${getJrDomain()}cms-user-management/companies/${companyId}`,
            { withCredentials: true },
        )
        return data;
    },
};