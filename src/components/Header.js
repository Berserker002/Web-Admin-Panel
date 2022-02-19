import React, { Fragment } from 'react'
import './Header.css'
import coverImage from '../assets/cover.jpg'

export const Header = () => {
  return (
    <Fragment>
        <header className='header'>
      <h2>
        Admin Panel
      </h2>
  </header>;
      <div className='main-image'>
      </div> 
    </Fragment>
  )
}


export default Header