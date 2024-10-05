import { useEffect, useRef, useState } from "react";
import * as faceapi from 'face-api.js';
import Swal from "sweetalert2";
import Api from "src/api/service";
import { Box,  Button } from "@mui/material";
import CameraswitchIcon from '@mui/icons-material/Cameraswitch';

export default function Recognition(){
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [whoCam, setWhoCam] = useState('environment')
    const [imagesUsers, setImagesUsers] = useState([])
    const [userDetect, setUSerDetect] = useState(null)
  
    const processPhotos = async (data) => {
      const descriptors= [];
      const images = await Promise.all(
        data.map(async (item, i) => {
          const base64Image = await base64ToImage(item.photo);
          const detections = await faceapi.detectAllFaces(base64Image, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceDescriptors();
          const userDescriptors = detections.map(d => d.descriptor);
          if (userDescriptors.length > 0) {
            descriptors.push(new faceapi.LabeledFaceDescriptors(item.name, userDescriptors));
          }
          return descriptors
        })
      );
      console.log(data)
      detect(images)
    };
  
  
    const identifyUser = async (detections, userDescriptors) => {
      if(userDescriptors.length == 0){
        processPhotos(imagesUsers)
      }

      if(!userDescriptors ) return
      try {
        let userLocalized;
        for (const item of userDescriptors) {
          const faceMatcher = new faceapi.FaceMatcher(item, 0.6);
          const results = detections.map(d => faceMatcher.findBestMatch(d.descriptor));
          results.forEach(async (result, i) => {
            if (result.label == "unknown" || !result.label) return
            userLocalized = result.label
          });
        }
  
        if (!userLocalized) return
        setUSerDetect(userLocalized)

        const confirm = await Swal.fire({
          icon: 'question',
          title: `${userLocalized}, entrar para carregar?`,
          showDenyButton: true,
          showCancelButton: false,
          showConfirmButton: true,
          denyButtonText: 'Não',
          confirmButtonText: 'Sim'
        })

        if(!confirm.isConfirmed){
          setUSerDetect(null)
         }
         else{
          const {id} = imagesUsers.find((item) => item.name == userLocalized)
            try {
              await Api.post(`/faceRecognition/edit`,{
                "driverId":id
              })
              const { data } = await Api.get('/faceRecognition/recover/')
              setImagesUsers(data)
              setUSerDetect(null)
            } catch (error) {
              console.log(error)
          }
        }
  
      
  
      } catch (error) {
        console.log(error)
      }
    };
  
    const detectAndIdentify = async (cameraId) => {
      try {
        const constraints = {
          video: {
            facingMode: cameraId ? { exact: cameraId } : whoCam 
          }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        const video = videoRef.current;
        video.srcObject = stream;
    
        const devices = await navigator.mediaDevices.enumerateDevices();
        const rearCamera = devices.find(device => device.kind === 'videoinput' && device.label.toLowerCase().includes('back'));
        if (rearCamera) {
          await detectAndIdentify(rearCamera.deviceId);
        } else {
          console.error('Câmera traseira não encontrada.');
        }
    
      } catch (err) {
        console.error('Erro ao acessar a câmera: ', err);
      }
    };
  
  
    async function detect(images) {

      if (!videoRef.current) return
  
      const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceDescriptors();
        
      identifyUser(detections, images);
    }
  
  
    const base64ToImage = (base64String) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (error) => reject(error);
        img.src = base64String;
      });
    };
  
  


    useEffect(() => {
      const interval = setInterval(() => {
        if (userDetect === null) {
          if(imagesUsers.length == 0) return
          processPhotos(imagesUsers)
        } else {
          clearInterval(interval);
        }
      }, 3000);
  
      return () => clearInterval(interval); 
    }, [userDetect,isModelLoaded]);

    
    useEffect(() => {
      (async () => {
        try {
          const MODEL_URL = '/models';
          await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
          await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
          await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
          setIsModelLoaded(true);
          detectAndIdentify()
        } catch (error) {
          console.error('Error loading models:', error);
        }
      })();
      (async () => {
        try {
          const { data } = await Api.get('/faceRecognition/recover/')
          setImagesUsers(data)
        } catch (error) {
          console.log(error)
        }
      })();
    }, [])



    return(
        <Box
      sx={{
        height: '100vh',
        width: '100%',
        padding: 0, // Remove o padding do Container para maximizar o espaço
        margin: 0,  // Remove a margem do Container
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative', // Posiciona o Container para ter um contexto relativo
        overflow: 'hidden'    // Garante que nada saia do Container
      }}
    >
      <video
        ref={videoRef}
        style={{
          position: 'absolute', // Faz o vídeo ocupar o Container inteiro
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',   // Faz o vídeo cobrir todo o Container
        }}
        muted
        autoPlay
        playsInline
      />
       
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', // Faz o canvas ocupar o Container inteiro
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'none', // Mantém o canvas oculto
        }}
      />

<Box style={{position:'absolute', top:'90%'}}>
                        <Button
                          variant="contained"
                          color="primary"
                          component="span"
                          size="small"
                          onClick={() => setWhoCam(whoCam === "environment" ? "user" : "environment")}
                        >
                          <CameraswitchIcon />
                        </Button>
                      </Box>
    </Box>
    )
}