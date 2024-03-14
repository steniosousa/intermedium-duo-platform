import React, { useContext } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    Button,
    Stack,
    Grid,
    Card,
    CircularProgress,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { useState } from 'react';
import Swal from 'sweetalert2';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import PageContainer from 'src/components/container/PageContainer';
import AuthContext from 'src/contexto/AuthContext';

const LoginApp = ({ subtitle }) => {
    const [key, setKey] = useState('0GQE1S')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const { LoginApp } = useContext(AuthContext)
    async function handleLogin() {
        setIsLoading(true)
        if (isLoading) return
        if (!key) {
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
        LoginApp(key)
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
                            <Box display="flex" alignItems="center" justifyContent="center">
                                Intermedium
                            </Box>
                            <>


                                <Stack>
                                    <Box>
                                        <Typography variant="subtitle1"
                                            fontWeight={600} component="label" htmlFor='username' mb="5px">Digite sua chave de acesso</Typography>
                                        <CustomTextField id="username" variant="outlined" fullWidth onChange={(e) => setKey(e.target.value)} />
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
                                            <CircularProgress />
                                        </Button>
                                    ) : (

                                        <Button
                                            color="primary"
                                            variant="contained"
                                            size="large"
                                            fullWidth
                                            onClick={handleLogin}
                                        >
                                            Acessar
                                        </Button>
                                    )}
                                </Box>
                                {subtitle}
                            </>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>

    )
}

export default LoginApp;
