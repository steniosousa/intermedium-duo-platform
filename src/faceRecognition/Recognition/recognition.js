import { useEffect, useRef, useState } from "react";
import * as faceapi from 'face-api.js';
import Swal from "sweetalert2";
import Api from "src/api/service";
import { Box,  Button, IconButton, Tooltip } from "@mui/material";
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';
import Webcam from 'react-webcam';
import LockIcon from '@mui/icons-material/Lock';

export default function Recognition(){
  const [typeCam, setTypeCam] = useState('user')
  const [accessDenied, setAccessDenied] = useState(false)
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [imagesUsers, setImagesUsers] = useState([])
    const [userDetected, setUserDetected] = useState({})
    const webcamRef = useRef(null);

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: typeCam } });
        webcamRef.current.srcObject = stream;
        setAccessDenied(false);
      } catch (err) {
        if (err.name === 'NotAllowedError') {
          setAccessDenied(true);
        }
      }
    };

    async function capture() {
      const imageSrc = webcamRef.current.video;
      const detections = await faceapi.detectAllFaces(imageSrc, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
    
     
      if (detections.length > 0  ) {
        const userDescriptors = await Promise.all(imagesUsers.map(async (user) => {
          const img = await faceapi.fetchImage(user.photo); 
          const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
          return detections.length > 0 ? detections[0].descriptor : null;
        }));
    
        const capturedDescriptor = detections[0].descriptor;
    
        await Promise.all(userDescriptors.map(async (userDescriptor, index) => {
          if (userDescriptor) {
            const distance = faceapi.euclideanDistance(capturedDescriptor, userDescriptor);
            if (distance < 0.6) {
              setUserDetected(imagesUsers[index])
            }
          }
        }));
      }
      capture();
    }


    useEffect(() =>{
      (async() =>{
        if (userDetected && Object.keys(userDetected).length === 0) return;

        try {
          const confirm = await Swal.fire({
            icon: 'question',
            title: `${userDetected.name}, iniciar carregamento?`,
            showDenyButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            denyButtonText: 'Não',
            confirmButtonText: 'Sim'
          });
  
          if (!confirm.isConfirmed) {
            setUserDetected({})
            return; 
          }
          await Api.post(`/faceRecognition/edit`, {
            "driverId": userDetected.id
          });
          const { data } = await Api.get('/faceRecognition/recover/');
          setImagesUsers(data);
        } catch (error) {
          console.log(error);
        }
      })()
    },[userDetected])

    
    useEffect(() => {
      startCamera();
    }, [isModelLoaded]);

    useEffect(() =>{
      capture();
    },[imagesUsers])


    useEffect(() => {
      (async () => {
        try {
          const MODEL_URL = '/models';
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
          setIsModelLoaded(true);
        } catch (error) {
          await Swal.fire({
            icon: 'error',
            title: 'Erro ao iniciar reconhecimento facial',
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: true,
            denyButtonText: 'Não',
            confirmButtonText: 'Ok!'
          });
        }
      })();
      (async () => {
        try {
          const { data } = await Api.get('/faceRecognition/recover/')
          setImagesUsers(data)
        } catch (error) {
          await Swal.fire({
            icon: 'error',
            title: 'Erro ao recuperar caminhoneiros',
            showDenyButton: false,
            showCancelButton: false,
            showConfirmButton: true,
            denyButtonText: 'Não',
            confirmButtonText: 'Ok!'
          });
        }
      })();
    }, [])



    return(
      <Box
      sx={{
        height: '100vh',
        width: '100%',
        padding: 0,
        margin: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        videoConstraints={{
          facingMode: typeCam,
        }}
      />

      <Box style={{ position: 'absolute', top: '90%' }}>
        <Button
          variant="contained"
          color="primary"
          component="span"
          size="small"
          onClick={() => setTypeCam(typeCam === "environment" ? "user" : "environment")}
        >
          <CameraswitchIcon />
        </Button>
      </Box>

      {accessDenied && (
        <Box style={{ position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)', color: 'orange' }}>
          Você negou o acesso à câmera. Para usar este recurso,
          <Tooltip title="Clique no ícone de cadeado para permitir acesso." arrow>
            <IconButton>
              <LockIcon />
            </IconButton>
          </Tooltip>
          ajuste as configurações do seu navegador.
        </Box>
      )}
    </Box>
    )
}