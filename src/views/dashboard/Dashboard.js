import React, { useContext, useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import SalesOverview from './components/SalesOverview';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import Blog from './components/Blog';
import MonthlyEarnings from './components/MonthlyEarnings';
import Swal from 'sweetalert2';
import Api from 'src/api/service';
import AuthContext from 'src/contexto/AuthContext';
import AreaForms from './components/AreaForms';


const Dashboard = () => {
  const [userId, setUserId] = useState('')
  const [cleanigId, setCleaningId] = useState('')
  const [companies, setCompanies] = useState([])
  const { user } = useContext(AuthContext)

  async function findCompanies() {
    const managerId = JSON.parse(user).id
    try {
      const { data } = await Api.get('/companies/recover/companies', {
        params: {
          managerId
        }
      })

      const newComapnues = data.map((item) => {
        return { name: item.company.name, id: item.company.id }
      })

      setCompanies(newComapnues)
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

  async function getCompanies() {
    try {
      const { data } = await Api.get('companies/recover')
      setCompanies(data)
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
    if (JSON.parse(user).role === "ADMIN") {
      getCompanies()
      return
    }
    findCompanies()
  }, [user])
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview companies={companies} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <MonthlyEarnings companies={companies} findCompanies={findCompanies} />
              </Grid>
              <Grid item xs={12} >
                <AreaForms companies={companies} />
              </Grid>
              <Grid item xs={12} >
            <RecentTransactions choseUser={setUserId} companies={companies} />
          </Grid>
            </Grid>
           
          </Grid>
        
          <Grid item xs={12} lg={8}>
            <ProductPerformance userId={userId} setCleaning={setCleaningId} />
          </Grid>
          <Grid item xs={12}>
            <Blog clear={cleanigId} />
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
