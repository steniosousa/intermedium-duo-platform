import React, { useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    Button,
    Stack,
    Grid,
    Card,
    LinearProgress,
} from '@mui/material';
import Logo from '../assets/images/logos/intermedium-login.png'
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Api from 'src/api/service';
export default function Localizador() {
    const [position, setPosition] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [plate, setPlate] = useState('')
    const navigate = useNavigate()


    async function startMonitoring() {
        if (!plate) {
            await Swal.fire({
                icon: 'warning',
                title: "Informe a placa do caminhão",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Ok'
            })
            return
        }
        setIsLoading(true)
        navigator.geolocation.watchPosition(async (position) => {
            setPosition(position)
            try {
                await Api.post('/truck/monitoring', {
                    plate,
                    coords: {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    }
                })

            } catch (error) {
                await Swal.fire({
                    icon: 'error',
                    title: error.response.data.message,
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true,
                    denyButtonText: 'Cancelar',
                    confirmButtonText: 'Ok'
                })
            }
        }, (error) => {
            setIsLoading(false)
        });


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
                                <img src={Logo} height={100} alt="Logo" />
                            </Box>
                            <>


                                <Stack>
                                    <Box>
                                        <Typography variant="subtitle1"
                                            fontWeight={600} component="label" htmlFor='username' mb="5px">Placa do seu caminhão</Typography>
                                        <CustomTextField id="username" variant="outlined" fullWidth onChange={(e) => setPlate(e.target.value)} />
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
                                            onClick={startMonitoring}
                                        >
                                            Começar
                                        </Button>
                                    )}
                                </Box>
                                {position && (
                                    <p>
                                        Sua latitude é {position.coords.latitude} e sua longitude é {position.coords.longitude}.
                                    </p>
                                )}
                            </>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </PageContainer>)
}
