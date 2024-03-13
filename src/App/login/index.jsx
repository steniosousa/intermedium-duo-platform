import React from 'react';
import {
    Box,
    Typography,
    FormGroup,
    Button,
    Stack,
    Grid,
    Card,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import { useState } from 'react';
import Swal from 'sweetalert2';
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import PageContainer from 'src/components/container/PageContainer';

const LoginApp = ({ title, subtitle, subtext }) => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    async function handleLogin() {
        // if (!email) {
        //     await Swal.fire({
        //         icon: 'error',
        //         title: "Preencha todos os campos",
        //         showDenyButton: false,
        //         showCancelButton: false,
        //         showConfirmButton: true,
        //         denyButtonText: 'Cancelar',
        //         confirmButtonText: 'Ok'
        //     })
        //     return
        // }
        navigate('/app/home')
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
                                            fontWeight={600} component="label" htmlFor='username' mb="5px">Acessar com hash:</Typography>
                                        <CustomTextField id="username" variant="outlined" fullWidth onChange={(e) => setEmail(e.target.value)} />
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
                                    <Button
                                        color="primary"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        onClick={() => navigate('/app/home')}
                                    >
                                        Acessar
                                    </Button>
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
