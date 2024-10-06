import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import Swal from "sweetalert2";
import Api from "src/api/service";
import { Box, Button, IconButton, Tooltip } from "@mui/material";
import FingerprintSharpIcon from '@mui/icons-material/FingerprintSharp';
import Webcam from "react-webcam";
import LockIcon from "@mui/icons-material/Lock";

export default function Recognition() {
	const [accessDenied, setAccessDenied] = useState(false);
	const [isModelLoaded, setIsModelLoaded] = useState(false);
	const [imagesUsers, setImagesUsers] = useState([]);
	const webcamRef = useRef(null);

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: "user" },
			});

			if (!webcamRef.current) return;
			webcamRef.current.srcObject = stream;
			setAccessDenied(false);
		} catch (err) {
			if (err.name === "NotAllowedError") {
				setAccessDenied(true);
			}
		}
	};


	async function capture() {
    const { data } = await Api.get("/faceRecognition/recover/");
		const imageSrc = webcamRef.current.video;
		const detections = await faceapi
			.detectAllFaces(imageSrc, new faceapi.TinyFaceDetectorOptions())
			.withFaceLandmarks()
			.withFaceDescriptors();

		if (detections.length > 0) {
			const userDescriptors = await Promise.all(
				data.map(async (user) => {
					const img = await faceapi.fetchImage(user.photo);
					const detections = await faceapi
						.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
						.withFaceLandmarks()
						.withFaceDescriptors();
					return detections.length > 0 ? detections[0].descriptor : null;
				}),
			);

      const [detection] = detections
			const capturedDescriptor = detection.descriptor;

			const index = userDescriptors.findIndex((userDescriptor, index) => {
        if(!userDescriptor) return false;

				const distance = faceapi.euclideanDistance(
					capturedDescriptor,
					userDescriptor,
				);
				if (distance < 0.6) return true;
			});

      const user = data[index];
			if (!user) {
				return;
			}

			try {
				const confirm = await Swal.fire({
					icon: "question",
					title: `${user.name}, iniciar carregamento?`,
					showDenyButton: true,
					showCancelButton: false,
					showConfirmButton: true,
					denyButtonText: "Não",
					confirmButtonText: "Sim",
				});

				if (!confirm.isConfirmed) {
					return;
				}
				await Api.post(`/faceRecognition/edit`, {
					driverId: user.id,
				});
			} catch (error) {
        capture()
			}
		}
	}

	useEffect(() => {
		startCamera();
	}, [isModelLoaded]);

	useEffect(() => {
		(async () => {
			try {
				const MODEL_URL = "/models";
				await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
				await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
				await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
				setIsModelLoaded(true);
			} catch (error) {
				await Swal.fire({
					icon: "error",
					title: "Erro ao iniciar reconhecimento facial",
					showDenyButton: false,
					showCancelButton: false,
					showConfirmButton: true,
					denyButtonText: "Não",
					confirmButtonText: "Ok!",
				});
			}
		})();
		(async () => {
			try {
				const { data } = await Api.get("/faceRecognition/recover/");
				setImagesUsers(data);
			} catch (error) {
				await Swal.fire({
					icon: "error",
					title: "Erro ao recuperar caminhoneiros",
					showDenyButton: false,
					showCancelButton: false,
					showConfirmButton: true,
					denyButtonText: "Não",
					confirmButtonText: "Ok!",
				});
			}
		})();
	}, []);

	return (
		<Box
			sx={{
				height: "100vh",
				width: "100%",
				padding: 0,
				margin: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				position: "relative",
				overflow: "hidden",
			}}
		>
			<Webcam
				audio={false}
				ref={webcamRef}
				screenshotFormat="image/jpeg"
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					objectFit: "cover",
				}}
				videoConstraints={{
					facingMode: "user",
				}}
			/>

			<Box
      style={{position:'absolute', bottom: '5%'}}
			>
				
				<Button component="span" size="large" onClick={capture} >
					<FingerprintSharpIcon style={{fontSize:"150px"}} color={"success"}/>
				</Button>
				</Box>


			{accessDenied && (
				<Box
					style={{
						position: "absolute",
						bottom: "10%",
						left: "50%",
						transform: "translateX(-50%)",
						color: "orange",
					}}
				>
					Você negou o acesso à câmera. Para usar este recurso,
					<Tooltip
						title="Clique no ícone de cadeado para permitir acesso."
						arrow
					>
						<IconButton>
							<LockIcon />
						</IconButton>
					</Tooltip>
					ajuste as configurações do seu navegador.
				</Box>
			)}
		</Box>
	);
}
