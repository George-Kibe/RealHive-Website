import React, { useState } from "react";
import "./Header.css";
import { FaBars } from "react-icons/fa";
import { getMenuStyles } from "../../utils/common";
import useHeaderColor from "../../hooks/useHeaderColor";
import OutsideClickHandler from "react-outside-click-handler";
import { Link, NavLink } from "react-router-dom";

const Header = () => {
  const [menuOpened, setMenuOpened] = useState(false);
  const headerColor = useHeaderColor();

  return (
    <section className="h-wrapper" style={{ background: headerColor }}>
      <div className="flexCenter innerWidth paddings h-container">
        {/* logo */}
        <Link to={"/"}>
          <img src="./color-logo.png" alt="logo" width={100} />
        </Link>
        {/* menu */}
        <OutsideClickHandler
          onOutsideClick={() => {
            setMenuOpened(false);
          }}
        >
          <div
            // ref={menuRef}
            className="flexCenter h-menu"
            style={getMenuStyles(menuOpened)}
          >
            <NavLink to={"/properties"} >Properties</NavLink>
            <button className="button">
              <a href="mailto:buenasconsultants@gmail.com">Contact</a>
            </button>
            <button className="button">Login</button>
          </div>
        </OutsideClickHandler>

        {/* for medium and small screens */}
        <div
          className="menu-icon"
          onClick={() => setMenuOpened(!menuOpened)}
        >
          <FaBars size={30} />
        </div>
      </div>
    </section>
  );
};

export default Header;
