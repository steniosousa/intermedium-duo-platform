import React, { useState } from 'react';
import { InputLabel, Select, FormControl, MenuItem, TextField, Button, Grid, OutlinedInput, Chip, Box, CircularProgress } from '@mui/material';
import DashboardCard from '../../../components/shared/DashboardCard';
import Swal from 'sweetalert2';
import ModalCrud from 'src/components/modal-Crud/modal';
import LibraryAddIcon from '@mui/icons-material/LibraryAdd';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
const MonthlyEarnings = ({ companies, findCompanies }) => {
  const [openModal, setOpenModal] = useState(false)
  const [verb, setVerb] = useState('')
  const [companySelected, setCompanySelected] = useState('')


  async function handleopenModal(actionModal) {
    if (!companySelected) {
      await Swal.fire({
        icon: 'info',
        title: 'Selecione uma empresa',
        showDenyButton: false,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
      return
    }
    setOpenModal(!openModal)
    setVerb(actionModal)
  }


  return (
    <DashboardCard
      background="#f2f2f2"
      title="Configurações"
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
      {openModal ? <ModalCrud findCompanies={findCompanies} verb={verb} action={handleopenModal} openModal={openModal} companyId={companySelected} companies={companies} /> : null}
      <Grid style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around' }}>
        <Button variant={"contained"} color="primary" style={{ height: 30 }} onClick={() => handleopenModal('Cadastrar')}>
          <span>
            Cadastro
          </span>
          <LibraryAddIcon />
        </Button>
        <Button variant={"contained"} color="primary" style={{ height: 30 }} onClick={() => handleopenModal('Deletar')}>
          <span>
            Deleção
          </span>
          <DeleteForeverIcon />
        </Button>
        <Button variant={"contained"} color="primary" style={{ height: 30 }} onClick={() => handleopenModal('Editar')}>
          <span>
            Edição
          </span>
          <SaveAsIcon />

        </Button>
      </Grid>

    </DashboardCard >
  );
};

export default MonthlyEarnings;
