import React from "react";
import { Link } from "react-router";
import bannerImg from "../../assets/header.png";

const Banner = () => {
  return (
    <div className="section__container header__container">
      <div className="header__content z-30">
        <h4 className="uppercase">UP TO 20% Discount on</h4>
        <h1>Girl's Fashion</h1>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto repudiandae temporibus laboriosam vero ad distinctio. Quod doloremque minus, omnis minima vel libero blanditiis consequatur tenetur, dicta quisquam illo aliquid perspiciatis?</p>
        <button className="btn">
          <Link to="/shop">Expolore now</Link>
        </button>
      </div>
      <div className="header__images">
        <img src={bannerImg} alt="banner image" />
      </div>
    </div>
  );
};

export default Banner;
