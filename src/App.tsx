import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import configRouter from './untils/config/configRouter';
import Book from './components/Book/BookElevation';
import HomeLayout from './layouts/HomeLayout';
import Home from './pages/Home';
import { Provider } from 'react-redux';
import { store } from './redux/configStore';
import TextTool from './pages/TextTool';

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='' element={<HomeLayout />}>
              <Route index element={<Home />} />
              <Route path={configRouter.public.home} element={<Home />} />
              <Route path={configRouter.private.book} element={<Book />} />
              <Route path={configRouter.private.text_tool} element={<TextTool/>}/>
            </Route>
          </Routes>
        </BrowserRouter>
      </Provider>

    </div>
  );
}

export default App;
