import React, { useContext, useEffect, useState } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import SalesOverview from './components/SalesOverview';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import Blog from './components/Blog';
import AuthContext from 'src/contexto/AuthContext';
import AreaForms from './components/AreaForms';


const Dashboard = () => {
  const [userId, setUserId] = useState('')
  const [cleanigId, setCleaningId] = useState('')
  const { user, companies } = useContext(AuthContext)

  useEffect(() => { console.log(JSON.parse(user)) }, [])
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      {user && JSON.parse(user).role === "VIEWR" ? (
        <AreaForms companies={companies} />
      ) : (
        <Box>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <SalesOverview companies={companies} />
            </Grid>
            <Grid item xs={12} lg={4}>
              <Grid container spacing={3}>
                <Grid item xs={12} >
                  <AreaForms companies={companies} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}

    </PageContainer>
  );
};

export default Dashboard;
