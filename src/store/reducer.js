import { LOGIN } from './action'
import { initalState } from './state'
export const reducer = (state = initalState, action) => {
    switch (action.type) {
        case LOGIN:
            return {
                ...state, userInfo: {
                    userName: action.data.userName,
                    password: action.data.password
                }
            }
        default:
            return state
    }
}