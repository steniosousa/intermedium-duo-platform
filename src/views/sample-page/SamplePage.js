import { Box, Button, FormControl, InputLabel,  MenuItem, Modal, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Api from 'src/api/service';
import Swal from 'sweetalert2';
import MapContainer from './Map/MapContainer';

const SamplePage = () => {
  const [driver, setDriver] = useState('')
  const [plate, setPlate] = useState('')
  const [trucks, setTrucks] = useState([])
  const [location, setLocations] = useState([])
  const [openModal, setOpenModal] = useState(false)

  async function getCoods(plateSelect) {
    console.log(plateSelect)
    try {
      const { data } = await Api.get('/truck/coords', {
        params: {
          plate: plateSelect,

        }
      })
      setLocations(data)
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: "Erro ao recuperar localizações",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Ok'
      })
    }
  }

  async function createTruck() {
    if (!driver || !plate) {
      await Swal.fire({
        icon: 'info',
        title: "Preencha todos os campos",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Ok'
      })
      return
    }
    try {
      await Api.post('/truck/create', {
        name: driver,
        plate
      })

      await Swal.fire({
        icon: 'success',
        title: "Criaçao bem sucedida",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Ok'
      })
      setDriver('')
      setPlate('')
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: "Erro ao criar Trucker",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Ok'
      })
    }
  }

  async function getTrucks() {
    try {
      const { data } = await Api.get('truck/recover', {
        params: {
          page: 1
        }
      })
      setTrucks(data)
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: "Erro ao recuperar caminhões",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Ok'
      })
    }
  }


  async function seeMap() {
    if (location === "Sem coordenadas") {
      await Swal.fire({
        icon: 'info',
        title: "Caminhão sem registros",
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Ok'
      })
      return
    }
    setOpenModal(true)
  }

  useEffect(() => {
    getTrucks()
  }, [])



  return (
    <div style={{ height: '100vh', width: "100%" }}>
      <div style={{ width: "95%", background: '#fffafa' }}>
        <InputLabel htmlFor="input-with-icon-adornment" >
          Cadastro de caminhões
        </InputLabel>
        <FormControl sx={{  width: '35ch' }}>
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: "90%" }}
            autoComplete="off"
          >

            <TextField id="outlined-basic" label="Placa" variant="outlined" onChange={(e) => setPlate(e.target.value)} />
            <TextField id="outlined-basic" label="Nome do motorista" variant="outlined" onChange={(e) => setDriver(e.target.value)} />
            <Button variant="contained" onClick={createTruck} style={{ width: '10%' }}>Criar</Button>

          </Box>
        </FormControl>
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', width: "50%" }}>
        <FormControl
          sx={{  width: '25ch', m:1 }}
        >
          <InputLabel id="demo-simple-select-label">Caminhão</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            label="Age"
            onChange={(e) => getCoods(e.target.value)}
          >
            {trucks.map((truck) => {
              return (
                <MenuItem key={truck.id} value={truck.id}>{truck.plate}</MenuItem>
              )
            })}
          </Select>

        </FormControl>
        <Button variant="contained" onClick={seeMap}  >mapa</Button>
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(!openModal)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: "95%",
          height: '70vh',
          bgcolor: 'transparent',
          borderRadius: 2,
          outline: 0
        }}>
          <MapContainer props={location} />
        </Box>
      </Modal>


    </div>
  );
};

export default SamplePage;
