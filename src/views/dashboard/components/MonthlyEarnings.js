import React, { useContext, useEffect, useState } from 'react';
import { InputLabel, Select, FormControl, MenuItem, TextField, Button, Grid, OutlinedInput, Chip, Box, CircularProgress } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import Api from 'src/api/service';
import Swal from 'sweetalert2';
import AuthContext from 'src/contexto/AuthContext';

const MonthlyEarnings = ({ companies }) => {
  const [route, setRoute] = useState('')
  const [companySelected, setCompanySelected] = useState('')
  const [name, setName] = useState('')
  const [personName, setPersonName] = React.useState([]);
  const [role, setRole] = useState('')
  const { user } = useContext(AuthContext)
  const [qualifiedCompanies, setQualifiedCompanies] = useState([])
  const [isLoading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [createManager, setCreateManager] = useState(false)

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

  async function handleCreate() {
    if (isLoading) return
    setLoading(true)
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
      setLoading(false)
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
    setLoading(false)
  }



  const handleChangeManager = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  async function handleCreateManager() {
    if (isLoading) return
    setLoading(true)
    if (!name || !email || !role) {
      await Swal.fire({
        icon: 'info',
        title: 'Preencha todos os campos',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      setLoading(false)
      return
    }
    try {
      const send = {
        name,
        email: email,
        companyId: [],
        role,
        permissions: ["OBJECTS", "PLACES", "COMPANIES", "EPIS"]
      }
      for (let i = 0; i < personName.length; i++) {
        const existe = qualifiedCompanies.find((item) => item.name == personName[i])
        send.companyId.push(existe.id)
      }

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
    } catch (error) {
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
    setLoading(false)
  }

  async function getCompanies() {
    try {
      const { data } = await Api.get('companies/recover')
      setQualifiedCompanies(data)
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao listar empresas',
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'ok'
      })
    }
  }
  useEffect(() => {
    if (route == "manager") {

      setCreateManager(true)
    }
    else {
      setCreateManager(false)
    }

  }, [route])

  useEffect(() => {
    if (JSON.parse(user).role == "ADMIN") {
      getCompanies()
      return
    }
    setQualifiedCompanies(companies)
  }, [companies])
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
            {qualifiedCompanies.map((company) => {
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
            <MenuItem value={"user"}>Funcionário</MenuItem>
            {JSON.parse(user).role == "ADMIN" ? (
              <MenuItem value={"manager"}>Gerente</MenuItem>

            ) : null}
          </Select>
        </FormControl >
        {createManager ? (
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
              {qualifiedCompanies.map((name) => (
                <MenuItem
                  key={name}
                  value={name.name}
                >
                  {name.name}
                </MenuItem>
              ))}
            </Select>
            <FormControl fullWidth sx={{ mt: 1, mb: 1 }}>
              <InputLabel id="demo-simple-select-label">Hierarquia</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={role}
                label="Age"
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value={"MANAGER"}>Gerente</MenuItem>
                <MenuItem value={"ADMIN"}>Administrador</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Nome:" ariant="outline" onChange={(e) => setName(e.target.value)} style={{ marginBottom: 7 }} />
            <TextField label="Email:" ariant="outline" onChange={(e) => setEmail(e.target.value)} />
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Button onClick={handleCreateManager} variant={companySelected ? "contained" : "outlined"} color="primary" style={{ height: 30 }}>
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <span>
                    Criar

                  </span>
                )}
              </Button>
            </FormControl>
          </FormControl>
        ) : (
          <>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <TextField label="Nome:" ariant="outline" onChange={(e) => setName(e.target.value)} />

            </FormControl>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <Button onClick={handleCreate} variant={companySelected ? "contained" : "outlined"} color="primary" style={{ height: 30 }}>
                {isLoading ? (
                  <CircularProgress size={20} />
                ) : (
                  <span>
                    Criar

                  </span>
                )}
              </Button>
            </FormControl>
          </>

        )}
      </Grid>
    </DashboardCard >
  );
};

export default MonthlyEarnings;
