import axios from "axios";
import { BASE_URLs } from "../../common/constants";
import { getJrDomain } from "../../common/utils";
import { TFileUploadResponse } from "../app-management/appManagementTypes";

const queryConvertor = (obj: any) => {
  const query = Object.keys(obj)
    .map((key) => `${key}=${obj[key]}`)
    .join("&");

  return query;
};

export const customThemeControlApi = {
  uploadFile: async (
    payload: FormData
  ): Promise<TFileUploadResponse> => {
   
    const { data } = await axios.post(
      `${getJrDomain()}unclassified/admin-api/apps/uploadFileForHarnessAssets`,
      payload,
      { withCredentials: true } // todo move this to interceptor
    );
    return data;
  },
  loadJsonData: async (
    appId: string
  ): Promise<TFileUploadResponse> => {
    
    const { data } = await axios.get(
      `https://assets.onclixlogix-samplecode.com/${appId}/theme.json`,
     );
    return data;
  },
  
  customThemeAdd: async(
    customThemeAddDTo: any,
    appId: any,
  ): Promise<any> => {
   
    const { data } = await axios.post(
        `${getJrDomain()}unclassified/admin-api/apps/${appId}/uiTheme`,
      customThemeAddDTo,
        { withCredentials: true },
    )
    return data;
  },
  customThemeFileUpload: async(
    customThemeAddDTo: any,
    appId: any,
): Promise<any> => {
    const { data } = await axios.post(
      `${getJrDomain()}unclassified/admin-api/apps/uploadFileForHarnessAssets`,
        customThemeAddDTo,
        { withCredentials: true },
    )
    return data;
  },
  customThemeGet: async (
    appId: any,
): Promise<any> => {
    const { data } = await axios.get(
        `${getJrDomain()}unclassified/admin-api/apps/${appId}/uiTheme`,
        { withCredentials: true },
    )
    return data;
  },
  customThemeCurrent: async(
    customThemeCurrentDTo: any,
    appId: any,
): Promise<any> => {
  const query = queryConvertor(customThemeCurrentDTo);
    const { data } = await axios.post(
        `${getJrDomain()}unclassified/admin-api/apps/${appId}/uiThemeVersion?${query}`,
        { withCredentials: true },
    )
    return data;
  },
  
};
