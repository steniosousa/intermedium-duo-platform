import { LinearProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';


const SamplePage = () => {
  const [position, setPosition] = useState(null);

  async function error() {
    const reload = await Swal.fire({
      icon: 'error',
      title: "Erro ao capturar localização",
      html: "<p>Atualize a página</p>",
      showDenyButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      denyButtonText: 'Cancelar',
      confirmButtonText: 'Atualizar'
    })
    if (reload.isConfirmed) {
      window.location.reload()
    }
  }
  useEffect(() => {
    navigator.geolocation.watchPosition((position) => {
      setPosition(position);
    }, (error) =>  error());
  }, [])
  return (
    <>
      {
        position ? (
          <iframe desc={"Você"} src={`https://embed.waze.com/iframe?zoom=12&lat=${position.coords.latitude}&lon=${position.coords.longitude}&pin=1&desc="Você"`}
            width="100%" style={{ height: '600px' }}></iframe >

        ) : (
          <LinearProgress />
        )}
    </>
  );
};

export default SamplePage;
