import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapPicker.css";
import { useEffect } from "react";

function ChangeMapView({ center }) {

    const map = useMap();

    useEffect(() => {
        map.flyTo(center, 16, {
            animate: true,
            duration: 1.5
        });
    }, [center, map]);

    return null;
}

function MapPicker({ center }) {

    return (
        <MapContainer
            center={center}
            zoom={16}
            className="map-container"
        >
            <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={center} />

            <ChangeMapView center={center} />

        </MapContainer>
    );
}

export default MapPicker;