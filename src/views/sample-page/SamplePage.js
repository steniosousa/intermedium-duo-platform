import { LinearProgress } from '@mui/material';
import React, { useEffect, useState } from 'react';


const SamplePage = () => {
  const [position, setPosition] = useState(null);

 
  useEffect(() => {
    navigator.geolocation.watchPosition((position) => {
      setPosition(position);
    }, (error) =>  error());
  }, [])
  return (
    <>
      {
        position ? (
          <iframe title={"Mapa"} desc={"Você"} src={`https://embed.waze.com/iframe?zoom=12&lat=${position.coords.latitude}&lon=${position.coords.longitude}&pin=1&desc="Você"`}
            width="100%" style={{ height: '600px' }}></iframe >

        ) : (
          <LinearProgress />
        )}
    </>
  );
};

export default SamplePage;
