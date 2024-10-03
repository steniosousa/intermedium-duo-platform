import React, { useState } from 'react';
import {
    Box,
    FormGroup,
    Button,
    Stack,
    Grid,
    Card,
    LinearProgress,
    IconButton,
    InputAdornment,
    InputLabel,
    FormControl,
    OutlinedInput,
    Typography
} from '@mui/material';

import { Visibility, VisibilityOff } from '@mui/icons-material';

import PageContainer from 'src/components/container/PageContainer';
import { useNavigate, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import Api from 'src/api/service';


export default function ResetPassword() {
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const [password, setPassword] = useState('')
    const { id } = useParams();
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const [showPassword, setShowPassword] = React.useState(false);
    async function handleRegister() {
        if (isLoading) return
        setIsLoading(true)
        if (!password) {
            await Swal.fire({
                icon: 'info',
                title: "Informe a senha de cadastro",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Ok'
            })
            return
        }
        try {
            Api.post('/manager/resetPass', {
                password: password,
                id,
            })
            await Swal.fire({
                icon: 'success',
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: false,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Ok'
            })
            navigate('/auth/login')
        } catch {
            await Swal.fire({
                icon: 'error',
                title: "Erro ao cadastrar senha",
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
        <PageContainer title="Login" description="this is Login page">
            
            <Box
                sx={{
                    position: 'relative',
                    '&:before': {
                        content: '""',
                        background: 'radial-gradient(#d2f1df, #d3d7fa, #bad8f4)',
                        backgroundSize: '400% 400%',
                        animation: 'gradient 15s ease infinite',
                        position: 'absolute',
                        height: '100%',
                        width: '100%',
                        opacity: '0.3',
                    },
                }}
            >
                
                <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
                
                    <Grid
                        item
                        xs={12}
                        sm={12}
                        lg={4}
                        xl={3}
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                    >
                        
                        <Card elevation={9} sx={{ p: 4, zIndex: 1, width: '100%', maxWidth: '500px' }}>
                        <Typography variant="h6" gutterBottom>
            Resetar senha:
          </Typography>
                            <Stack>
                                <Box>
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
                                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                                    </IconButton>
                                                </InputAdornment>
                                            }
                                            label="Password"
                                        />
                                    </FormControl>
                                </Box>

                                <Stack justifyContent="space-between" direction="row" alignItems="center" my={2}>
                                    <FormGroup>
                                        <Button
                                            color="primary"
                                            variant="outlined"
                                            size="small"
                                            fullWidth
                                            onClick={() => navigate('/auth/login')}
                                        >
                                            Acessar plataforma web
                                        </Button>
                                    </FormGroup>
                                </Stack>
                            </Stack>
                            <Box>
                                {isLoading ? (
                                    <Button
                                        color="secondary"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                    >
                                        <Box sx={{ width: '100%' }}>
                                            <LinearProgress />
                                        </Box>

                                    </Button>
                                ) : (

                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        onClick={handleRegister}
                                    >
                                        Cadastrar
                                    </Button>
                                )}
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>
    )
}