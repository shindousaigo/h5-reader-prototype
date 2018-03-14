'use strict'

import 'reset.css'

import React from 'react'
import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import Reader from './components/reader'

const renderApp = (NextApp) => {
  render(
    <AppContainer>
      <NextApp />
    </AppContainer>,
    document.querySelector('[data-js="app"]')
  )
}

renderApp(Reader)

if (module.hot) {
  module.hot.accept('./app', () => {
    // const NextApp = require('./app').default
    renderApp(Reader)
  })
}
