import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import Map from './components/Map/Map'
import ErrorPage from './pages/404'

import './assets/fonts/iconfont.css'
import './index.scss'

ReactDOM.render(
  // <React.StrictMode>
  <Router>
    <Route exact path="/" render={() => <Redirect to="/home" />} /> {/* 路由重定向 */}
    <Route path="/home" component={Home}></Route>
    <Route path="/cityList" component={CityList}></Route>
    {/* <Route path="/map" component={Map}></Route> */}
    {/* <Route component={ErrorPage} /> */}
  </Router>,
  // </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
