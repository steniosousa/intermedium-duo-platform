import { Box, Button, CardContent, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Modal, OutlinedInput, Select, TextField, Typography } from "@mui/material"
import { useState } from "react"
import moment from 'moment';
import Swal from "sweetalert2";
import Api from "src/api/service";

export default function ModalSolicitation({ action, openModal, initialObject }) {
    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: 'background.paper',
        p: 4,
        width: 400,
        outline: 0,
        borderRadius: 1,
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column'
    };

    const [dates, setDates] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const hours = [
        { value: 7, hour: "07:00" },
        { value: 8, hour: "08:00" },
        { value: 9, hour: "09:00" },
        { value: 10, hour: "10:00" },
        { value: 11, hour: "11:00" },
        { value: 12, hour: "12:00" },
        { value: 13, hour: "13:00" },
        { value: 14, hour: "14:00" },
        { value: 15, hour: "15:00" },
        { value: 16, hour: "16:00" },
        { value: 17, hour: "17:00" },
    ]


    function changeHour(hour, date) {
        initialObject.date.map((item) => {
            if (item === date) {
                const newDate = new Date(item).setHours(hour)
                setDates((oldState) => [...oldState, new Date(newDate)])
            }
        })
    }

    async function handleCreate() {
        setIsLoading(true)
        if (isLoading) return
        const send = {
            placeId: initialObject.places,
            objectsId: initialObject.objects,
            userId: initialObject.user,
            repeatable: initialObject.repeat,
            eventDate: dates,
        }
        try {
            await Api.post('cleaning/create', send)
            action()
            await Swal.fire({
                icon: 'success',
                title: 'Solicitação criada com sucesso!',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })
            window.location.reload()
        }
        catch (error) {
            action()
            await Swal.fire({
                icon: 'error',
                title: 'Não foi possível criar a solicitação',
                showDenyButton: true,
                showCancelButton: false,
                showConfirmButton: true,
                denyButtonText: 'Cancelar',
                confirmButtonText: 'Confirmar'
            })

        }
        setIsLoading(false)
    }

    return (
        <Modal
            disableEnforceFocus
            open={openModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            onClose={action}
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h6" component="h2" style={{ marginBottom: 20 }}>
                    Horário da solicitação
                </Typography>
                <Grid  >
                    <Grid item style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        {Object.keys(initialObject).length === 0 ? (
                            <CardContent>
                                <Typography variant="h5" color="textSecondary">
                                    Selecione os campos anteriores
                                </Typography>
                                <Typography variant="body1" color="textSecondary">
                                    Precisamos dos dados anteriores para prosseguirmos com a marcação
                                </Typography>
                            </CardContent>

                        ) : (
                            initialObject.date.map((date) => {
                                const dateObject = moment(date);
                                const data = dateObject.format("DD/MM/YYYY");

                                return (
                                    <Grid key={date}  style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', alignSelf:'center' }}>
                                        <Typography variant="body1" color="textSecondary" >
                                            {data} 
                                        </Typography>
                                        <Typography variant="body1" color="textSecondary" style={{marginLeft:10, marginRight:10, fontWeight:'bold'}}>
                                           às
                                        </Typography>
                                        <FormControl variant="standard" sx={{ m: 1, minWidth: 80 }} >
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                label="Age"
                                                style={{ border: 'none' }}
                                                onChange={(e) => changeHour(e.target.value, date)}
                                            >
                                                {hours.map((hour) => {
                                                    return (
                                                        <MenuItem value={hour.value} key={hour.value}>{hour.hour}</MenuItem>
                                                    )
                                                })}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                )

                            })
                        )}
                        {JSON.stringify(initialObject) !== '{}' ? (
                            <Button onClick={handleCreate} variant={dates.length > 0 ? "contained" : "outlined"} color="primary" style={{ height: 30, }}>
                                {isLoading ? (
                                    <CircularProgress size={20} />
                                ) : (
                                    <span>
                                        Solicitar
                                    </span>
                                )}
                            </Button>

                        ) : null}
                    </Grid>


                </Grid>
            </Box>

        </Modal>
    )
}