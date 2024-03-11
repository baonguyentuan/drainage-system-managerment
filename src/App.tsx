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
import MeasurementBook from "./pages/MeasurementBook";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
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
            <Route path={configRouter.private.book} element={<BookLayout />}>
              <Route index element={<Book />} />
              <Route
                path={configRouter.private.book_calculate}
                element={<BookCaculation />}
              />
              <Route path={configRouter.private.book} element={<Book />} />
            </Route>
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
              path={configRouter.private.mesurement_book}
              element={<MeasurementBook />}
            />
          </Routes>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
