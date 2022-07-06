// export enum ERegisteredUserRole {
//   REGULAR = 'REGULAR',
//   PREVIEW = 'PREVIEW',
//   ADMIN = 'ADMIN',
// };

export type TCmsPermission = {
  moduleIdentifier: string;
  action: string;
};

export type TCmsRole = {
  id: number;
  roleIdentifier: string;
  displayName: string;
  permissions: TCmsPermission[];
};

export type TCmsUser = {
  id: number;
  name: string;
  email: string;
  companyId: number;
  companyName: string;
  userRoles: TCmsRole[];
  phone: string;
  lastLoggedInTime: Date;
  twoFAEnabled: boolean;
  blocked: boolean;
};
       
export type TEditedCmsUser = {
  name: string;
  roleIds: number[];
};

export type TEmailInvite = {
  name: string;
  email: string;
  companyId: number;
  invitorEmail: string;
  roleIdentifier: string;
};

export type TInvitedCmsUserResponse = {
  name: string;
  email: string;
};

export type TCmsUserSignUpRequestDto = {
  name: string;
  email: string;
  password: string;
};
export type TCmsSendEmailLinkDTo = {
  email: string;
}

export type TCmsVerifyEmailDTo = {
  email: string|null;
  verificationKey: string|null;
}

export type TInvitedCmsUserSignUpRequestDto = {
  name: string;
  email: string;
  password: string;
  invitationKey: string;
};

export type TLoginDto = {
  email: string;
  password: string;
  authToken: string;
};

export type TStatusResponse = {
  status: string;
};

export type TCurrentTeamMembersProps = {
  availableRoles: TCmsRole[];
};

export type TAccessRoleAndDescriptionProps = {
  availableRoles: TCmsRole[];
};

export type TInviteTeamMemberProps = {
  availableRoles: TCmsRole[];
};