import React, {createContext, useReducer} from 'react';
import vibenowReducer from './reducers/vibenowReducers';
import {InitalState,Modestate,InterstState,isDarkTheme,tabModeId,profileMatchData} from './initalState/intialstate';
export const GlobalContext: any = createContext({});
const GlobalProvider = ({children}: any) => {
const [otpState, otpDispatch] = useReducer(vibenowReducer, InitalState);
const [mode, modeDispatch] = useReducer(vibenowReducer, Modestate);
const [interst,interstDispatch]=useReducer(vibenowReducer,InterstState);
const [theme,themeDispatch]=useReducer(vibenowReducer,isDarkTheme)
const [modeId,modeIdDispatch]=useReducer(vibenowReducer,tabModeId)
const [profileMatch,profileMatchDispatch]=useReducer(vibenowReducer,profileMatchData)
 
  return (
    <GlobalContext.Provider
      value={{
        otpState,
        otpDispatch,
        mode,
        modeDispatch,
        interst,
        interstDispatch,
        theme,themeDispatch,
        modeId,modeIdDispatch,
        profileMatch,profileMatchDispatch

      }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalProvider;
