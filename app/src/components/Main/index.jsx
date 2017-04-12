import React from 'react'
import { Link } from 'react-router-dom'

const Main = () => {
  return (
    <div>
      <h1>Main</h1>
      <Link to='/code'>Code</Link>
      &nbsp;/&nbsp;
      <Link to='/photo'>Photo</Link>
    </div>
  )
}

export default Main
