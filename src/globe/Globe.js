import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Globe from "r3f-globe";
import CameraController from "./CameraController";

const MIDNIGHT = {
  globe: "#181A2A",
  continents: "#23263A",
  point: "#5B8CFF",
  atmosphere: "#c3c5de",
  background: "#0B0C1A",
  camera:"#0c0d14"
};

function GlobePoints({ points }) {
  return points.map((pt, i) => (
    <mesh key={i} position={latLngToVector3(pt.lat, pt.lng, 1.05)}>
      <sphereGeometry args={[pt.size || 0.025, 16, 16]} />
      <meshStandardMaterial color={pt.color || MIDNIGHT.point} emissive={pt.color || MIDNIGHT.point} emissiveIntensity={0.7} />
    </mesh>
  ));
}

function latLngToVector3(lat, lng, radius = 1) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return [
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  ];
}

export default function Globe3D({ points = [] }) {
  const [polygons, setPolygons] = useState([]);

  // Fetch continents GeoJSON
  useEffect(() => {
    fetch("/ne_110m_land.geojson")
      .then(res => res.json())
      .then(geo => setPolygons(geo.features));
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", background: MIDNIGHT.background, position: "fixed", top: 0, left: 0, zIndex: 0 }}>
      <Canvas camera={{ position: [0, 0, 4], fov: 60 }}>
      <CameraController />
        <color attach="background" args={[MIDNIGHT.camera]} />
        <ambientLight intensity={0.7} />
        <directionalLight position={[5, 3, 5]} intensity={0.7} />
        {
          polygons.length > 0 && (
            <>
              <Globe
                polygonsData={polygons}
                polygonCapColor={() => MIDNIGHT.continents}
                polygonSideColor={() => MIDNIGHT.continents}
                polygonStrokeColor={() => MIDNIGHT.continents}
                globeColor={MIDNIGHT.globe}
                showAtmosphere={true}
                atmosphereColor={MIDNIGHT.atmosphere}
                atmosphereAltitude={0.15}
                showGraticules={false}
              />
              <GlobePoints points={points} />
              <OrbitControls
                enablePan
                enableZoom
                enableRotate
                minDistance={200.5}
                maxDistance={250}
                onChange={(e) => {
                  const camera = e.target.object;
                  console.log('Camera position:', {
                    x: camera.position.x,
                    y: camera.position.y,
                    z: camera.position.z
                  });
                  console.log('Camera rotation:', {
                    x: camera.rotation.x,
                    y: camera.rotation.y,
                    z: camera.rotation.z
                  });
                }}
              />
            </>)
        }
      </Canvas>
    </div>
  );
}
