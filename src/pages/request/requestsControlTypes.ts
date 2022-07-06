export type  TReqAddDTo ={
    name: string,
    url?: string,
    format: string,
    platform: string,
    otherInformation?:string,
}
export type TReqAddDataType = {
        id: number,
        name: string,
        companyId: number,
        companyName: string,
        url: string,
        format: string,
        platform: string,
        otherInformation: string,
        status: string,
        createdAt: string,
        updatedAt: string,
        completedAt: string,
        updatedByCmsUser: string,
        requesterEmail: string,
        requesterName: string,
      
}
export type TReqListBasic = {
    requestedDateStart?: string;
    requestedDateEnd?: string;
    status?: string,
    query?: string,
    sortBy?: string,
    sortOrder?: string,
    companyId?: number;
    ps?: number;
    pn?: number;
}
export type TReqList = {
    id: number,
    name: string,
    companyId: number,
    companyName: string,
    url: string,
    format: string[],
    platform: string[],
    otherInformation: string,
    status: string,
    createdAt: string,
    updatedAt: string,
    completedAt: string,
    updatedByCmsUser: string,
    requesterEmail: string,
    requesterName: string,
}
export type TReqListResp = {
    appRequests: TReqList[],
    pagination: {
        currentPage: number,
        pageSize: number,
        totalPages: number,
        totalResults: number,
    }
}
export type TAddOrg = {
    name: string,
    phone?: string,
    website?:string,
}
export type TAddOrgResp = {
    id: number,
    name: string,
    phone: string,
    website: string,
    appGroup: string
}
export type TReqStatus = {
    status:string,
}
