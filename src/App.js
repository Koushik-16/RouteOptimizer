import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsService, DirectionsRenderer, } from '@react-google-maps/api';
import { useState, useEffect } from 'react';
import { Alert, Button, Flex, Spinner , AlertIcon } from '@chakra-ui/react';
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
  const [path, setpath] = useState([]);
  const [dis, setdis] = useState(0);
  const [directions, setDirections] = useState(null);
  const [load, setload] = useState(false);
  const [reset, setreset] = useState(false);
  const [input, setinput] = useState('warehouse');
  const [ridercount, setridercount] = useState(0);
  const [rider, setrider] = useState([]);
  const [users, setusers] = useState([]);
  const [countuser, setcountuser] = useState(0);

// useEffect(() => {
  
// }, [dis ,path ])





 
  async function calculateDistance() {
    setload(true);
    const url = 'http://localhost:3001/';
    // console.log(markers);
    // console.log(rider);
    // console.log(users);
    await axios.post(url , {markers , rider , users} ).then(res => {
     setdis(res.data.ansdis);
     setpath(res.data.anspath);
    });
   
   

     

  }

   function resetmap(e) {
  
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

 const { isLoaded, loadError } =  useLoadScript({
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
    if(input === 'warehouse') {
      setcount(count + 1);
    setMarkers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    ]);
    }else if(input === 'rider') {
      setridercount(count + 1);
    setrider((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    ]);
    }else if(input === 'user') {
      setcountuser(countuser + 1);
    setusers((current) => [
      ...current,
      {
        lat: e.latLng.lat(),
        lng: e.latLng.lng()
      }
    ]);
    }
    
  }

  function selectrider() {
      setinput('rider');
   setcount(0);

  }

  function selectuser() {
    setinput('user');
    setcount(0);
    setridercount(0);
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
      
        {/* {count >= 2 && !reset && <Flex minWidth='max-content' justifyContent='center'> <Button onClick={calculateDistance} colorScheme='teal' size='lg'>
        
          Calculate optimal Path
        </Button> </Flex>}

{reset &&  <Flex minWidth='max-content' justifyContent='center'> <Button onClick={() => {resetmap()}} colorScheme='teal' size='lg'>
        
       Reset Map
      </Button> </Flex>} */}

      {count >= 1 && ridercount === 0 &&  <Flex minWidth='max-content' justifyContent='center'> <Button onClick={() => {selectrider()}} colorScheme='teal' size='lg'>select rider location</Button> </Flex> }
      {ridercount >= 1 &&  <Flex minWidth='max-content' justifyContent='center'> <Button onClick={() => {selectuser()}} colorScheme='teal' size='lg'>select user's location</Button> </Flex> }
      {countuser >= 1 &&  <Flex minWidth='max-content' justifyContent='center'> <Button onClick={calculateDistance} colorScheme='teal' size='lg'>calculate Distance</Button> </Flex> }
      
        { markers.map((marker) => (
          <Marker key={marker.lat} label={'W'}
            position={{
              lat: marker.lat,
              lng: marker.lng
            }} /> 
        ))}

        { rider.map((r) => (
          <Marker key={r.lat} label={'R'}
            position={{
              lat: r.lat,
              lng: r.lng
            }} /> 
        ))}

        { users.map((u) => (
          <Marker key={u.lat}  label={'U'}
            position={{
              lat: u.lat,
              lng: u.lng
            }} /> 
        ))}
        {path.length > 1 &&  <DirectionsService
          options={{
            origin: path[0],
            destination: path[path.length - 1],
            waypoints: path.map(waypoint => ({ location: waypoint })),
            travelMode: 'DRIVING'
          }}
          callback={directionsCallback}
        />}

     {directions && <DirectionsRenderer directions={directions}  options={{ draggable: true , preserveViewport : true }}  />} 
     {directions && <Alert status='success' textAlign='center' flexDirection='row'  
  alignItems='center'
  justifyContent='center'>
    <AlertIcon />
   Distance of the optimal path is {Math.round(dis * 1.609344)} Kilometers
  </Alert>}

      </GoogleMap>
    </Flex>
  );
};

export default App;