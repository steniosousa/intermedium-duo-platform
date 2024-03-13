import React, { useEffect, useState } from 'react';
import DashboardCard from '../../../components/shared/DashboardCard';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Swal from 'sweetalert2';
import Api from 'src/api/service';
import ListOperator from 'src/layouts/operator/listOperator';

const RecentTransactions = ({ choseUser }) => {
  const [companies, setCompanies] = useState([])
  const [companySelected, setCompanySelected] = useState('')
  const [users, setUsers] = useState([])

  async function getCompanies() {
    try {
      const { data } = await Api.get('/companies/recover/')
      setCompanies(data)
    } catch (error) {
      await Swal.fire({
        icon: 'error',
        title: 'Erro ao recuperar dados',
        showDenyButton: true,
        showCancelButton: false,
        showConfirmButton: true,
        denyButtonText: 'Cancelar',
        confirmButtonText: 'Confirmar'
      })
    }

  }

  async function getUsersForCompany() {
    if (!companySelected) return
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
  }

  useEffect(() => {
    getCompanies()
  }, [])

  useEffect(() => {
    getUsersForCompany()
  }, [companySelected])
  return (
    <DashboardCard title="Operários" action={<FormControl sx={{ m: 1, minWidth: 120 }} >
      <InputLabel >Empresa</InputLabel>
      <Select
        value={companySelected}
        label="Age"
        onChange={(company) => setCompanySelected(company.target.value)}

      >
        {companies.map((company) => {
          return (
            <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
          )
        })}
      </Select>
    </FormControl>
    }>
      <>
        {users.map((item) => {
          return (
            <ListOperator user={item} key={item.id} choseUser={choseUser} />
          )
        })}
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
