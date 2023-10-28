import { GoogleMap, MarkerF, InfoWindowF } from '@react-google-maps/api'
import { useState } from 'react';
import axios from 'axios';

const mapContainerStyle = {
    width: '50vw',
    height: '50vh',
};

const infoWindowStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
}

const buttonStyle = {
    width: '100px',
    height: '25px'
}

const defaultCenter = {
    lat: 45.76700863476622,
    lng: 21.228362694580113,
};

function Map({ markers, onMapClick, setMarkers }) {

    const [infoWindowOpen, setInfoWindowOpen] = useState(null);
    const [userRole, setUserRole] = useState('');

    const handleDelete = (lat, lng) => {
        console.log(lat, lng);
        axios.delete('http://localhost:3000/deleteMarker/' + lat + '/' + lng).then((response) => {
            // console.log(response.status)
            axios.get('http://localhost:3000/getMarkers').then(response => {
                setMarkers(response.data);
            })
                .catch(error => {
                    console.error("error fetching markers: ", error);
                })
        }).catch(error => {
            console.error("failed to delete marker: ", error);
        })
    }

    const toggleReserved = (lat, lng, reserved) => {
        console.log(reserved)
        if (reserved === 'false') {
            axios.put(`http://localhost:3000/toggleReserved/${lat}/${lng}/${true}`).then((response) => {
                axios.get('http://localhost:3000/getMarkers')
                    .then((response) => {
                        setMarkers(response.data);
                    })
                    .catch((error) => {
                        console.error('error fetching markers: ', error);
                    });
            }).catch((error) => {
                console.error('failed to toggle reserved: ', error);
            });
        } else {
            console.log('Cannot reserve because it is already reserved');
        }
    }

    return (
        <>
            <GoogleMap
                zoom={15}
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                onClick={onMapClick}>
                {markers.map((marker, index) => (
                    // console.log("printing: ", marker)
                    <MarkerF
                        key={index}
                        position={marker}
                        onClick={() => {
                            setInfoWindowOpen(marker)
                        }} />
                ))}
                {infoWindowOpen && (<InfoWindowF mapContainerStyle={infoWindowStyle} position={infoWindowOpen} onCloseClick={() => {
                    setInfoWindowOpen(null);
                }}>
                    <div>
                        <div>this is infocard</div>
                        <button style={buttonStyle} onClick={() => {
                            toggleReserved(infoWindowOpen.lat.toString(), infoWindowOpen.lng.toString(), infoWindowOpen.reserved.toString())
                        }}>reserve</button>
                        <button style={buttonStyle} onClick={() => {
                            handleDelete(infoWindowOpen.lat.toString(), infoWindowOpen.lng.toString());
                            setInfoWindowOpen(null);
                        }}>delete this</button>
                    </div>
                </InfoWindowF>)}
            </GoogleMap>
        </>
    )
}

export default Map;