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
    const plataform = localStorage.getItem('manager')
    const app = localStorage.getItem("userApp")
    if (plataform && app) {
      navigate('/auth/login')
    } else if (plataform) {
      setUser(plataform)
      navigate('/dashboard')
    } else if (app) {
      setOperator(app)
      navigate('/app/home')
    } else {
      navigate('/auth/login')

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
