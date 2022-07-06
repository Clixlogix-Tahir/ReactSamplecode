import axios from "axios"
import Cookies from "universal-cookie";
import { ADMIN_USER_AUTH_TOKEN } from "../../common/constants";
import { getJrDomain } from "../../common/utils";
import {
  TCmsUser,
  TCmsUserSignUpRequestDto,
  TInvitedCmsUserSignUpRequestDto,
  TEmailInvite,
  TInvitedCmsUserResponse,
  TLoginDto,
  TStatusResponse,
  TCmsRole,
  TEditedCmsUser,
  TCmsSendEmailLinkDTo,
  TCmsVerifyEmailDTo
} from "./teamAccessControlTypes";

const cookies = new Cookies();

// this will bypass interceptor rules to logout
const uninterceptedAxiosInstance = axios.create();

export const teamAccessControlApi = {

  getCmsRolesXhr: async (
  ): Promise<TCmsRole[]> => {
    const { data } = await axios.get(
      `${getJrDomain()}cms-user-management/roles`,
      { withCredentials: true }
    );
    return data;
  },

  getCmsUsersXhr: async (
    companyId: number,
    pn: number,
    ps: number
  ): Promise<TCmsUser[]> => {
    const { data } = await axios.get(
      `${getJrDomain()}cms-user-management/companies/${companyId.toString()}/users?pn=${pn}&ps=${ps}`,
      { withCredentials: true }
    );
    return data;
  },

  sendEmailInviteXhr: async (
    emailInviteDto: TEmailInvite,
  ): Promise<TStatusResponse> => {
    const { data } = await uninterceptedAxiosInstance.post(
      `${getJrDomain()}cms-user-management/invite`,
      emailInviteDto,
      { withCredentials: true }
    );
    return data;
  },

  signUpXhr: async (
    cmsUserSignUpDto: TCmsUserSignUpRequestDto,
  ): Promise<TCmsUser> => {
    const { data } = await uninterceptedAxiosInstance.post(
      `${getJrDomain()}cms-user-management/signup`,
      cmsUserSignUpDto,
      { withCredentials: true }
    );
    return data;
  },

  sendEmailXhr: async(
    cmsSendEmailLink: TCmsSendEmailLinkDTo,
  ): Promise<any> => {
    const { data } = await uninterceptedAxiosInstance.post(`
    ${getJrDomain()}cms-user-management/sendEmailVerificationLink`, cmsSendEmailLink,
      { withCredentials: true }
    );
    console.log("data from api",data);
    return data;
  },

  verifyEmailXhr: async(
    cmsVerifyMail: TCmsVerifyEmailDTo,
  ): Promise<any> => {
    const { data } = await uninterceptedAxiosInstance.post(`
    ${getJrDomain()}cms-user-management/verifyEmail`, cmsVerifyMail,
      { withCredentials: true }
    );
    console.log("data from api",data);
    return data;
  },
  invitedSignUpXhr: async (
    cmsUserSignUpDto: TInvitedCmsUserSignUpRequestDto,
  ): Promise<TCmsUser> => {
    const { data } = await uninterceptedAxiosInstance.post(
      `${getJrDomain()}cms-user-management/invitedSignup`,
      cmsUserSignUpDto,
      { withCredentials: true }
    );
    
    return data;
  },

  signInXhr: async (
    loginDto: TLoginDto,
  ): Promise<TCmsUser> => {
    const { data, headers } = await uninterceptedAxiosInstance.post(
      `${getJrDomain()}cms-user-management/login`,
      loginDto,
      { withCredentials: true }
    );
    console.log(headers[ADMIN_USER_AUTH_TOKEN]);
    if (headers && headers[ADMIN_USER_AUTH_TOKEN]) {
      cookies.set(ADMIN_USER_AUTH_TOKEN, headers[ADMIN_USER_AUTH_TOKEN]);
    }
    return data;
  },

  getInvitedCmsUsersXhr: async (
    key: string,
  ): Promise<TInvitedCmsUserResponse> => {
    const { data } = await uninterceptedAxiosInstance.get(
      `${getJrDomain()}cms-user-management/invite/${key}`,
      { withCredentials: true }
    );
    return data;
  },

  forgotPassword: async (
    email: string,
  ): Promise<TInvitedCmsUserResponse> => {
    const { data } = await uninterceptedAxiosInstance.post(
      `${getJrDomain()}cms-user-management/forgotPassword?email=${email}`,
      { withCredentials: true }
    );
    return data;
  },

  resetPassword: async (
    email: string,
    password: string,
    resetKey: string,
  ): Promise<TInvitedCmsUserResponse> => {
    const { data } = await uninterceptedAxiosInstance.post(
      `${getJrDomain()}cms-user-management/resetPassword`,
      { email, password, resetKey },
      { withCredentials: true }
    );
    return data;
  },

  updateCmsUserXhr: async (
    user: TEditedCmsUser, companyId: number, userId: number
  ): Promise<TCmsUser> => {
    const { data } = await axios.post(
      `${getJrDomain()}cms-user-management/companies/${companyId}/users/${userId}`,
      user,
      { withCredentials: true }
    );
    return data;
  },

  logoutXhr: async () => {
    const { data } = await axios.post(
      `${getJrDomain()}cms-user-management/logout`,
      null,
      { withCredentials: true }
    );
    return data;
  },

};
