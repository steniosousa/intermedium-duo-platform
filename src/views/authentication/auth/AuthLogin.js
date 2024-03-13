import React from 'react';
import {
    Box,
    Typography,
    FormGroup,
    Button,
    Stack,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import { useState } from 'react';
import { useContext } from 'react';
import AuthContext from 'src/contexto/AuthContext';
import Swal from 'sweetalert2';

const AuthLogin = ({ title, subtitle, subtext }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const { Login } = useContext(AuthContext)
    const navigate = useNavigate()
    async function handleLogin() {
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
            return
        }
        Login(email, password)
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
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='username' mb="5px">Email</Typography>
                    <CustomTextField id="username" variant="outlined" fullWidth onChange={(e) => setEmail(e.target.value)} />
                </Box>
                <Box mt="25px">
                    <Typography variant="subtitle1"
                        fontWeight={600} component="label" htmlFor='password' mb="5px" >Senha</Typography>
                    <CustomTextField id="password" type="password" variant="outlined" fullWidth onChange={(e) => setPassword(e.target.value)} />
                </Box>
                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                    <FormGroup>
                        <Button
                            color="primary"
                            variant="outlined"
                            size="small"
                            fullWidth
                            onClick={() => navigate('/app/login')}
                        >
                            Acessar o app
                        </Button>
                    </FormGroup>
                    <Typography
                        component={Link}
                        fontWeight="500"
                        sx={{
                            textDecoration: 'none',
                            color: 'primary.main',
                        }}
                    >
                        Forgot Password ?
                    </Typography>
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
                    Acessar
                </Button>
            </Box>
            {subtitle}
        </>

    )
}

export default AuthLogin;
