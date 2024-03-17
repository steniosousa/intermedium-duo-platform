import React, { useState } from 'react';
import {
  Avatar,
  Box,
  Menu,
  Button,
  IconButton,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Modal,
  Typography,
  InputAdornment,
  InputLabel,
  FormControl,
  OutlinedInput
} from '@mui/material';

import { IconListCheck, IconMail, IconUser } from '@tabler/icons';

import ProfileImg from 'src/assets/images/profile/user-1.jpg';
import { useContext } from 'react';
import AuthContext from 'src/contexto/AuthContext';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import Swal from 'sweetalert2';
import Api from 'src/api/service';

const Profile = () => {
  const style = {
    position: 'absolute',
    outline: 0,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 2,
    boxShadow: 24,
    p: 4,
  };

  const [showPassword, setShowPassword] = React.useState(false);
  const [anchorEl2, setAnchorEl2] = useState(null);
  const { Logout, user } = useContext(AuthContext)
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [openModal, setOpenModal] = useState(false)
  const [newPassword, setNewPassword] = useState('')
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };



  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };


  async function handleEdit() {
    if (0 == 0) {
      await Swal.fire({
        icon: 'Info',
        title: "Função em contrução",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Ok'
      })
      return
    }
    const userId = JSON.parse(user).id

    if (!newPassword) {
      await Swal.fire({
        icon: 'info',
        title: "Preencha todos os campos",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Ok'
      })
      return
    }
    try {
      await Api.post('manager/edit', {
        password: newPassword,
        id: userId
      })
      setOpenModal(false)
      await Swal.fire({
        icon: 'success',
        title: "Usuário editado com sucesso",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Ok'
      })
    } catch {
      setOpenModal(false)
      await Swal.fire({
        icon: 'error',
        title: "Erro ao editar usuário",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Ok'
      })
    }
  }
  return (
    <Box>
      <IconButton
        size="large"
        aria-label="show 11 new notifications"
        color="inherit"
        aria-controls="msgs-menu"
        aria-haspopup="true"
        sx={{
          ...(typeof anchorEl2 === 'object' && {
            color: 'primary.main',
          }),
        }}
        onClick={handleClick2}
      >
        <Avatar
          src={ProfileImg}
          alt={ProfileImg}
          sx={{
            width: 35,
            height: 35,
          }}
        />
      </IconButton>
      {/* ------------------------------------------- */}
      {/* Message Dropdown */}
      {/* ------------------------------------------- */}
      <Menu
        id="msgs-menu"
        anchorEl={anchorEl2}
        keepMounted
        open={Boolean(anchorEl2)}
        onClose={handleClose2}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        sx={{
          '& .MuiMenu-paper': {
            width: '200px',
          },
        }}
      >
        <MenuItem>
          <ListItemIcon>
            <IconUser width={20} />
          </ListItemIcon>
          <ListItemText onClick={() => setOpenModal(!openModal)}>Editar Perfil</ListItemText>
        </MenuItem>

        <MenuItem>
          <ListItemIcon>
            <IconListCheck width={20} />
          </ListItemIcon>
          <ListItemText>My Tasks</ListItemText>
        </MenuItem>
        <Box mt={1} py={1} px={2}>
          <Button variant="outlined" color="primary" fullWidth onClick={Logout}>
            Sair
          </Button>
        </Box>
      </Menu>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ justifyContent: 'center', display: 'flex' }}>
            EDITAR PERFIL
          </Typography>
          <Box style={{ display: "flex", flexDirection: 'column', justifyContent: 'center', alignItems: 'center', margin: 20 }}>
            <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
              <InputLabel htmlFor="outlined-adornment-password" >Senha</InputLabel>
              <OutlinedInput
                onChange={(e) => setNewPassword(e.target.value)}
                id="outlined-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>
            <Button variant="outlined" onClick={handleEdit}>Enviar</Button>

          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Profile;
