import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import configRouter from "./untils/config/configRouter";
import Book from "./components/Book/BookElevation";
import HomeLayout from "./layouts/HomeLayout";
import Home from "./pages/Home";
import { Provider } from "react-redux";
import { store } from "./redux/configStore";
import TextTool from "./pages/TextTool";
import BookCaculation from "./components/Book/BookCaculation";
import BookLayout from "./layouts/BookLayout";
import CadGGEarth from "./pages/CadGGEarth";
import MapPoint from "./pages/MapPoint";
import ElevationPlacemark from "./components/Book/ElevationPlacemark";
import CaptureMap from "./pages/CaptureMap";
import MeasurementBookDetail from "./pages/MeasurementBookDetail";
import Login from "./pages/Login";
import AdminLayout from "./layouts/AdminLayout";
import BookManager from "./components/Book/BookManager";
import MeasurementMenu from "./components/measurement/MeasurementMenu";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path={configRouter.public.login} element={<Login />} />
            <Route path="" element={<HomeLayout />}>
              <Route index element={<Home />} />
              <Route path={configRouter.public.home} element={<Home />} />
              <Route
                path={configRouter.private.text_tool}
                element={<TextTool />}
              />
              <Route
                path={configRouter.private.cad_ggearth}
                element={<CadGGEarth />}
              />
            </Route>
            <Route
              path={configRouter.private.book}
              element={<BookManager />}
            ></Route>
            <Route path={configRouter.private.book_detail} element={<Book />} />
            {/* <Route
              path={configRouter.private.book_detail}
              element={<BookLayout />}
            >
              <Route index element={<Book />} />
              <Route
                path={configRouter.private.book_calculate}
                element={<BookCaculation />}
              />
              <Route path={"/:id"} element={<Book />} />
            </Route> */}
            <Route
              path={`${configRouter.private.book}/${configRouter.private.book_placemark}/:id`}
              element={<ElevationPlacemark />}
            />
            <Route
              path={configRouter.private.map_point}
              element={<MapPoint />}
            />
            <Route
              path={configRouter.private.capture_map}
              element={<CaptureMap />}
            />
            <Route
              path={configRouter.private.measurement_book_detail}
              element={<MeasurementBookDetail />}
            />
            <Route
              path={configRouter.private.measurement}
              element={<MeasurementMenu />}
            />
            <Route
              path={configRouter.admin.base}
              element={<AdminLayout />}
            ></Route>
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
