import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom'
import 'normalize-css'

import Main from '../Main'
import Code from '../Code'
import Photo from '../Photo'

import styles from './app.scss'

class App extends Component {
  render () {
    return (
      <BrowserRouter>
        <div>
          <Route exact path='/' component={Main} />
          <Route path='/code' component={Code} />
          <Route path='/photo' component={Photo} />
        </div>
      </BrowserRouter>
    )
  }
}

export default App
