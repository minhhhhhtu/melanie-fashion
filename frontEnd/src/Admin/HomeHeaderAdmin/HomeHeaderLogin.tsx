/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleDown,
  faMagnifyingGlass,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { useProductContext } from "../../User/ProductContext/ProductContext.tsx";
import {
  faHeart as farHeart,
  faPaperPlane,
  faUser,
} from "@fortawesome/free-regular-svg-icons";
import { NavLink, useNavigate } from "react-router-dom";

interface Product {
  _id: string;
  name: string;
  image: string | string[];
  price: number;
  viewer: string;
  onSale?: boolean;
  priceOnSale: number;
  quantity?: number;
  isfavourite?: boolean;
}

const HomeHeader = () => {
  const [isActive] = useState(false);
  const { loadStoredSearchResults } = useProductContext();
  const [activeMenuItem, setActiveMenuItem] = useState(null);
  const topMenuRef = useRef<HTMLUListElement | null>(null);
  const [showProductMenu, setShowProductMenu] = useState(false);

  const handleMenuItemClick = (item) => {
    setActiveMenuItem(item);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch(
        "https://melanine-backend.onrender.com/api/user/log-out",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("profile");
        window.location.href = "/login"; // Redirect to login page
      } else {
        const result = await response.json();
        alert(result.message);
      }
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out.");
    }
  };

  useEffect(() => {
    loadStoredSearchResults();
  }, []);

  return (
    <>
      <header className="p-10 mx-auto my-[-10px] z-[99999] !fixed">
        <nav className="flex flex-row justify-between items-center fixed top-0 left-0 w-full h-[10%] z-50 bg-pinky-200">
          <div className="logo flex-1 basis-1/6 p-5 lg:p-0 text-center text-pinky-600 cursor-pointer">
            <h3 className="text-xl lg:text-2xl font-bold">Melanie</h3>
            <div className="flex flex-row items-center justify-center">
              <div className="subheadline-deco-line"></div>
              <div className="lg:block hidden lg:text-[10px]">
                More Products
              </div>
              <div className="subheadline-deco-line"></div>
            </div>
          </div>
          <ul
            id="top-menu"
            ref={topMenuRef}
            className={`basis-4/6 ${
              isActive ? "" : "hidden"
            } lg:flex lg:items-center lg:justify-center lg:gap-16 uppercase text-sm text-pinky-600 font-medium`}
          >
            <li
              className={`ct-menu-top-header relative ${
                activeMenuItem === "PRODUCT" ? "ct-menu-top-header-active" : ""
              }`}
              onMouseEnter={() => setShowProductMenu(true)}
              onMouseLeave={() => setShowProductMenu(false)}
            >
              <div className="flex flex-row justify-center items-center gap-3">
                <div>PRODUCT</div>
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
              {showProductMenu && (
                <ul className="absolute top-full left-0 w-[200px] bg-white shadow-lg rounded-lg z-50">
                  <li>
                    <NavLink
                      to="/admin"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Add Product
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/update-product"
                      className="block px-4 py-2 hover:bg-gray-200"
                    >
                      Update Product
                    </NavLink>
                  </li>
                </ul>
              )}
            </li>
            <li
              className={`ct-menu-top-header relative ${
                activeMenuItem === "ORDER" ? "ct-menu-top-header-active" : ""
              }`}
            >
              <div className="flex flex-row justify-center items-center gap-3">
                <NavLink to="/order">
                  <div>ORDER</div>
                </NavLink>
                <FontAwesomeIcon icon={faAngleDown} />
              </div>
            </li>
          </ul>
          <button className="basic-1/6 mr-12 text-pinky-600" onClick={handleLogout}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </button>
        </nav>
      </header>
    </>
  );
};

export default HomeHeader;
