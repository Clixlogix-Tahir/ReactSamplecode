import Axios from "axios";
import { getJrDomain } from "../../common/utils";
import { IEventBattlePayload, IEventNudgePayload, TCashProduct, TEventPayload } from "../../types/eventTypes";

export const createEventXhr = async(payload: IEventBattlePayload | IEventNudgePayload, appId: string) => {
  const { data } = await Axios.post(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/events`,
    payload,
    { withCredentials: true },
  );
  return data;
};

export const getEventsXhr = async(eventCategory: string, appId: string, pageSize: number, currentPageNumber: number, recordCount: number): Promise<TEventPayload[]> => {
  const { data } = await Axios.get(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/events/category/${eventCategory}?ps=${pageSize}&pn=${currentPageNumber}&rrc=${recordCount}`,
    { withCredentials: true },
  );
  return data;
};

export const updateEventXhr = async(payload: TEventPayload, appId: string, eventId: number) => {
  const { data } = await Axios.put(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/events/${eventId}`,
    payload,
    { withCredentials: true },
  );
  return data;
};

export const deleteEventXhr = async(appId: string, eventId: number) => {
  const { data } = await Axios.delete(
    `${getJrDomain()}game-content/admin-api/apps/${appId}/events/${eventId}`,
    { withCredentials: true },
  );
  return data;
};

export const eventApi = {
  // todo move other API exports in this file to this object
  getCashProductsXhr: async(appId: string) => {
    const { data } = await Axios.get(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/cashProducts`,
      { withCredentials: true },
    );
    return data;
  },
  
  createCashProductXhr: async(appId: string, payload: TCashProduct): Promise<TCashProduct> => {
    const { data } = await Axios.post(
      `${getJrDomain()}wallet/admin-api/apps/${appId}/cashProducts`,
      payload,
      { withCredentials: true },
    );
    return data;
  },
};

