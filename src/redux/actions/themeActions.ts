import * as types from '../constants';

export type SetThemeType = {
  type: typeof types.SET_THEME
  payload: number
}
export function setTheme(value: number): SetThemeType {
  return {
    type: types.SET_THEME,
    payload: value
  }
}
