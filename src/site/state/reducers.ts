import {combineReducers} from "redux";

import {AppState} from ".";

import {userInfoReducer} from "./UserInfo/reducers";
import {circuitInfoReducer} from "./CircuitInfo/reducers";
import {headerReducer} from "./Header/reducers";
import {sideNavReducer} from "./SideNav/reducers";
import {itemNavReducer} from "./ItemNav/reducers";


export const reducers = combineReducers<AppState>({
    user: userInfoReducer,
    circuit: circuitInfoReducer,
    header: headerReducer,
    sideNav: sideNavReducer,
    itemNav: itemNavReducer
});
