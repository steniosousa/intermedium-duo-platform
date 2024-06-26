import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import HomeApp from 'src/App/home';
import LoginApp from 'src/App/login';
import DetailsApp from 'src/App/details/details';
import Localizador from 'src/Locale/localizador';
import ResetPassword from 'src/layouts/reset/resetPass';

/* ***Layouts**** */
const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

/* ****Pages***** */
const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));

const Router = [
  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/', element: <Navigate to="/dashboard" /> },
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/Localiza', exact: true, element: <SamplePage /> },
      // { path: '/icons', exact: true, element: <Icons /> },
      { path: '/ui/Perfil', exact: true, element: <TypographyPage /> },
      // { path: '/ui/shadow', exact: true, element: <Shadow /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },

  {
    path: '/auth',
    element: <BlankLayout />,
    children: [
      { path: '404', element: <Error /> },
      { path: '/auth/register', element: <Register /> },
      { path: '/auth/login', element: <Login /> },
      { path: '*', element: <Navigate to="/auth/404" /> },
    ],
  },
  {
    path: "/app",
    children: [
      { path: '404', element: <Error /> },
      { path: '/app/login', element: <LoginApp /> },
      { path: '/app/home', element: <HomeApp /> },
      { path: '/app/details', element: <DetailsApp /> },

    ]
  },
  {
    path: "/localizador",
    
    children: [
      { path: '404', element: <Error /> },
      { path: '/localizador/home', element: <Localizador /> },
    ]
  },
  {
    path: `/resetPass/:id`, // Add ":id" to capture the ID parameter
    children: [
      { path: '404', element: <Error /> },
      { path: '', element: <ResetPassword /> }, // Render the ResetPassword component
    ],
  }
];

export default Router;
