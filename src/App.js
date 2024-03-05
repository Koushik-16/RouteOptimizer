import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsService, DirectionsRenderer, } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import { Button, Flex, Spinner } from '@chakra-ui/react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

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
  const [path, setpath] = useState([]);
  const [dis, setdis] = useState(0);
  const [directions, setDirections] = useState(null);
  const [load, setload] = useState(false);
  const [reset, setreset] = useState(false);

useEffect(() => {
  
}, [dis ,path  ])





 
  async function calculateDistance() {
    setload(true);
    const url = 'http://localhost:3001/';
    await axios.post(url , {markers} ).then(res => {
     setdis(res.data.distance);
     setpath(res.data.bestpath);
    });
   
   

     

  }

  function resetmap() {
    setcount(0);
    setMarkers([]);
    setdis(0);
    setload(false);
    setDirections(null);
    setpath([]);
    setreset(false);
    window.location.reload();
    
  }

  const directionsCallback = response => {
    if (response !== null) {
      if (response.status === 'OK') {
        
        setDirections(response);
        setload(false);
        setreset(true);

      } else {
        console.error(`Error fetching directions: ${response.status}`);
      }
    }
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_MAP_APIKEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return   <Flex height={"100vh"} width = {"100vw"} alignItems={'center'} justifyContent={'center'} >
    <Spinner
    thickness='4px'
    speed='0.65s'
    emptyColor='gray.200'
    color='blue.500'
    size='xl'
  />
  </Flex>
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
       {load &&  <Flex height={"100vh"} width = {"100vw"} alignItems={'center'} justifyContent={'center'} >
    <Spinner
    thickness='4px'
    speed='0.65s'
    emptyColor='gray.200'
    color='blue.500'
    size='xl'
  />
  </Flex>}
      
        {count >= 2 && !reset && <Flex minWidth='max-content' justifyContent='center'> <Button onClick={calculateDistance} colorScheme='teal' size='lg'>
        
          Calculate optimal Path
        </Button> </Flex>}

{reset &&  <Flex minWidth='max-content' justifyContent='center'> <Button onClick={resetmap} colorScheme='teal' size='lg'>
        
       Reset Map
      </Button> </Flex>}

        {markers.map((marker) => (
          <Marker key={marker.lat}
            position={{
              lat: marker.lat,
              lng: marker.lng
            }} />   
        ))}
        {path.length > 1 &&  <DirectionsService
          options={{
            origin: path[0],
            destination: path[0],
            waypoints: path.map(waypoint => ({ location: waypoint })),
            travelMode: 'DRIVING'
          }}
          callback={directionsCallback}
        />}

     {directions && <DirectionsRenderer directions={directions}  options={{ draggable: true , preserveViewport : true }}  />} 
      </GoogleMap>
    </Flex>
  );
};

export default App;