import Map from "../map/Map"

function Admin({ markers, handleMapClick, setMarkers, setEnableMarkerCreatiin, enableMarkerCreation }) {
    return (
        <>
            <h1>Admin page</h1>
            <h1>start of an epic app</h1>
            <h1>scootrfindr ✔</h1>
            <button onClick={() => { setEnableMarkerCreatiin(!enableMarkerCreation) }}> Enable Marker Creation </button>
            <Map markers={markers} onMapClick={handleMapClick} setMarkers={setMarkers} />
        </>
    )
}

export default Admin