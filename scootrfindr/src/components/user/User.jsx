import Map from "../map/Map"

function User({ markers, handleMapClick, setMarkers }) {

    return (
        <>
            <h1>user page</h1>
            <h1>start of an epic app</h1>
            <h1>scootrfindr ✔</h1>
            <Map markers={markers} onMapClick={handleMapClick} setMarkers={setMarkers} />
        </>
    )
}

export default User