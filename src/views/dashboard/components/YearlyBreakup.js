import React, {  useState } from 'react';
import { Grid, Typography, CardContent, FormControl, Select, MenuItem, Button, CircularProgress } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import moment from 'moment';
import Swal from 'sweetalert2';
import Api from 'src/api/service';

const YearlyBreakup = ({ initialObject }) => {
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
    <DashboardCard title="Horário da solicitação">
      <Grid container spacing={3}>
        {/* column */}
        <Grid item >
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
              const data = dateObject.format("DD-MM-YYYY");

              return (
                <Grid key={date} container spacing={3} style={{ display: 'flex', marginBottom: 5, flexDirection: 'row', alignItems: "center", justifyContent: 'center' }}>
                  <Typography variant="body1" color="textSecondary">
                    {data} {`-->`}
                  </Typography>
                  <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }} >
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
          {JSON.stringify(initialObject) !== '{}'  ? (
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
    </DashboardCard>
  );
};

export default YearlyBreakup;
