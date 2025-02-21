import React from "react";
import { Link } from "react-router";

const Navbar = () => {
  return (
    <header className="fixed-nav-bar w-nav">
      <nav className="max-w-screen-2x1 mx-auto px-4 flex justify-between items-center">
        <ul className="nav__links">
          <li className="link">
            <Link to="/">Home</Link>
          </li>

          <li className="link">
            <Link to="/">Shop</Link>
          </li>

          <li className="link">
            <Link to="/">Pages</Link>
          </li>
          <li className="link">
            <Link to="/">Contact</Link>
          </li>
        </ul>
        {/* logo */}
        <div className="nav__logo ">
          <Link to="/">
            Shop <span>.</span>
          </Link>
        </div>

        {/* nav icons */}
        <div className="nav__icons relative">
          <span>
            <Link to="/search">
              <i className="ri-search-line"></i>
            </Link>
          </span>

          {/* shopping bag */}
          <span>
            <button className="hover:text-primary">
              <Link to="/search">
                <i className="ri-shopping-bag-line"></i>
                <sup className="text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center"></sup>
              </Link>
            </button>
          </span>

          {/*  */}
          <span>
            <button className="hover:text-primary">
              <Link to="/search">
                <i className="ri-user-line"></i>
                <sup className="text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center"></sup>
              </Link>
            </button>
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
