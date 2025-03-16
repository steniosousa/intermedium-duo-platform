import React, { lazy } from 'react';
import { Navigate } from 'react-router-dom';
import Loadable from '../layouts/full/shared/loadable/Loadable';
import HomeApp from 'src/App/home';
import LoginApp from 'src/App/login';
import DetailsApp from 'src/App/details/details';
import Localizador from 'src/Locale/localizador';
import ResetPassword from 'src/layouts/reset/resetPass';
import Home from 'src/home';
import FaceRecoginitionLogin from 'src/faceRecognition/authentication/Login';
import Recognition from 'src/faceRecognition/Recognition/recognition';
import CreateUserFaceRecognition from 'src/faceRecognition/CreateUser/create';
import { element } from 'prop-types';
import Configuracao from 'src/views/test/Configuracao';

const FullLayout = Loadable(lazy(() => import('../layouts/full/FullLayout')));
const BlankLayout = Loadable(lazy(() => import('../layouts/blank/BlankLayout')));

const Dashboard = Loadable(lazy(() => import('../views/dashboard/Dashboard')))
const SamplePage = Loadable(lazy(() => import('../views/sample-page/SamplePage')))
const Configuration = Loadable(lazy(() => import('src/views/test/Configuracao')))
const TypographyPage = Loadable(lazy(() => import('../views/utilities/TypographyPage')))
const Error = Loadable(lazy(() => import('../views/authentication/Error')));
const Register = Loadable(lazy(() => import('../views/authentication/Register')));
const Login = Loadable(lazy(() => import('../views/authentication/Login')));

const Router = [
  {
    path: '/',
    element: <BlankLayout />,
    children: [
      { path: '/', element: <Home /> },
    ],
  },
  {
    path: '/faceRecoginition',
    children: [
      { path: '/faceRecoginition/login', element: <FaceRecoginitionLogin /> },
      { path: '/faceRecoginition/Recognition', element: <Recognition /> },
      { path: '/faceRecoginition/createUser', element: <CreateUserFaceRecognition /> },
    ]
  },

  {
    path: '/',
    element: <FullLayout />,
    children: [
      { path: '/dashboard', exact: true, element: <Dashboard /> },
      { path: '/Localiza', exact: true, element: <SamplePage /> },
      { path: '/ui/Perfil', exact: true, element: <TypographyPage /> },
      { path: "/configuracao", expect: true, element: <Configuration /> },
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
    path: `/resetPass/:id`,
    children: [
      { path: '404', element: <Error /> },
      { path: '', element: <ResetPassword /> },
    ],
  }
];

export default Router;
