import { UPDATELOCATION } from './action'
import { initalState } from './state'
export const reducer = (state = initalState, action) => {
    switch (action.type) {
        case UPDATELOCATION:
            console.log(21)
            return {
                ...state, longitude: action.data.longitude, latitude: action.data.latitude
            }
        default:
            return state
    }
}