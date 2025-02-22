"use client";

import React from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

function SimpleMap() {
    const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // San Francisco, CA (default location)

    return (
        <div style={{ height: "100vh", width: "100vw" }}>
            <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
                <Map 
                    defaultZoom={10} 
                    defaultCenter={defaultCenter} 
                    fullscreenControl={false} 
                    mapId={process.env.REACT_APP_PERSONAL_MAP_ID} 
                />
            </APIProvider>
        </div>
    );
}

export default React.memo(SimpleMap);