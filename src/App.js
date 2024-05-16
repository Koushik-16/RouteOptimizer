import React from 'react';
import { GoogleMap, useLoadScript, Marker, DirectionsService, DirectionsRenderer,Polyline } from '@react-google-maps/api';
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
  const [directions, setDirections] = useState([]);
  const [load, setload] = useState(false);
  const [reset, setreset] = useState(false);
  const [input, setinput] = useState('warehouse');
  const [users, setusers] = useState([]);
  const [countuser, setcountuser] = useState(0);


const  directionsCallback =  async (response) => {
  if (response !== null) {
    if (response.status === 'OK') {
      
      if(directions.length <= path.length) setDirections([...directions , response]);
      setreset(true);
      setload(false);
      setcountuser(0);
    } else {
      console.error(`Error fetching directions: ${response.status}`);
    }
  }
};





 
  async function calculateDistance() {
    setload(true);
    const url = 'http://localhost:8080/'; 
    // console.log(markers);
    // console.log(rider);
    // console.log(users);
     await axios.post(url , {markers , users} )
    .then(res => {
     
      // console.log(res.data);
      setpath(res.data.path);
     setdis(res.data.dist);
    

    
    });
   
   

     

  }

   function resetmap(e) {
  
  
    window.location.reload();
    
  }

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

  function selectuser() {
    setinput('user');
    setcount(0);
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
        </Button> </Flex>}*/}

{reset &&  <Flex minWidth='max-content' justifyContent='center'> <Button onClick={() => {resetmap()}} colorScheme='teal' size='lg'>
        
       Reset Map
      </Button> </Flex>} 

      {count >= 1 &&  <Flex minWidth='max-content' justifyContent='center'> <Button onClick={() => {selectuser()}} colorScheme='teal' size='lg'>select user's location</Button> </Flex> }
      {countuser >= 1 &&  <Flex minWidth='max-content' justifyContent='center'> <Button onClick={calculateDistance} colorScheme='teal' size='lg'>calculate Distance</Button> </Flex> }
      
        { markers.map((marker , index) => (
          <Marker key={index} label={'W'}
            position={{
              lat: marker.lat,
              lng: marker.lng
            }} /> 
        ))}

       
        { users.map((u , index) => (
          <Marker key={index}  label={'U'}
            position={{
              lat: u.lat,
              lng: u.lng
            }} /> 
        ))}

        {console.log(path)};

        {path.length >= 1 &&  path.map((p , index) => {
          if(p.length >= 1) {
          return <DirectionsService
          key={index}
          options={{
            origin: p[0],
            destination: p[p.length - 1],
            waypoints: p.map(waypoint => ({ location: waypoint })),
            travelMode: 'DRIVING'
          }}
          callback={directionsCallback}
        />
        }
        })}
        

       { directions.length >= path.length && directions.map((d ,ind) => {return  <DirectionsRenderer key={ind} directions={d}  options={{ draggable: true , preserveViewport : true }}  />})}
      

     {/* {directions && <DirectionsRenderer directions={directions}  options={{ draggable: true , preserveViewport : true }}  />}  */}
     {directions.length >= 1 && <Alert status='success' textAlign='center' flexDirection='row'  
  alignItems='center'
  justifyContent='center'>
    <AlertIcon />
   Distance of the optimal path is {dis /1000.0} Kilometers
  </Alert>}

      </GoogleMap>
    </Flex>
  );
};

export default App;