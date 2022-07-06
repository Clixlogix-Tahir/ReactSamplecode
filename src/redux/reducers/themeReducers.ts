import * as types from '../constants';
import { SetThemeType } from '../actions/themeActions'

let initialState = {
  currentTheme: 0
}

export type ThemeInitialStateType = {
  currentTheme: number
}

export default function reducer(state=initialState, actions: ActionTypes): ThemeInitialStateType {
  switch (actions.type) {

    case types.SET_THEME:
      return {
        ...state,
        currentTheme: actions.payload
      }

    default:
      return state
  }
}


type ActionTypes = SetThemeType