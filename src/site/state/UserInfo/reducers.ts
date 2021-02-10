import {AllActions} from "../actions";

import {TOGGLE_SIDENAV_ID} from "./actionTypes";
import {UserInfoState} from "./state";


const initialState = {
    auth: "",
    isLoggedIn: false,
    circuits: []
} as UserInfoState;

export function userInfoReducer(state = initialState, action: AllActions): UserInfoState {
    switch (action.type) {
        case TOGGLE_SIDENAV_ID:
            return {
                ...state
            };
        default:
            return state;
    }
}
