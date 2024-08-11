import React, { useRef, useState } from 'react';
import {
    Box,
    Typography,
    FormGroup,
    Button,
    Stack,
    Grid,
    Card,
    LinearProgress,
    Container,
} from '@mui/material';
import CameraAltRoundedIcon from '@mui/icons-material/CameraAltRounded';
import FlipCameraIosIcon from '@mui/icons-material/FlipCameraIos';
import Logo from '../assets/images/logos/intermedium-login.png'
import CustomTextField from 'src/components/forms/theme-elements/CustomTextField';
import PageContainer from 'src/components/container/PageContainer';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

import { Camera } from "react-camera-pro";
import { Translate } from '@mui/icons-material';
export default function Localizador() {
    const [driver, setDriver] = useState('')
    const [position, setPosition] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [plate, setPlate] = useState('')
    const navigate = useNavigate()
    const camera = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [openCam, setOpenCam] = useState(false)





    async function Monitoring() {
        if (!plate || !driver || !photo) {
            await Swal.fire({
                icon: 'warning',
                title: "Preencha todos os campos",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Ok'
            });
            return;
        }

        setIsLoading(true);

    }

    const takePicture = async () => {
        if (camera.current) {
            const imageSrc = await camera.current.takePhoto();
            setPhoto(imageSrc);
            setOpenCam(!openCam)
        }
    };
    return (
        <PageContainer title="Login" description="this is Login page">



            {openCam ? (
                <Box>

                    <Box
                        sx={{
                            width: '100%',
                            height: 'auto',
                            aspectRatio: '16 / 9',
                            mb: 2,
                        }}
                    >
                        <Camera ref={camera} />
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={takePicture}
                        style={{
                            position: 'absolute',
                            bottom: 20,
                            left: '50%',
                            transform: 'translateX(-50%)'
                        }}
                    >
                        Tirar Foto
                    </Button>
                </Box>

            ) : (

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
                                                fontWeight={600} component="label" htmlFor='username' mb="5px">Placa do caminhão</Typography>
                                            <CustomTextField id="username" variant="outlined" fullWidth onChange={(e) => setPlate(e.target.value)} />
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle1"
                                                fontWeight={600} component="label" htmlFor='username' mb="5px">Motorista:</Typography>
                                            <CustomTextField id="username" variant="outlined" fullWidth onChange={(e) => setDriver(e.target.value)} />
                                        </Box>

                                        <Box display="flex" alignItems="center" justifyContent="center" marginTop={2}>
                                            {!photo ? (
                                                <Box display="flex" alignItems={'center'} flexDirection={'column'}>
                                                    <Typography>Retirar fotografia</Typography>
                                                    <CameraAltRoundedIcon size={20} style={{ cursor: "pointer" }} onClick={() => setOpenCam(!openCam)} />
                                                </Box>
                                            ) : (
                                                <Box>

                                                    <img
                                                        src={photo}
                                                        alt="Foto"
                                                        style={{ width: '100%', maxWidth: 400, marginTop: 10, borderRadius: 8 }}
                                                    />
                                                    <Box display="flex" alignItems={'center'} flexDirection={'column'}>
                                                        <Typography>Retirar novamente</Typography>
                                                        <FlipCameraIosIcon size={20} style={{ cursor: "pointer" }} onClick={() => setOpenCam(!openCam)} />
                                                    </Box>
                                                </Box>
                                            )}
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
                                            <>
                                                <Button
                                                    color="primary"
                                                    variant="contained"
                                                    size="large"
                                                    fullWidth
                                                    onClick={Monitoring}
                                                >
                                                    <Box sx={{ width: '100%' }}>
                                                        Parar
                                                    </Box>

                                                </Button>
                                                <LinearProgress />
                                            </>

                                        ) : (

                                            <Button
                                                color="primary"
                                                variant="contained"
                                                size="large"
                                                fullWidth
                                                onClick={Monitoring}
                                            >
                                                Enviar
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
            )}




        </PageContainer>)
}
