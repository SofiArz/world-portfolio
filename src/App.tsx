import React, { useState } from "react";
import Globe3D from "./globe/Globe.js";

export default function App() {
  // Example: San Francisco
  const [points, setPoints] = useState([
    {
      lat: 37.7749,
      lng: -122.4194,
      color: "#FF5B8C",
      size: 0.22,
      label: "San Francisco"
    },
    {
      lat: 51.5074,
      lng: -0.1278,
      color: "#5B8CFF",
      size: 0.18,
      label: "London"
    }
  ]);

  // Example: add a point on scroll (for demo/future extension)
  // React.useEffect(() => {
  //   const onScroll = () => setPoints((pts) => [
  //     ...pts,
  //     { lat: 35, lng: 139, color: '#FFD700', size: 0.2, label: 'Tokyo' }
  //   ]);
  //   window.addEventListener('scroll', onScroll, { once: true });
  //   return () => window.removeEventListener('scroll', onScroll);
  // }, []);

  return <Globe3D points={points} />;
}
