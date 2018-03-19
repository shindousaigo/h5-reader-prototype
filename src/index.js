'use strict'

import 'reset.css'
import './css/style.css'

import React from 'react'
import { render } from 'react-dom'
// import { AppContainer } from 'react-hot-loader'
import Reader from './components/reader'
import Table from './components/table'
import { HashRouter, Switch, Route, Redirect } from 'react-router-dom'

window.N = function (arr) {
  return arr.join(' ')
}

render(
  <div>
    <HashRouter>
      <Switch>
        <Route exact path='/table' component={Table} />
        <Route path='/reader/:bookId' component={Reader} />
        <Redirect exact from="/" to="/table" />
      </Switch>
    </HashRouter>
  </div>
  ,
  document.querySelector('[data-js="app"]')
)






