import React from 'react';
import { Container, Grid, Paper, Typography, Button, Box } from '@mui/material';
import { CleanHands, Face } from '@mui/icons-material';
import { useNavigate } from 'react-router';

export default function Home() {
    const navigate = useNavigate()
  return (
    <Box
      sx={{
        backgroundColor: 'whitesmoke',
        width: '100%',
        minHeight: '100vh',
        margin: 0,
        padding: 4,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Módulo 1: Limpeza de Quartos */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: '#ffffff',
                boxShadow: 6,
                borderRadius: 3,
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 10,
                },
              }}
            >
              <CleanHands sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Limpeza de Quartos
              </Typography>
              <Typography variant="body1" paragraph>
                Gerencie a limpeza de maneira eficiente e mantenha um ambiente sempre limpo e organizado.
              </Typography>
              <Button variant="contained" color="primary" onClick={() => navigate('/auth/login')}>
                Gerenciar
              </Button>
            </Paper>
          </Grid>

          {/* Módulo 2: Leitura Facial */}
          <Grid item xs={12} md={6}>
            <Paper
              sx={{
                p: 4,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                backgroundColor: '#ffffff',
                boxShadow: 6,
                borderRadius: 3,
                textAlign: 'center',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'scale(1.02)',
                  boxShadow: 10,
                },
              }}
            >
              <Face sx={{ fontSize: 60, color: '#f57c00', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Leitura Facial
              </Typography>
              <Typography variant="body1" paragraph>
                Realize a leitura facial para identificar características e melhorar a segurança e personalização.
              </Typography>
              <Button variant="contained" color="secondary" onClick={() => navigate('/faceRecoginition/create')}>
                Iniciar
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
