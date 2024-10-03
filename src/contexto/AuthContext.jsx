import { createContext, useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Api from "src/api/service";


const AuthContext = createContext({});
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [operator, setOperator] = useState(null)
  const navigate = useNavigate();

  async function Login(email, password) {
    try {
      const { data } = await Api.get('manager/find', {
        params: {
          email,
          password
        }
      });
      localStorage.setItem('manager', JSON.stringify(data))
      const manager = localStorage.getItem('manager')
      setUser(manager)
      navigate('/dashboard')
    }
    catch (error) {
      await Swal.fire({
        icon: 'error',
        title: "Erro ao efetuar login",
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

  async function LoginApp(key) {
    try {
      const { data } = await Api.get('user/find', { params: { key } })
      if (data.deactivatedAt) {
        await Swal.fire({
          icon: 'info',
          title: "Operário desativado",
          html: "<p>Peça ao seu administrador para reativá-lo(a)</p>",
          showDenyButton: false,
          showCancelButton: false,
          showConfirmButton: true,
          denyButtonText: 'Cancelar',
          confirmButtonText: 'Confirmar'
        })
        return
      }
      localStorage.setItem('userApp', JSON.stringify(data));
      navigate('/app/home')
    } catch {
      await Swal.fire({
        icon: 'error',
        title: "Hash inválido",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }

  async function LoginFaceRecognition(email, password) {
    try {
      const { data } = await Api.get('manager/find', {
        params: {
          email,
          password
        }
      });
      localStorage.setItem('FaceRecognition', JSON.stringify(data))
      const manager = localStorage.getItem('manager')
      setUser(manager)
      navigate('/faceRecoginition/createUser')
    }
    catch (error) {
      await Swal.fire({
        icon: 'error',
        title: "Erro ao efetuar login",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
  }



  function LogoutApp() {
    localStorage.removeItem('userApp');
    navigate('/app/login')
  }
  return (
    <AuthContext.Provider value={{ signed: Boolean(user), user, setUser, Login, Logout, LoginApp,LoginFaceRecognition, setOperator, operator, LogoutApp }}>
      {children}
    </AuthContext.Provider>
  );
};
export default AuthContext;