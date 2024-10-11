import React, { useContext, useEffect, useRef, useState } from "react";
import {
	Container,
	TextField,
	Button,
	IconButton,
	Box,
	Typography,
	Avatar,
	Card,
	CardContent,
	Grid,
	CircularProgress,
	Tooltip,
} from "@mui/material";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import * as faceapi from "face-api.js";
import Api from "src/api/service";
import Swal from "sweetalert2";
import CameraIcon from "@mui/icons-material/Camera";
import ThreeSixtyIcon from "@mui/icons-material/ThreeSixty";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LogoutSharpIcon from "@mui/icons-material/LogoutSharp";
import CameraRearIcon from "@mui/icons-material/CameraRear";
import { useNavigate } from "react-router";
import AuthContext from "src/contexto/AuthContext";
import Webcam from "react-webcam";
import LockIcon from "@mui/icons-material/Lock";

export default function RegistrationForm() {
	const [accessDenied, setAccessDenied] = useState(false);
	const [name, setName] = useState("");
	const [plate, setPlate] = useState("");
	const [image, setImage] = useState(null);
	const webcamRef = useRef(null);
	const [typeCam, setTypeCam] = useState("environment");
	const [drivers, setDrivers] = useState([""]);
	const navigate = useNavigate();
	const { setUser } = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(false);

	const startCamera = async () => {
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: typeCam },
			});
			webcamRef.current.srcObject = stream;
			setAccessDenied(false);
		} catch (err) {
			if (err.name === "NotAllowedError") {
				setAccessDenied(true);
			}
		}
	};

	useEffect(() => {
		startCamera();
	}, []);

	const capturePhoto = async () => {
		setIsLoading(true)
		const imageSrc = await webcamRef.current.getScreenshot();
		const img = await faceapi.fetchImage(imageSrc);
		setImage(imageSrc)

		const detections = await faceapi
			.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
			.withFaceLandmarks()
			.withFaceDescriptors();
		
		if (detections.length <= 0) {
			const htmlContent = `
                      <div style="text-align: center;">
                        <h4>A foto que você retirou não permitiu a leitura das expressões faciais.</h4>
                        <p>Tente tirar a foto novamente.</p>
                      </div>
                    `;
			await Swal.fire({
				icon: "question",
				html: htmlContent,
				showDenyButton: false,
				showCancelButton: false,
				showConfirmButton: true,
				confirmButtonText: "Ok!",
			});
			setIsLoading(false)

			setImage(null);
			return;
		}
		setIsLoading(false)
		setImage(imageSrc);
	};
	

	async function handleSubmit(e) {
		e.preventDefault();
		if (isLoading) {
			return;
		}
		setIsLoading(true);
		if (!image || !name || !plate) {
			await Swal.fire({
				icon: "info",
				title: "Preencha todos os campos",
				showDenyButton: false,
				showCancelButton: false,
				showConfirmButton: true,
				denyButtonText: "Cancelar",
				confirmButtonText: "Confirmar",
			});
			setIsLoading(false);

			return;
		}
		const formData = new FormData();
		formData.append("name", name);
		formData.append("plate", plate);
		formData.append("photo", image);

		try {
			await Api.post("/faceRecognition/create", formData);
			await Swal.fire({
				icon: "success",
				title: "Motorista cadastrado com sucesso",
				showDenyButton: false,
				showCancelButton: false,
				showConfirmButton: true,
				denyButtonText: "Cancelar",
				confirmButtonText: "Confirmar",
			});
			setName("");
			setPlate("");
			setImage(null);
			getDrivers();
		} catch (error) {
			await Swal.fire({
				icon: "error",
				title: "Erro ao cadastrar motorista",
				showDenyButton: false,
				showCancelButton: false,
				showConfirmButton: true,
				denyButtonText: "Cancelar",
				confirmButtonText: "Confirmar",
			});
		}
		setIsLoading(false);
	}

	async function recapture(title) {
		const confirm = await Swal.fire({
			icon: "question",
			title: title,
			showDenyButton: true,
			showCancelButton: false,
			showConfirmButton: true,
			denyButtonText: "Não",
			confirmButtonText: "Sim",
		});
		if (!confirm.isConfirmed) {
			return;
		}
		setImage(null);
	}

	async function getDrivers() {
		try {
			const { data } = await Api.get("/faceRecognition/list");
			setDrivers(data);
		} catch (error) {
			console.log(error);
		}
	}

	async function deleteDriver(id) {
		const confirm = await Swal.fire({
			icon: "question",
			title: "Deseja deletar o motorista?",
			showDenyButton: true,
			showCancelButton: false,
			showConfirmButton: true,
			denyButtonText: "Cancelar",
			confirmButtonText: "Deletar",
		});
		if (!confirm.isConfirmed) {
			return;
		}

		try {
			await Api.post("/faceRecognition/delete", {
				driverId: id,
			});
			getDrivers();
		} catch (error) {
			console.log(error);
		}
	}

	function Logout() {
		localStorage.removeItem("FaceRecognition");
		setUser(null);
		navigate("/faceRecoginition/login",{ replace: true });
		return null;
	}

	useEffect(() => {
		getDrivers();
	}, []);

	useEffect(() => {
		(async () => {
			try {
				const MODEL_URL = "/models";
				await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
				await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
				await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
			} catch (error) {
				console.error("Error loading models:", error);
			}
		})()
	}, []);

	return (
		<Box style={{ height: "100vh", width: "100%", backgroundColor: "#f0f4f8" }}>
			<Grid
				container
				justifyContent="flex-end"
				alignItems="flex-start"
				style={{ width: "100%", backgroundColor: "#f0f4f8", padding: "10px" }}
			>
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
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						component="span"
						size="small"
						onClick={() => navigate("/faceRecoginition/Recognition")}
					>
						<CameraRearIcon />
					</Button>
				</Grid>
				<Grid item>
					<Button
						variant="contained"
						color="primary"
						component="span"
						size="small"
						onClick={Logout}
					>
						<LogoutSharpIcon />
					</Button>
				</Grid>
			</Grid>
			<Container maxWidth="lg" sx={{ py: 4 }}>
				<Grid container spacing={2}>
					<Grid item xs={4}>
						<Card variant="outlined" sx={{ height: "100%", p: 2 }}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Lista de Motoristas
								</Typography>
								<Grid container spacing={2}>
									{drivers.length === 0 ? (
										<Typography
											variant="body2"
											color="text.secondary"
											style={{ padding: "20px" }}
										>
											Nenhum motorista encontrado.
										</Typography>
									) : (
										drivers.map((driver) => (
											<Grid
												key={Math.random()}
												item
												container
												spacing={2}
												alignItems="center"
											>
												<Grid item>
													<Avatar
														alt={driver.name}
														src={driver.photo}
														sx={{ width: 56, height: 56 }}
													/>
												</Grid>
												<Grid item xs>
													<Typography variant="h6">
														{driver.name} - {driver.plate}
													</Typography>
													<Typography
														variant="body2"
														style={{ fontWeight: "bold" }}
														color={driver.present ? "green" : "red"}
													>
														{driver.present
															? "Carregando caminhão"
															: "Aguardando"}
													</Typography>
												</Grid>
												<DeleteForeverIcon
													style={{ cursor: "pointer", color: "red" }}
													onClick={() => deleteDriver(driver.id)}
												/>
											</Grid>
										))
									)}
								</Grid>
							</CardContent>
						</Card>
					</Grid>

					<Grid item xs={8}>
						<Box
							sx={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								backgroundColor: "white",
								p: 3,
								borderRadius: 2,
								boxShadow: 3,
							}}
						>
							<Box
								sx={{
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									mb: 2,
								}}
							>
								<Typography variant="subtitle2" gutterBottom>
									Foto do Motorista
								</Typography>

								<Box
									sx={{
										display: "flex",
										flexDirection: "column",
										alignItems: "center",
										gap: 1,
									}}
								>
									{image ? (
										<Box
											sx={{
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												gap: 1,
											}}
										>
											<img
												src={image}
												alt="foto capturada"
												width="100%"
												height="auto"
											/>
											<Button
												variant="contained"
												color="primary"
												component="span"
												size="small"
												onClick={() =>
													recapture("Deseja retirar a foto novamente?")
												}
											>
												<ThreeSixtyIcon />
											</Button>
										</Box>
									) : (
										<Box
											sx={{
												display: "flex",
												flexDirection: "column",
												alignItems: "center",
												gap: 1,
											}}
										>
											<Webcam
												audio={false}
												ref={webcamRef}
												screenshotFormat="image/jpeg"
												style={{
													width: "100%",
													height: "auto",
												}}
												videoConstraints={{
													facingMode: typeCam,
												}}
											/>
											{isLoading?(<CircularProgress style={{color:'blue'}}/>):(

											<Box sx={{ display: "flex", gap: 1 }}>
												<Button
													variant="contained"
													color="primary"
													component="span"
													size="small"
													onClick={() =>
														setTypeCam(
															typeCam === "environment"
																? "user"
																: "environment",
														)
													}
												>
													<CameraswitchIcon />
												</Button>
												<Button
													variant="contained"
													color="primary"
													component="span"
													size="small"
													onClick={() => capturePhoto()}
												>
													<CameraIcon />
												</Button>
											</Box>
											) }

										</Box>
									)}

								</Box>
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
								onClick={(e) => handleSubmit(e)}
							>
								{isLoading ? <CircularProgress /> : <span>Enviar</span>}
							</Button>
						</Box>
					</Grid>
				</Grid>
			</Container>
		</Box>
	);
}
