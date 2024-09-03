import React, { useEffect, useRef, useState } from 'react';
import { Container, TextField, Button, IconButton, Box, Typography, Avatar } from '@mui/material';
import { CameraAlt, Delete } from '@mui/icons-material';
import * as faceapi from 'face-api.js';
import Api from 'src/api/service';
import Swal from 'sweetalert2';

export default function RegistrationForm() {
  const [name, setName] = useState('');
  const [plate, setPlate] = useState('');
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [blobImage, setBlobImage] = useState(null)
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const startCamera = async () => {
    try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
        }
    } catch (error) {
        console.error('Error accessing camera:', error);
    }
};

  function handleRemoveImage(){
    setImagePreview('')
  }

  const capturePhoto = async (event) => {
    event.preventDefault()

        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        if (context) {
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            canvas.toBlob((blob) => {
                if (blob) {
                    setBlobImage(blob)
                }
            }, 'image/jpeg');
            setImage(canvasRef.current.toDataURL('image/png'));
        }
   
};
 useEffect(() => {
        const loadModels = async () => {
            try {
                const MODEL_URL = '/models';
                await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
                await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
                await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
            } catch (error) {
                console.error('Error loading models:', error);
            }
        };

        loadModels();
    }, []);
  useEffect(() =>{
    startCamera()
  },[])


  async function handleSubmit(e) {
        e.preventDefault()

         if (!blobImage || !image || !name || !plate) {
                await Swal.fire({
                    icon: 'info',
                    title: "Preencha todos os campos",
                    showDenyButton: false,
                    showCancelButton: false,
                    showConfirmButton: true,
                    denyButtonText: 'Cancelar',
                    confirmButtonText: 'Confirmar'
                })
                return
            }
        const formData = new FormData();
        formData.append('name', name);
        formData.append('plate', plate);
        formData.append('photo', image);
        try {
            const image = await faceapi.bufferToImage(blobImage);

            const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceDescriptors();

            if (detections.length > 0) {
                const [descriptor] = detections.map(d => d.descriptor);
                if (descriptor) {
                  const descriptorString = JSON.stringify(Array.from(descriptor));
                  formData.append('descritor', descriptorString);
                }
            }
        } catch (error) {
            console.error('Error processing photo:', error);
        }

        

        try {
          
            await Api.post('/faceRecognition/create', formData)
            await Swal.fire({
                icon: 'success',
                title: "Motorista cadastrado com sucesso",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        } catch (error) {
            console.log(error)
            // await Swal.fire({
            //     icon: 'error',
            //     title: 'error.response.data.error',
            //     showDenyButton: false,
            //     showCancelButton: false,
            //     showConfirmButton: true,
            //     denyButtonText: 'Cancelar',
            //     confirmButtonText: 'Confirmar'
            // })

        }
    }

  return (
  <Container maxWidth="sm" sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ textAlign: 'center', mb: 3 }}>
        Formulário de Cadastro
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          alignItems: 'center',
          backgroundColor: 'white',
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        {/* Seção de Foto */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Foto do Carro
          </Typography>
          {imagePreview ? (
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={imagePreview}
                alt="Foto do Carro"
                sx={{ width: 100, height: 100, mb: 1, border: '2px solid #1976d2' }}
              />
              <IconButton
                onClick={handleRemoveImage}
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  backgroundColor: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  },
                }}
              >
                <Delete />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
              <video ref={videoRef} width="100%" height="auto" autoPlay muted />
              <canvas
                ref={canvasRef}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'none',
                }}
              />
             
              
                <Button variant="contained" color="primary" component="span" size="small" onClick={(e) =>capturePhoto(e)}>
                <CameraAlt/>
                </Button>
            </Box>
          )}
        </Box>

        <TextField
          label="Nome Completo"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
          size="small"
        />

        <TextField
          label="Placa do Carro"
          variant="outlined"
          fullWidth
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          sx={{ mb: 2 }}
          size="small"
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          size="large"
        >
          Enviar
        </Button>
      </Box>
    </Container>
  );
}
