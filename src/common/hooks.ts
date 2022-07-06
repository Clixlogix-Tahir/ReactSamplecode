/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState } from "react";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector
} from "react-redux";
import {
  useHistory,
  useLocation
} from "react-router-dom";
import { TCmsRole } from "../pages/team-access-control-management/teamAccessControlTypes";
import {
  AppDispatch,
  RootState
} from "../rtk-reducers";
import { ECost, ECurrency } from "../types/eventTypes";
import { CONSTANTS } from "./constants";
import { isLoggedInUserJrxSuperAdminOrManager } from "./utils";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export function useUrlQuery() {
  return new URLSearchParams(useLocation().search);
}

export function useAppRedirect() {
  const history = useHistory();
  return (url: string, locationState?: {}) => {
    console.info('redirecting to', url);
    history.push(url, { ...locationState });
  };
}

export function useValidVCurrencies(appId: string) {
  const { apps } = useAppSelector(state => state.gameConfigForm);
  return apps.list.find(app => app.appId === appId)?.serverParams['virtual.currency'];
}

export function useDefaultVCurrency(appId: string) {
  const { apps } = useAppSelector(state => state.gameConfigForm);
  return apps.list.find(app => app.appId === appId)?.serverParams['virtual.currency'][0].currencyName || ECost.EMPTY;
}

export function useDefaultVCurrency2() {
  const { apps, selectedApp } = useAppSelector(state => state.gameConfigForm);
  const [vCurrency, setVCurrency] = useState(ECost.EMPTY);
  useEffect(() => {
    if (selectedApp) {
      setVCurrency(apps.list.find(app => app.appId === selectedApp)?.serverParams['virtual.currency'][0].currencyName as ECost || ECost.EMPTY);
    }
  }, [selectedApp]);
  return vCurrency;
}

export function useDefaultRealCurrency() {
  const { apps, selectedApp } = useAppSelector(state => state.gameConfigForm);
  const [vCurrency, setVCurrency] = useState(ECurrency.RLY);
  useEffect(() => {
    if (selectedApp) {
      const serverParams = apps.list.find(app => app.appId === selectedApp)?.serverParams;
      setVCurrency(serverParams && 'realCryptoCurrency' in serverParams ? serverParams.realCryptoCurrency[0] as ECurrency : ECurrency.RLY);
    }
  }, [selectedApp]);
  return vCurrency;
}

export function useRealCryptoCurrencies(): string[] {
  const {
    selectedAppObj,
  } = useAppSelector(state => state.gameConfigForm);
  const realCryptoCurrencyMemo = useMemo(() => {
    return selectedAppObj && selectedAppObj.serverParams && selectedAppObj.serverParams.realCryptoCurrency ? selectedAppObj.serverParams.realCryptoCurrency : [];
  }, [selectedAppObj]);
  return realCryptoCurrencyMemo
};

/** returns condition to identify if full page placeholder content
 * should be shown when selected app is "SAMPLE_APP" or no apps exist
 */
export function useShouldShowPlaceholder() {
  const { apps, selectedApp } = useAppSelector(state => state.gameConfigForm);
  return apps.list.length <= 0 || selectedApp === CONSTANTS.MISC.SAMPLE_APP;
}

/** @description indicates if logged user is jrx_super_admin OR jrx_manager */
export function useIsAdmin() {
  const { userGoogleProfile } = useAppSelector(state => state.globalSlice);
  const loggedInUserRoles: TCmsRole[] | null = userGoogleProfile && 'userRoles' in userGoogleProfile ? userGoogleProfile.userRoles : null;
  const isLoggedInUserJrxAdminOrMngr = useMemo(() => isLoggedInUserJrxSuperAdminOrManager(loggedInUserRoles), [userGoogleProfile]);
  return isLoggedInUserJrxAdminOrMngr;
}
