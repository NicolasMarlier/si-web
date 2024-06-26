import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Collection from './CollectionPage/Collection'
import LoginPage from './LoginPage/LoginPage'
import SettingsPage from './SettingsPage/SettingsPage'

import reportWebVitals from './reportWebVitals';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  RouterProvider,
  Route
} from "react-router-dom";
import { AppProvider } from './AppProvider';
import StatsPage from './StatsPage/StatsPage';
import TestPage from './TestPage';


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="">
      <Route
        index
        element={<Navigate to="/map" replace />}/>
      <Route
          path="/login"
          element={<LoginPage/>}/>
      <Route
        path="/"
        element={<AppProvider><App /></AppProvider>}
      >
        <Route
          path="cities"
          element={<Collection/>}/>
        <Route
          path="cities/:city_slug"
          element={<Collection/>}/>
        <Route
          path="cities/:city_slug/:invader_name"
          element={<Collection/>}/>
        <Route
          path="map"
          element={<div/>}/>
        <Route
          path="map/:invader_name"
          element={<div/>}/>
        <Route
          path="place"
          element={<div/>}/>
        <Route
          path="place/:invader_name"
          element={<div/>}/>
        <Route
          path="stats"
          element={<StatsPage/>}/>
        <Route
          path="settings"
          element={<SettingsPage/>}/>
        <Route
          path="test"
          element={<TestPage/>}/>
        
      </Route>
    </Route>
));

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <RouterProvider router={router} />
);

// </React.StrictMode>

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
