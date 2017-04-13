import React from 'react'
import { Link } from 'react-router-dom'

import styles from './main.scss'

const Main = () => {
  return (
    <div className={styles.root}>
      <Link className={styles.link} to='/code'>Code</Link>
      <div className={styles.separator} />
      <Link className={styles.link} to='/photo'>Photo</Link>
    </div>
  )
}

export default Main
