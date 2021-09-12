import React, { useReducer, Suspense } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import routerConfig from './route'
import { renderRoutes } from './route/renderRoute'
import { reducer } from './store/reducer'
import { initalState } from './store/state'
import { wrapperDispatch } from './store/asyncPatch'
import { AppContext } from './store/context'

export default function App() {
  const [state, dispatch] = useReducer(reducer, initalState)
  return (
    <AppContext.Provider value={{ state, dispatch: wrapperDispatch(dispatch) }}>
      {/* <Router>
        <Route exact path="/" render={() => <Redirect to="/home" />} /> 
        <Route path="/home" component={Home}></Route>
        <Route path="/cityList" component={CityList}></Route>
      </Router> */}
      <Suspense fallback={<div>Loading</div>}>
        <Router>
          {renderRoutes(routerConfig)}
        </Router>
      </Suspense>
    </AppContext.Provider>
  )
}