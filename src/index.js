import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Route, Link, Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Route path="/home" component={Home}></Route>
      <Route path="/cityList" component={CityList}></Route>
      {/* <Redirect from='/' to='/home' /> */}
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
