import profile from '../../img/account.png'
import menu from '../../img/free-icon-burger-bar-6065135.png'
import React from "react";
import {Link} from "react-router-dom";

const Header = () => {
  return(
      <header className="header">
          <div className="header__logo">
              <h2 className="logo__title">Reviewer</h2>
          </div>
          <Link to={'/admin'} className="header__menu">
              <img src={menu} alt="" />
          </Link>
      </header>
  )
}

export default Header
