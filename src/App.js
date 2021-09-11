import React, { useReducer } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './components/Map/Map'
import ErrorPage from './pages/404'

import { reducer } from './store/reducer'
import { initalState } from './store/state'
import { wrapperDispatch } from './store/asyncPatch'
import { AppContext } from './store/context'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initalState)
  return (
    <AppContext.Provider value={{ state, dispatch: wrapperDispatch(dispatch) }}>
      <Router>
        <Route exact path="/" render={() => <Redirect to="/home" />} /> {/* 路由重定向 */}
        <Route path="/home" component={Home}></Route>
        <Route path="/cityList" component={CityList}></Route>
        {/* <Route path="/map" component={Map}></Route> */}
        {/* <Route component={ErrorPage} /> */}
      </Router>
    </AppContext.Provider>
  )
}