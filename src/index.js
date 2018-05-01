'use strict'

import 'reset.css'
import './css/style.css'
import 'element-theme-default'

import React from 'react'
import { render } from 'react-dom'
// import { AppContainer } from 'react-hot-loader'
import Reader from './components/reader'
import Table from './components/table'
import Loader from "./components/loader";
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'
import Service from './service.js'

window.N = function (arr) {
  return arr.join(' ')
}

var __ = location.hash.slice(1) || 'shindosaigo';
Service.instance.getToken(__, Math.floor(new Date().getTime() / 1000)).then(data => {
  location.hash = ''
  Service.instance.token = data.token
})

Object.defineProperty(Service.instance, 'token', {
  set(data) {
    Service.instance._token = data
    render(
      <div>
        <Loader></Loader>
        <HashRouter>
          <Switch>
            <Route exact path='/table' component={Table} />
            <Route path='/reader/:bookId' component={Reader} />
            <Redirect exact from="/" to="/table" />
          </Switch>
        </HashRouter>
      </div>,
      document.querySelector('[data-js="app"]')
    )
  }
})










