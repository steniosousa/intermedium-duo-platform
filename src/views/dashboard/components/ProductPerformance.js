import React, { useContext, useEffect, useState } from 'react';
import {
    Typography, Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Pagination,
    Modal,
    FormControl,
    Select,
    InputLabel,
    MenuItem,
    OutlinedInput,
    TextField,
    Button,
} from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import Api from 'src/api/service';
import Swal from 'sweetalert2';
import moment from 'moment';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import AuthContext from 'src/contexto/AuthContext';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    p: 4,
    width: 400,
    outline: 0,
    borderRadius: 1
};

const ProductPerformance = ({ userId, setCleaning }) => {
    const [cleanings, setCleanings] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [paginations, setPagination] = useState(1)
    const [open, setOpen] = useState(false)
    const { user } = useContext(AuthContext)
    const [avaliation, setAvaliation] = React.useState('');
    const [epis, setAllEpis] = useState([])
    const [EpisSelected, setEpisSelected] = useState([])
    const [description, setDescription] = useState('')
    const [scheduleId, setScheduleId] = useState('')
    const companyId = JSON.parse(user).companyId[0].companyId


    async function getAllDatas(page) {
        setLoading(true)
        if (!userId) return
        try {
            const { data } = await Api.get('/cleaning/recover', {
                params: { userId, page }
            });
            setCleanings(data.cleanings)
            setPagination((data.total / 5).toFixed(0))

        } catch (error) {
            await Swal.fire({
                icon: 'error',
                title: 'Erro ao recuperar dados das solicitações',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
        setLoading(false)
    }

    function newPage(page) {
        if (!parseInt(page.target.innerText)) return
        getAllDatas(parseInt(page.target.innerText))

    }

    async function retriveDatas() {
        try {
            const { data } = await Api.get('/epis/recover', { params: { companyId } })
            const optionsEquipaments = data.map((item) => {
                return {
                    value: item.id,
                    label: item.name
                }
            })
            setAllEpis(optionsEquipaments)
        } catch {
            await Swal.fire({
                icon: 'error',
                title: "Erro ao recuperar Epis",
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
    }

    async function handleAvaliation() {
        const confirm = await Swal.fire({
            icon: 'question',
            title: "Deseja criar avaliação para essa solicitação?",
            showDenyButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            denyButtonText: 'Cancelar',
            confirmButtonText: 'Sim'
        })
        if (!confirm.isConfirmed) return
        const send = {
            scheduleId: scheduleId,
            status: avaliation,
            managerId: userId,
            episId: EpisSelected,
            observation: description
        }

        try {
            await Api.post('avaliation/create', send)
            setOpen(!open)

            setEpisSelected('')
            setAvaliation('')
            setScheduleId('')
            setAvaliation('')
            await Swal.fire({
                icon: 'success',
                title: "Avaliação criada com sucesso",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        } catch {
            await Swal.fire({
                icon: 'error',
                title: "Erro ao salvar avaliação",
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
        }
        getAllDatas(1)

    }
    async function handleModal(e) {
        if (e.status === "PENDENTE") {
            await Swal.fire({
                icon: 'warning',
                html: "<h2>Você não pode avaliar solicitações pendentes</h2>",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
            return
        }
        if (e.avaliationId) {
            await Swal.fire({
                icon: 'warning',
                html: "<h2>Solicitação já avaliada</h2>",
                showDenyButton: false,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
            return
        }
        setScheduleId(e.id)
        retriveDatas()
        setOpen(!open)
    }

    useEffect(() => {
        if (userId) {
            setPagination(1)
            getAllDatas(1)
        }
    }, [userId])
    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setEpisSelected(
            typeof value === 'string' ? value.split(',') : value,
        );
    };
    return (
        <DashboardCard title="Histórico de solicitações" action={isLoading ? (
            <CircularProgress size={25} />
        ) : null}>
            <Box sx={{ overflow: 'auto', width: { xs: '280px', sm: 'auto' } }}>
                <Table
                    aria-label="simple table"
                    sx={{
                        whiteSpace: "nowrap",
                        mt: 2
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Data
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Avaliado
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Ambiente
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Status
                                </Typography>
                            </TableCell>
                            <TableCell>
                                <Typography variant="subtitle2" fontWeight={600}>
                                    Avaliação
                                </Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {cleanings.map((product) => {
                            const dateObject = moment(product.createdAt);
                            const data = dateObject.format("DD-MM-YYYY - h:m");
                            return (
                                <TableRow key={product.id} onClick={() => setCleaning(product)} style={{ cursor: "pointer" }}>
                                    <TableCell>
                                        <Typography
                                            sx={{
                                                fontSize: "15px",
                                                fontWeight: "500",
                                            }}
                                        >
                                            {data}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={600}>
                                                    {product.evidences.lenght}
                                                </Typography>
                                                <Typography
                                                    color="textSecondary"
                                                    sx={{
                                                        fontSize: "13px",
                                                    }}
                                                >
                                                    {product.avaliationId ? "Avaliado" : "Sem avaliação"}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Typography color="textSecondary" variant="subtitle2" fontWeight={400}>
                                            {product.Place.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            sx={{
                                                px: "4px",
                                                backgroundColor: product.status === "CONCLUIDO" ? "green" : "orange",
                                                color: "#fff",
                                            }}
                                            size="small"
                                            label={product.status}
                                        ></Chip>
                                    </TableCell>
                                    <TableCell style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <ModeEditOutlineIcon style={{ color: product.avaliationId ? "green" : "red" }} onClick={() => handleModal(product)} />
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>

                <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {cleanings.length > 0 ? (
                        <Pagination count={paginations} color="primary" onClick={(e) => newPage(e)} hideNextButton hidePrevButton />

                    ) : (
                        <span>Selecione um operário</span>
                    )}
                </div>
            </Box>
            <Modal
                disableEnforceFocus
                open={open}
                onClose={handleModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Criar avaliação
                    </Typography>
                    <FormControl fullWidth style={{ marginTop: 50 }}>
                        <InputLabel id="demo-simple-select-label">Avaliação</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={avaliation}
                            label="Age"
                            onChange={(e) => setAvaliation(e.target.value)}
                        >
                            <MenuItem value={'RUIM'}>RUIM</MenuItem>
                            <MenuItem value={'BOM'}>BOM</MenuItem>
                            <MenuItem value={'PERFEITO'}>PERFEITO</MenuItem>
                        </Select>
                    </FormControl>

                    <FormControl fullWidth style={{ marginTop: 20 }}>
                        <InputLabel id="demo-multiple-name-label">EPI em falta</InputLabel>
                        <Select
                            labelId="demo-multiple-name-label"
                            id="demo-multiple-name"
                            multiple
                            value={EpisSelected}
                            onChange={handleChange}
                            input={<OutlinedInput label="Name" />}
                            style={{ color: 'orange' }}
                        >
                            {epis.map((name) => {
                                return (
                                    <MenuItem
                                        key={name.value}
                                        value={name.value}
                                    >
                                        {name.label}
                                    </MenuItem>

                                )
                            })}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth style={{ marginTop: 20 }}>
                        <TextField id="outlined-basic" label="Descrição" variant="outlined" onChange={(e) => setDescription(e.target.value)} />
                    </FormControl>
                    <FormControl fullWidth style={{ marginTop: 20 }}>
                        <Button onClick={handleAvaliation} variant={"contained"} color="primary" style={{ height: 30 }}>
                            Avaliar
                        </Button>
                    </FormControl>
                </Box>
            </Modal>
        </DashboardCard >
    );
};

export default ProductPerformance;
