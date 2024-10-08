import { CssBaseline, ThemeProvider } from '@mui/material';
import { useRoutes } from 'react-router-dom';
import Router from './routes/Router';

import { baselightTheme } from "./theme/DefaultColors";
import { useContext, useEffect } from 'react';
import AuthContext from './contexto/AuthContext';
import { useNavigate } from "react-router-dom";
function App() {
  const routing = useRoutes(Router);
  const theme = baselightTheme;
  const { setUser, setOperator } = useContext(AuthContext)
  const navigate = useNavigate();

  
  useEffect(() => {
    const platform = localStorage.getItem('manager')
    const app = localStorage.getItem("userApp")
    const FaceRecognition = localStorage.getItem('FaceRecognition')

  if(FaceRecognition){
    setUser(FaceRecognition)
    navigate('/faceRecoginition/createUser')

  }else if (platform) {
    setUser(platform)
    navigate('/dashboard')
  }else if(app){
    setOperator(app)
    navigate('/app/home')
  }else{
navigate('/')
  }

   
  }, [])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {routing}
    </ThemeProvider>
  );
}

export default App;
