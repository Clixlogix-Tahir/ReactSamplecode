import { combineReducers } from 'redux';

import themeReducer from './themeReducers';

export const rootReducer = combineReducers({
	themeReducer
});

type RootReducerType = typeof rootReducer
export type AppStateType = ReturnType<RootReducerType>