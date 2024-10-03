import React from 'react';
import {
    FormGroup,
    Stack,
    CircularProgress,
    Box,
    Button,
    IconButton,
    Typography,
    InputAdornment,
    InputLabel,
    FormControl,
    OutlinedInput,
    TextField
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useState } from 'react';
import { useContext } from 'react';
import AuthContext from 'src/contexto/AuthContext';
import Swal from 'sweetalert2';
import Api from 'src/api/service';

const AuthLogin = ({ title,  subtext }) => {
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const [showPassword, setShowPassword] = React.useState(false);
    const [email, setEmail] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState('')
    const { LoginFaceRecognition } = useContext(AuthContext)
    const navigate = useNavigate()


    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    async function handleLogin() {
        setIsLoading(true)
        if (isLoading) return
        if (!email || !password) {
            await Swal.fire({
                icon: 'error',
                title: "Preencha todos os campos",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Ok'
            })

            setIsLoading(false)
            return
        }
        LoginFaceRecognition(email, password)
        setIsLoading(false)
    }

    async function handleForgorPass() {
        if (isLoading) return

        if (!email) {
            await Swal.fire({
                icon: 'info',
                title: "Informe seu email para recuperação",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Ok'
            })
            return
        }
        const confirm = await Swal.fire({
            icon: 'info',
            title: 'Deseja recuperar senha?',
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Confirmar'
        })
        if (!confirm.isConfirmed) return
        setIsLoading(true)
        try {
            await Api.post('/manager/recoverPass', {
                email
            })
            await Swal.fire({
                icon: 'success',
                html: "<h2>Verifique sua caixa de Email</h2>",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Ok'
            })
        } catch {
            await Swal.fire({
                icon: 'error',
                title: "Erro ao recuperar senha",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Ok'
            })
        }
        setIsLoading(false)
    }
    return (
        <>
            {title ? (
                <Typography fontWeight="700" variant="h2" mb={1}>
                    {title}
                </Typography>
            ) : null}

            {subtext}

            <Stack>
                <Box>
                    <TextField fullWidth id="outlined-basic" label="Email" variant="outlined" onChange={(e) => setEmail(e.target.value)} />

                </Box>
                <Box mt="25px">
                    <FormControl fullWidth variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password" >Senha</InputLabel>
                        <OutlinedInput
                            onChange={(e) => setPassword(e.target.value)}
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
                                        {!showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            }
                            label="Password"
                        />
                    </FormControl>
                </Box>
                <div style={{ width: '100%', color: 'grey', display: 'flex', justifyContent: 'end', cursor: 'pointer' }}>
                    <span onClick={handleForgorPass}>
                        Esqueci minha senha
                    </span>
                </div>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <Button
                            color="primary"
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={() => navigate('/faceRecoginition/Recognition')}
                        >
                            Leitura Facial
                        </Button>
                    </FormGroup>
                   
                </Stack>
            </Stack>
            <Box>
                <Button
                    color="primary"
                    variant="contained"
                    size="large"
                    fullWidth
                    component={Link}
                    type="submit"
                    onClick={(e) => handleLogin(e)}
                >
                    {isLoading ? (
                        <CircularProgress style={{ color: 'white' }} />
                    ) : (
                        <span>
                            Acessar
                        </span>
                    )}
                </Button>
            </Box>
        </>

    )
}

export default AuthLogin;
