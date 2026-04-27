import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom'; // ← Add Outlet
import App from './App';
import Header from './components/custom/Header';
import CreateTrip from './create-trip';
import { Toaster } from './components/ui/sonner';
import Viewtrip from './view-trip/[tripId]';
import MyTrips from './my-trips/index.jsx';


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

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,  // ← Use Layout here, not App directly
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
        // Hero is now the landing page
    
    ]
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);