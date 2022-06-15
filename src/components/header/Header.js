import React, { useState } from "react";
import "./Header.css";
import SearchIcon from "@material-ui/icons/Search";
import ShoppingCartRoundedIcon from "@material-ui/icons/ShoppingCartRounded";
import { Link } from "react-router-dom";
import { useStateValue } from "../StateProvider";
import { auth } from "../../Firebase";
import img from '../../images/logo.png';
import { logout } from '../../utils';


function Header() {
  const [{ basket, user }] = useStateValue();
  const [identity, setIdentity] = useState(window.walletConnection.isSignedIn() ? window.accountId : user ? user.email : null);

  // if (window.walletConnection.isSignedIn()) {
  //   setIdentity(window.accountId);
  // }

  // if(user){
  //   setIdentity(user.email)
  // }


  const handleAuth = () => {
    if (window.walletConnection.isSignedIn()) {
      logout();
      setIdentity(null);
    } else if (user) {
      auth.signOut();
      setIdentity(null);
    }
  };

  return (
    <div className="header">
      <Link to={"/"}>
        <img
          className="header__logo"
          src={img}
          alt=""
        />
      </Link>

      <div className="header__search">
        <input className="header__searchInput" type="search" placeholder="Search E-kart..." />
        <SearchIcon className="header__searchIcon" />
      </div>

      <div className="header__nav">
        <Link to={!identity && "/login"}>
          <div onClick={handleAuth} className="header__option">
            <span className="header__optionLineOne">
              Hello {identity ? identity : "Guest"}
            </span>
            <span className="header__optionLineTwo">
              {identity ? "Sign Out" : "Sign In"}
            </span>
          </div>
        </Link>
        <Link to="/orders">
          <div className="header__option">
            <span className="header__optionLineOne">Returns</span>
            <span className="header__optionLineTwo">& Orders</span>
          </div>
        </Link>
        <Link to="/checkout">
          <div className="header__optionBasket">
            <ShoppingCartRoundedIcon />
            <span className="header__optionLineTwo header__basketCount">
              {basket?.length}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default Header;
