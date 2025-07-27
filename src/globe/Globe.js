import React, { useEffect, useRef, useState } from "react";

// Use globe.gl via CDN:
// <script src="https://unpkg.com/globe.gl"></script>

const MIDNIGHT = {
  globe: "#181A2A",
  continents: "#23263A",
  point: "#5B8CFF",
  atmosphere: "#2B2D42",
  background: "#0B0C1A"
};

export default function Globe3D({ points = [] }) {
  const globeEl = useRef(null);
  const [globe, setGlobe] = useState(null);
  const [landPolygons, setLandPolygons] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Load continents GeoJSON
  useEffect(() => {
    fetch("/ne_110m_land.geojson")
      .then((res) => res.json())
      .then((geo) => setLandPolygons(geo.features));
  }, []);

  useEffect(() => {
    if (globeEl.current) {
      const rect = globeEl.current.getBoundingClientRect();
      console.log('globeEl size:', rect.width, rect.height);
    }
  }, []);

  // Initialize globe once container is ready
  useEffect(() => {
    if (!window.Globe || !landPolygons || globe) return;
    if (!globeEl.current) return;

    const observer = new ResizeObserver(([entry]) => {
      if (entry && entry.contentRect.width > 0 && entry.contentRect.height > 0) {
        const el = globeEl.current;
        const globeInstance = window.Globe()(el)
          .globeImageUrl(null)
          .backgroundColor(MIDNIGHT.background)
          .showGraticules(false)
          .showAtmosphere(true)
          .atmosphereColor(MIDNIGHT.atmosphere)
          .atmosphereAltitude(0.18)
          .polygonsData(landPolygons)
          .polygonCapColor(() => MIDNIGHT.continents)
          .polygonSideColor(() => MIDNIGHT.continents)
          .polygonStrokeColor(() => "rgba(0,0,0,0)")
          .polygonAltitude(0.01)
          .polygonLabel(() => null)
          .pointOfView({ lat: 20, lng: 0, altitude: 2.2 })
          .width(window.innerWidth)
          .height(window.innerHeight)
          .pointsData(points)
          .pointLat((d) => d.lat)
          .pointLng((d) => d.lng)
          .pointColor((d) => d.color || MIDNIGHT.point)
          .pointAltitude((d) => d.altitude || 0.03)
          .pointRadius((d) => d.size || 0.18)
          .pointLabel((d) => d.label || "")
          .onPointHover(setHoveredPoint)
          .onZoom(() => {})
          .onGlobeReady(() => {
            globeInstance.controls().enablePan = true;
          });

        setGlobe(globeInstance);
        observer.disconnect(); // stop observing
      }
    });

    observer.observe(globeEl.current);
    return () => observer.disconnect();
  }, [landPolygons, globe]);

  // Dynamic points update
  useEffect(() => {
    if (globe) globe.pointsData(points);
  }, [points, globe]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: MIDNIGHT.background,
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 0,
      }}
    >
      <div ref={globeEl} />
      {hoveredPoint && hoveredPoint.label && (
        <div
          style={{
            position: "fixed",
            left: 20,
            bottom: 20,
            color: MIDNIGHT.point,
            background: "rgba(24,26,42,0.95)",
            padding: "8px 16px",
            borderRadius: 8,
            fontSize: 18,
            pointerEvents: "none",
          }}
        >
          {hoveredPoint.label}
        </div>
      )}
    </div>
  );
}
