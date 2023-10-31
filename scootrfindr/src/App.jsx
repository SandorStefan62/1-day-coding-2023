import { GoogleMap, useLoadScript, MarkerF, InfoWindowF } from '@react-google-maps/api'
import './App.css'
import { useState, useEffect } from 'react';
import Login from './components/login/Login';
import User from './components/user/User';
import Admin from './components/admin/Admin';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import axios from 'axios';

const libraries = ['places'];

const defaultCenter = {
  lat: 45.76700863476622,
  lng: 21.228362694580113,
};


function App() {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: '',
    libraries
  })
  const [markers, setMarkers] = useState([
    // { lat: 45.76782506542521, lng: 21.230684766559914 },
    // { lat: 45.766028855370735, lng: 21.221908579090137 },
    // { lat: 45.76721134657924, lng: 21.223496431306803 },
  ])
  const [center, setCenter] = useState(defaultCenter)
  const [enableMarkerCreation, setEnableMarkerCreatiin] = useState(false);

  const handleMapClick = (event) => {
    if (enableMarkerCreation) {
      const newMarker = {
        lat: event.latLng.lat(),
        lng: event.latLng.lng(),
        reserved: "false"
      }

      axios.post('http://localhost:3000/addMarkers', newMarker).then(response => {
        axios.get('http://localhost:3000/getMarkers').then(response => {
          setMarkers(response.data);
        })
          .catch(error => {
            console.error("error fetching markers: ", error);
          })
      })
        .catch(error => {
          console.error("error posting marker: ", error);
        })
    }
  }

  useEffect(() => {
    axios.get('http://localhost:3000/getMarkers').then(response => {
      setMarkers(response.data);
    })
      .catch(error => {
        console.error("error fetching markers: ", error);
      })
  }, []);

  useEffect(() => {
    localStorage.setItem('center', JSON.stringify(center));
  }, [center]);

  useEffect(() => {
    const storedMarkers = localStorage.getItem('markers');
    const storedCenter = localStorage.getItem('center');

    // console.log("Stored markers: ", storedMarkers);
    // console.log("Stored center: ", storedCenter);

    if (storedMarkers) {
      setMarkers(JSON.parse(storedMarkers));
    }
    if (storedCenter) {
      setCenter(JSON.parse(storedCenter));
    }
  }, []);

  // console.log("set markers:", markers);
  // console.log("set center:", center);

  if (loadError) {
    return <div>Error Loading Maps</div>
  }

  if (!isLoaded) {
    return <div>Loading maps</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/user" element={<User markers={markers} handleMapClick={handleMapClick} setMarkers={setMarkers} />} />
        <Route path="/admin" element={<Admin markers={markers} handleMapClick={handleMapClick} setMarkers={setMarkers} setEnableMarkerCreatiin={setEnableMarkerCreatiin} enableMarkerCreation={enableMarkerCreation} />} />
      </Routes>
    </Router>
  )
}

export default App
