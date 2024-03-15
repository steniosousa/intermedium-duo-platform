import React, { useContext, useEffect, useState } from 'react';
import DashboardCard from '../../../components/shared/DashboardCard';

import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Swal from 'sweetalert2';
import Api from 'src/api/service';
import ListOperator from 'src/layouts/operator/listOperator';
import AuthContext from 'src/contexto/AuthContext';

const RecentTransactions = ({ choseUser, companies }) => {
  const [companySelected, setCompanySelected] = useState('')
  const [users, setUsers] = useState([])
  const [qualifiedCompanies, setQualifiedCompanies] = useState([])
  const { user } = useContext(AuthContext)



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
    if (JSON.parse(user).role == "ADMIN") {
      console.log(users.length)
      getCompanies()
      return
    }
    setQualifiedCompanies(companies)
  }, [companies])

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
        {qualifiedCompanies.map((company) => {
          return (
            <MenuItem key={company.id} value={company.id}>{company.name}</MenuItem>
          )
        })}
      </Select>
    </FormControl>
    }>
      <>

        {users.length == 0 ? (
          <span>Selecione uma empresa</span>
        ) : (
          users.map((item) => {
            return (
              <ListOperator Listuser={item} key={item.id} choseUser={choseUser} />
            )
          })
        )}
      </>
    </DashboardCard>
  );
};

export default RecentTransactions;
