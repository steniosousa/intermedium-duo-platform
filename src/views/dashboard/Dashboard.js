import React, { useState } from 'react';
import { Grid, Box } from '@mui/material';
import PageContainer from 'src/components/container/PageContainer';

// components
import SalesOverview from './components/SalesOverview';
import YearlyBreakup from './components/YearlyBreakup';
import RecentTransactions from './components/RecentTransactions';
import ProductPerformance from './components/ProductPerformance';
import Blog from './components/Blog';
import MonthlyEarnings from './components/MonthlyEarnings';


const Dashboard = () => {
  const [objCreateSolicitation, setObjCreateSolicition] = useState({})
  const [userId, setUserId] = useState('')
  const [cleanigId, setCleaningId] = useState('')
  const [companies, setCompanies] = useState([])

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview editObject={setObjCreateSolicition} setCompaniesFind={setCompanies} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup initialObject={objCreateSolicitation} />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings companies={companies} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <RecentTransactions choseUser={setUserId} />
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
