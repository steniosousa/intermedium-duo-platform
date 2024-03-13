import { createContext, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Api from "src/api/service";


const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function Login(email, password) {
    try {
      const { data } = await Api.get('manager/find', {
        params: {
          email,
          password
        }
      });
      localStorage.setItem('token', data.id);
      localStorage.setItem('manager', JSON.stringify(data))
      const manager = localStorage.getItem('manager')
      setUser(manager)
      navigate('/dashboard')
    }
    catch (error) {
      await Swal.fire({
        icon: 'error',
        title: error.response.data,
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }

  function Logout() {
    localStorage.clear();
    setUser(null);
    navigate('/auth/login')
    return null
  }

  return (
    <AuthContext.Provider value={{ signed: Boolean(user), user, setUser, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;