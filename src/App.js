import React from 'react';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import { useState , useEffect } from 'react';
import { Button, Flex } from '@chakra-ui/react';
import axios from "axios";

const libraries = ['places'];
const mapContainerStyle = {
  width: '100vw',
  height: '100vh',
};
const center = {
  lat: 22.5726, // default latitude
  lng: 88.3639, // default longitude
};

const App = () => {
  const [markers, setMarkers] = useState([]);
  const [count, setcount] = useState(0);

  async function calculateDistance() {
    fetch('http://localhost:3001/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ markers })
    })
    .then(response => response.json())
    .then(data => {
      console.log(data);
  
    })
    .catch(error => {
      console.error('Error optimizing route:', error);
      // Handle error
    });

  }
   

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_APIKEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const onMapClick = (e) => {
    setcount(count + 1);
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    ]);
  }

  return (
    <Flex>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={8}
        center={center}
        onClick={onMapClick}
      >
    {count >= 2 && <Flex minWidth='max-content' justifyContent= 'center'> <Button onClick={calculateDistance} colorScheme='teal' size='lg'>
    Calculate optimal Path
  </Button> </Flex>}
       {markers.map((marker) => (
        <Marker key = {marker.lat}
          position={{ 
            lat: marker.lat,
            lng: marker.lng 
          }} />
    ))}
      </GoogleMap>
    </Flex>
  );
};

export default App;