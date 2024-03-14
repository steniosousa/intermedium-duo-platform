import React, { useContext, useEffect, useState } from 'react';
import { InputLabel, Select, FormControl, MenuItem, TextField, Button, Grid, OutlinedInput, Chip, Box } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import Api from 'src/api/service';
import Swal from 'sweetalert2';
import AuthContext from 'src/contexto/AuthContext';

const MonthlyEarnings = ({ companies }) => {
  const [route, setRoute] = useState('')
  const [companySelected, setCompanySelected] = useState('')
  const [name, setName] = useState('')
  const [personName, setPersonName] = React.useState([]);
  const { user } = useContext(AuthContext)


  async function handleCreate() {
    if (!name || !companySelected) {
      await Swal.fire({
        icon: 'warning',
        title: 'Preencha todos os campos',
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'ok'
      })
      return
    }
    const send = {
      companyId: companySelected,
      name: name,
    }
    try {
      await Api.post(`${route}/create`, send)
      await Swal.fire({
        icon: 'success',
        title: 'Criação bem sucessedida',
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
        title: 'Erro ao efetuar criação',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })

    }
  }


  const [email, setEmail] = useState('')
  const [createManager, setCreateManager] = useState(false)
  useEffect(() => {
    if (route == "manager") {
      setCreateManager(true)
    }
    else {
      setCreateManager(false)
    }

  }, [route])
  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const handleChangeManager = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  async function handleCreateManager() {
    
    try {
      const send = {
        name,
        email: email,
        companyId: [],
        role: "MANAGER",
        permissions: ["OBJECTS", "PLACES", "COMPANIES", "EPIS"]
      }
      for (let i = 0; i < personName.length; i++) {
          const existe = companies.find((item) => item.name == personName[i])
          send.companyId.push(existe.id)
      }
      console.log(send)
      await Api.post(`manager/create`, send)
      await Swal.fire({
        icon: 'success',
        title: 'Criação bem sucessedida',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      window.location.reload()
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao criar gerente',
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'ok'
      })
    }
  }

  return (
    <DashboardCard
      title="Cadastros"
      action={
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel >Empresa</InputLabel>
          <Select
            value={companySelected}
            label="Age"
            onChange={(e) => setCompanySelected(e.target.value)}
          >
            {companies.map((company) => {
              return (
                <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
              )
            })}
          </Select>
        </FormControl>
      }

    >
      <Grid container spacing={2} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel >Cadastrar</InputLabel>
          <Select
            value={route}
            label="Age"
            onChange={(e) => setRoute(e.target.value)}
          >
            <MenuItem value={"place"}>Ambiente</MenuItem>
            <MenuItem value={"objects"}>Objeto</MenuItem>
            <MenuItem value={"epis"}>EPI</MenuItem>
            <MenuItem value={"companies"}>Empresa</MenuItem>
            <MenuItem value={"manager"}>Gerente</MenuItem>
          </Select>
        </FormControl >
        {createManager && JSON.parse(user).role == "ADMIN" ? (
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-multiple-chip-label">Empresa</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={personName}
              onChange={handleChangeManager}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {companies.map((name) => (
                <MenuItem
                  key={name}
                  value={name.name}
                >
                  {name.name}
                </MenuItem>
              ))}
            </Select>
            <TextField label="Nome:" ariant="outline" onChange={(e) => setName(e.target.value)} />
            <TextField label="Email:" ariant="outline" onChange={(e) => setEmail(e.target.value)} />
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Button onClick={handleCreateManager} variant={companySelected ? "contained" : "outlined"} color="primary" style={{ height: 30 }}>
                Criar
              </Button>
            </FormControl>
          </FormControl>
        ) : (
          <>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField label="nome" ariant="outline" onChange={(e) => setName(e.target.value)} />

            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Button onClick={handleCreate} variant={companySelected ? "contained" : "outlined"} color="primary" style={{ height: 30 }}>
                Criar
              </Button>
            </FormControl>
          </>

        )}
      </Grid>
    </DashboardCard >
  );
};

export default MonthlyEarnings;
