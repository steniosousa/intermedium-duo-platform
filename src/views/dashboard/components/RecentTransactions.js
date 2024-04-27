import React, { useEffect, useState } from 'react';
import DashboardCard from '../../../components/shared/DashboardCard';
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Swal from 'sweetalert2';
import Api from 'src/api/service';
import ListOperator from 'src/layouts/operator/listOperator';

const RecentTransactions = ({ choseUser, companies }) => {
  const [companySelected, setCompanySelected] = useState('')
  const [users, setUsers] = useState([])

  const [isLoading, setIsLoading] = useState(false)


  async function getUsersForCompany() {
    if (!companySelected) return
    setIsLoading(true)
    try {
      const { data } = await Api.get('/user/recover', { params: { companyId: companySelected } })
      setUsers(data)
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao recuperar usuários',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }
    setIsLoading(false)
  }



  useEffect(() => {
    getUsersForCompany()
  }, [companySelected])
  return (
    <DashboardCard background="#f2f2f2" title="Operários" action={<FormControl sx={{ m: 1, minWidth: 120 }} >
      <InputLabel >Empresa</InputLabel>
      <Select
        value={companySelected}
        label="Age"
        onChange={(company) => setCompanySelected(company.target.value)}

      >
        {companies.map((company) => {
          return (

            <MenuItem key={company.id} value={company.id} >{company.name}</MenuItem>
          )
        })}
      </Select>

    </FormControl>
    }>
      <>
        {isLoading ? <CircularProgress size={25} /> : null}
        {users.length === 0 ? (
          <span>Selecione uma empresa</span>
        ) : (
          users.map((item) => {
            return (
              <ListOperator Listuser={item} key={item.id} choseUser={choseUser} action={getUsersForCompany} />
            )
          })
        )}
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
