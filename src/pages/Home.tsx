import React from "react";
import { NavLink } from "react-router-dom";
import configRouter from "../untils/config/configRouter";
import "../assets/css/home.css";
import bookImg from "../assets/img/book.png";
type Props = {};

const Home = (props: Props) => {
  return (
    <div
      style={{ maxWidth: 1200 }}
      className="grid lg:grid-cols-3 sm:grid-cols-2 gap-10 my-4 mx-auto p-4"
    >
      <div className=" home__item__box">
        <img className="imgThumb" src={bookImg} alt="book" />
        <div>
          <NavLink to={configRouter.private.altitude} className="home__link ">
            Sổ đo thủy chuẩn
          </NavLink>
        </div>
      </div>
      <div className=" home__item__box">
        <img className="imgThumb" src={bookImg} alt="book" />
        <div>
          <NavLink
            to={configRouter.private.measurement}
            className="home__link "
          >
            Sổ đo mặt bằng
          </NavLink>
        </div>
      </div>
      <div className=" home__item__box">
        <img className="imgThumb" src={bookImg} alt="book" />
        <NavLink to={configRouter.private.map_point} className="home__link">
          Nhập ảnh vào điểm
        </NavLink>
      </div>
      <div className=" home__item__box">
        <img className="imgThumb" src={bookImg} alt="book" />
        <NavLink to={configRouter.private.cad_ggearth} className="home__link">
          Chuyển đổi KML - CAD{" "}
        </NavLink>
      </div>
      <div className=" home__item__box">
        <img className="imgThumb" src={bookImg} alt="book" />
        <NavLink to={configRouter.private.text_tool} className="home__link">
          Công cụ text
        </NavLink>
      </div>
      <div className=" home__item__box">
        <img className="imgThumb" src={bookImg} alt="book" />
        <NavLink to={configRouter.private.capture_map} className="home__link">
          Cắt ảnh
        </NavLink>
      </div>
      <div className=" home__item__box">
        <img className="imgThumb" src={bookImg} alt="book" />
        <NavLink to={configRouter.private.map_manager} className="home__link">
          Quản lý bản đồ
        </NavLink>
      </div>
    </div>
  );
};

export default Home;
