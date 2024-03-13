import React, { useState } from 'react';
import { InputLabel, Select, FormControl, MenuItem, TextField, Button } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import Api from 'src/api/service';
import Swal from 'sweetalert2';

const MonthlyEarnings = ({ companies }) => {
  const [route, setRoute] = useState('')
  const [companySelected, setCompanySelected] = useState('')
  const [name, setName] = useState('')

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
      <>
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
          </Select>
        </FormControl>

        <TextField label="nome" ariant="outline" onChange={(e) => setName(e.target.value)} />
        <Button onClick={handleCreate} variant={companySelected ? "contained" : "outlined"} color="primary" style={{ height: 30 }}>
          Criar
        </Button>
      </>
    </DashboardCard>
  );
};

export default MonthlyEarnings;
