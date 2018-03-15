'use strict'

import 'reset.css'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Reader from './components/reader'
import Table from './components/table'
import Service from './service'

const renderApp = (NextApp) => {
  render(
    <AppContainer>
      <NextApp />
    </AppContainer>,
    document.querySelector('[data-js="app"]')
  )
}

renderApp(Table)

if (module.hot) {
  module.hot.accept('./', () => {
    renderApp(Table)
  })
}




