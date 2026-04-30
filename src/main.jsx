import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import App from './App';
import Header from './components/custom/Header';
import CreateTrip from './create-trip';
import { Toaster } from './components/ui/sonner';
import Viewtrip from './view-trip/[tripId]';
import MyTrips from './my-trips/index.jsx';
import Login from './components/custom/Login';  // Import Login component

// Layout component that includes Header and Toaster
function Layout() {
  return (
    <>
      <Header />
      <Toaster />
      <Outlet />
    </>
  );
}

// Simple layout for login page (no Header)
function SimpleLayout() {
  return (
    <>
      <Toaster />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <App />,
      },
      {
        path: 'create-trip',
        element: <CreateTrip />
      },
      {
        path: 'view-trip/:tripId',
        element: <Viewtrip />
      },
      {
        path: 'my-trips',
        element: <MyTrips />
      },
    ]
  },
  // Login route - separate from main layout
  {
    path: "/login",
    element: <SimpleLayout />,
    children: [
      {
        index: true,
        element: <Login />
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);