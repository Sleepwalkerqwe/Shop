import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import toastr from "../utils/toastConfig";

import CartModal from "../pages/shop/CartModal";

import avatarImg from "../assets/avatar.png";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { logout } from "../redux/features/auth/authSlice";

const Navbar = () => {
  const products = useSelector((state) => state.cart.products);
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  const cartRef = React.useRef(null);
  const cartButtonRef = React.useRef(null);
  const dropDownButtonRef = React.useRef(null);
  const dropDownRef = React.useRef(null);

  const handleCartToggle = () => {
    console.log("hdfgds");
    setIsCartOpen(!isCartOpen);
    console.log(isCartOpen);
  };

  // show user if logged in
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [logoutUser] = useLogoutUserMutation();
  const navigate = useNavigate();

  // dropdown menus
  const [isDropDownOpen, setIsDropDownOpen] = React.useState(false);
  const handDropDownToggle = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  // admin dropdown menus
  const adminDropDownMenus = [
    { label: "Dashboard", path: "/dashboard/admin" },
    { label: "Manage Items", path: "/dashboard/manage-products" },
    { label: "All Orders", path: "/dashboard/manage-orders" },
    { label: "Add Product", path: "/dashboard/add-product" },
  ];

  // user dropdown menus
  const userDropDownMenus = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Profile", path: "/dashboard/profile" },
    { label: "Payments", path: "/dashboard/payments" },
    { label: "Orders", path: "/dashboard/orders" },
  ];

  const dropdownMenus =
    user?.role === "admin" ? [...adminDropDownMenus] : [...userDropDownMenus];

  const handleLogout = async () => {
    try {
      await logoutUser().unwrap();
      dispatch(logout());
      toastr.success("Successfully logout!");
    } catch (error) {
      toastr.error("Failed to log out", error);
    }
  };

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if clicked outside cart modal and cart button
      const clickedOutsideCart =
        cartRef.current && !cartRef.current.contains(event.target);
      const clickedOutsideButton =
        cartButtonRef.current && !cartButtonRef.current.contains(event.target);

      // Check if clicked outside dropdown menu and button
      const clickedOutsideDropDown =
        dropDownRef.current && !dropDownRef.current.contains(event.target);
      const clickedOutsideDropDownButton =
        dropDownButtonRef.current &&
        !dropDownButtonRef.current.contains(event.target);

      // Close cart if clicked outside cart and button
      if (clickedOutsideCart && clickedOutsideButton) {
        setIsCartOpen(false);
      }

      // Close dropdown if clicked outside dropdown and button
      if (clickedOutsideDropDown && clickedOutsideDropDownButton) {
        setIsDropDownOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsCartOpen(false);
        setIsDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header className="fixed-nav-bar w-nav">
      <nav className="max-w-screen-2xl mx-auto px-4 flex justify-between items-center">
        <ul className="nav__links">
          <li className="link">
            <Link to="/">Home</Link>
          </li>
          <li className="link">
            <Link to="/shop">Shop</Link>
          </li>
          <li className="link">
            <Link to="/">Pages</Link>
          </li>
          <li className="link">
            <Link to="/contact">Contact</Link>
          </li>
        </ul>

        {/* logo */}
        <div className="nav__logo">
          <Link to="/">
            Shop<span>.</span>
          </Link>
        </div>

        {/* nav icons */}
        <div className="nav__icons relative">
          <span>
            <Link to="/search">
              <i className="ri-search-line"></i>
            </Link>
          </span>

          {/* cart btn */}
          <div className="relative">
            <button
              ref={cartButtonRef}
              onClick={handleCartToggle}
              className="hover:text-primary"
            >
              <i className="ri-shopping-bag-line"></i>
              <sup className="text-sm inline-block px-1.5 text-white rounded-full bg-primary text-center">
                {products.length}
              </sup>
            </button>

            {isCartOpen && (
              <CartModal
                ref={cartRef}
                products={products}
                isOpen={isCartOpen}
                onClose={handleCartToggle}
              />
            )}
          </div>

          {/* user icon */}
          <span>
            {user && user ? (
              <>
                <img
                  ref={dropDownButtonRef}
                  onClick={handDropDownToggle}
                  src={user?.profileImage || avatarImg}
                  alt=""
                  className="size-6 rounded-full cursor-pointer"
                />

                {/* dropdown menu */}
                {isDropDownOpen && (
                  <div
                    ref={dropDownRef}
                    className="absolute right-0 mt-3 p-4 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                  >
                    <ul className="font-medium space-y-4 p-2">
                      {/* Map through dropdown menu items */}
                      <li>
                        <Link
                          onClick={() => setIsDropDownOpen(false)}
                          className="dropdown-items"
                          to="/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => setIsDropDownOpen(false)}
                          className="dropdown-items"
                          to="/profile"
                        >
                          Profile
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => setIsDropDownOpen(false)}
                          className="dropdown-items"
                          to="/settings"
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link
                          onClick={() => setIsDropDownOpen(false)}
                          className="dropdown-items"
                          to="/logout"
                        >
                          Logout
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <Link to="/login">
                <i className="ri-user-line"></i>
              </Link>
            )}
          </span>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
