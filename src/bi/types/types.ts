export type TBiEvent = {
    [key: string]: number | string;
};

export type TBiApiFields = {
    baseUrl: string;
    biAppId: number;
    biAppToken: string;
}

export type TDefaultBi = {
    blitz_app_id: string,
    blitz_user_id: string,
    locale_code: string,
    time_zone: string,
    user_agent: string,
    app_version: string,
};