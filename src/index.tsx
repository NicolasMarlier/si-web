import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Collection from './Collection'
import Login from './Login'

import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  RouterProvider,
  Route
} from "react-router-dom";
import { AppProvider } from './AppProvider';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="">
      <Route
          path="/login"
          element={<Login/>}/>
      <Route
        path="/"
        element={<AppProvider><App /></AppProvider>}
      >
        <Route
          path="collection"
          element={<Collection />}/>
        <Route
          path="map"
          element={<div/>}/>
        <Route
          path="place"
          element={<div/>}/>
        <Route
          path="place-hint"
          element={<div/>}/>
        <Route
          path=""
          element={<Navigate to="map" replace={true}/>}/>
      </Route>
    </Route>
));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
