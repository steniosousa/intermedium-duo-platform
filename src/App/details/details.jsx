import { useLocation } from "react-router-dom";
import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import ImageIcon from '@mui/icons-material/Gite';
import WorkIcon from '@mui/icons-material/Work';
import Header from "../components/header";
import { Box, Button, CircularProgress, Modal } from "@mui/material";
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Webcam from 'react-webcam';
import Api from "src/api/service";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function DetailsApp() {
    const location = useLocation();
    const navigate = useNavigate()
    const [entrance, setEntrance] = React.useState('')
    const [exit, setExit] = React.useState('')
    const [observation, setObservation] = React.useState('')
    const [observation1, setObservation1] = React.useState('')
    const [observation2, setObservation2] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [status, setStatus] = React.useState('')
    const webcamRef = React.useRef(null);
    const style = {
        position: "absolute",
        width: "100%",
        height: "auto",
        display: 'flex',
        flexDirection: 'column',
        border: "none"
    };
    const [type, setType] = React.useState('')
    let clear = location.state;
    const [open, setOpen] = React.useState(false);
    const currentImages = localStorage.getItem(clear.id);

    function handleOpenModal(TypeEvidence) {
        setIsLoading(true)
        setType(TypeEvidence)
        setOpen(true)
        setTimeout(() => {
            setIsLoading(false)

        }, 2000)
    }
    ;
    const handleClose = () => setOpen(false);

    async function capture(TypeEvidence) {
        if (isLoading) return
        if (!TypeEvidence) return
        const imageSrc = await webcamRef.current.getScreenshot();
        let updatedImages = [];
        if (currentImages) {
            updatedImages = JSON.parse(currentImages);
            const alredyExist = updatedImages.find((item) => TypeEvidence === item.type)
            if (alredyExist) return
            updatedImages.push({ "type": TypeEvidence, evidenceUrl: imageSrc });
        } else {
            updatedImages.push({ "type": TypeEvidence, evidenceUrl: imageSrc });
        }

        localStorage.setItem(clear.id, JSON.stringify(updatedImages));
        setOpen(false)
    }

    async function finishCleaning() {
        setIsLoading(true)
        if (isLoading) return
        if (!entrance || !exit) {
            await Swal.fire({
                icon: 'warning',
                title: "Retire as evidências obrigatórias",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
            setIsLoading(false)
            return
        }
        getEvidences()
        const jsonCurrentImages = JSON.parse(currentImages)
        try {
            await Api.post('/cleaning/update', { body: { Evidences: jsonCurrentImages, id: clear.id, status: "CONCLUIDO" } });
            navigate('/app/home')
        } catch {
            await Swal.fire({
                icon: 'error',
                title: "Erro ao atualizar solicitações",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
        setIsLoading(false)
    }
    async function handleSubmit() {
        if (status === "PENDENTE") {
            editStatusCleaning("ASSUMIDO")
            return
        }
        finishCleaning()
    }

    async function editStatusCleaning(status) {
        setIsLoading(true)
        const objSand = {
            id: clear.id, status
        }
        try {
            const { data } = await Api.post('/cleaning/update/status', objSand);
            setStatus(data.status)
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)

        }
    }


    function getEvidences() {
        const jsonCurrentImages = JSON.parse(currentImages)
        if (!jsonCurrentImages) return
        jsonCurrentImages.map((item) => {
            if (item.type === "ENTRANCE") {
                setEntrance(item.evidenceUrl)
            }
            if (item.type === "EXIT") {
                setExit(item.evidenceUrl)
            }
            if (item.type === "OBSERVATION") {
                setObservation(item.evidenceUrl)
            }
            if (item.type === "OBSERVATION1") {
                setObservation1(item.evidenceUrl)
            }
            if (item.type === "OBSERVATION2") {
                setObservation2(item.evidenceUrl)
            }
        })

    }
    const [facingMode, setFacingMode] = React.useState('environment');
    const handleCameraSwitch = () => {
        setFacingMode(facingMode === 'environment' ? 'user' : 'environment');
    };

    React.useEffect(() => {
        getEvidences()
        setStatus(clear.status)
    }, [open])

    return (
        <>
            <Header />
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <ImageIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Ambiente" secondary={clear.Place.name} />
                </ListItem>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar>
                            <WorkIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="Objetos" secondary={clear.ObjectOfCleaning.map((object) => `${object.object.name}, `)} />
                </ListItem>
                <div style={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'space-around', marginTop: 20 }}>
                    <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-around' }}>
                        {entrance ? (
                            <img src={entrance} alt="img" width="30%" height="150px" style={{ borderRadius: 5 }} />
                        ) : (
                            <div onClick={() => handleOpenModal("ENTRANCE")} style={{ background: '#add8e6', borderRadius: 10, height: 100, width: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar>

                                    <CameraAltIcon />
                                </Avatar>
                            </div>
                        )}
                        {exit ? (
                            <img src={exit} alt="img" width="30%" height="150px" style={{ borderRadius: 5 }} />
                        ) : (
                            <div onClick={() => handleOpenModal("EXIT")} style={{ background: '#add8e6', borderRadius: 10, height: 100, width: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar>

                                    <CameraAltIcon />
                                </Avatar>
                            </div>
                        )}

                    </div>
                    <div style={{ display: 'flex', flexDirection: "row", justifyContent: 'space-around', marginTop: 5 }}>
                        {observation ? (
                            <img src={observation} alt="img" width="30%" height="150px" style={{ borderRadius: 5 }} />
                        ) : (
                            <div onClick={() => handleOpenModal("OBSERVATION")} style={{ background: '#add8e6', borderRadius: 10, height: 100, width: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar>
                                    <CameraAltIcon />
                                </Avatar>
                            </div>
                        )}
                        {observation1 ? (
                            <img src={observation1} alt="img" width="30%" height="150px" style={{ borderRadius: 5 }} />
                        ) : (
                            <div onClick={() => handleOpenModal("OBSERVATION1")} style={{ background: '#add8e6', borderRadius: 10, height: 100, width: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar>

                                    <CameraAltIcon />
                                </Avatar>
                            </div>
                        )}
                        {observation2 ? (
                            <img src={observation2} alt="img" width="30%" height="150px" style={{ borderRadius: 5 }} />
                        ) : (
                            <div onClick={() => handleOpenModal("OBSERVATION2")} style={{ background: '#add8e6', borderRadius: 10, height: 100, width: 90, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                <Avatar>
                                    <CameraAltIcon />
                                </Avatar>
                            </div>
                        )}
                    </div>
                </div>
            </List>
            <Button variant={isLoading ? "outlined" : "contained"} color="primary" style={{ width: '80%', marginLeft: '10%' }} onClick={() => handleSubmit()}>
                {isLoading ? (<CircularProgress />) : (
                    <span>
                        {status === 'ASSUMIDO' ? "CONCLUIR" : "ASSUMIR"}
                    </span>
                )}
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Webcam
                        videoConstraints={{ facingMode }}
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                    />
                    <button onClick={handleCameraSwitch}>Alterar câmera</button>

                    <button onClick={() => capture(type)} style={{ border: "none", marginTop: 10, background: 'transparent', display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                        {isLoading ? (
                            <Avatar>
                                <CircularProgress />
                            </Avatar>
                        ) : (
                            <Avatar>
                                <CameraAltIcon />
                            </Avatar>
                        )}
                    </button>
                </Box>
            </Modal>
        </>

    )
}