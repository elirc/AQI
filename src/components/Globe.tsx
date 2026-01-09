import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { OrbitControls, Sphere, Html } from '@react-three/drei'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import { useMapStations } from '../hooks/useAQI'
import { getAQIColor, type AQIStation } from '../types'

// Convert lat/lng to 3D position on sphere
function latLngToVector3(lat: number, lng: number, radius: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lng + 180) * (Math.PI / 180)
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  )
}

interface MarkerProps {
  station: AQIStation
  onClick: (uid: number) => void
}

function Marker({ station, onClick }: MarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const aqi = typeof station.aqi === 'number' ? station.aqi : 0
  const position = useMemo(
    () => latLngToVector3(station.lat, station.lon, 2.02),
    [station.lat, station.lon]
  )
  const color = getAQIColor(aqi)
  const scale = hovered ? 0.04 : 0.025

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={() => onClick(station.uid)}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[scale, 8, 8]} />
      <meshBasicMaterial color={color} transparent opacity={0.9} />
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-card px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap border border-border">
            <p className="font-medium">{station.station.name}</p>
            <p style={{ color }}>AQI: {aqi}</p>
          </div>
        </Html>
      )}
    </mesh>
  )
}

function Earth({ stations, onStationClick }: { stations: AQIStation[]; onStationClick: (uid: number) => void }) {
  const earthRef = useRef<THREE.Mesh>(null)
  const cloudsRef = useRef<THREE.Mesh>(null)

  // Slow rotation
  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.0005
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0007
    }
  })

  return (
    <group>
      {/* Earth sphere */}
      <Sphere ref={earthRef} args={[2, 64, 64]}>
        <meshStandardMaterial
          color="#1a365d"
          roughness={0.8}
          metalness={0.2}
        />
      </Sphere>

      {/* Atmosphere glow */}
      <Sphere args={[2.1, 64, 64]}>
        <meshBasicMaterial
          color="#60a5fa"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Grid lines */}
      <lineSegments>
        <edgesGeometry args={[new THREE.IcosahedronGeometry(2.01, 3)]} />
        <lineBasicMaterial color="#3b82f6" transparent opacity={0.2} />
      </lineSegments>

      {/* Station markers */}
      {stations.map((station) => (
        <Marker key={station.uid} station={station} onClick={onStationClick} />
      ))}
    </group>
  )
}

function Scene({ stations, onStationClick }: { stations: AQIStation[]; onStationClick: (uid: number) => void }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 3, 5]} intensity={1} />
      <Earth stations={stations} onStationClick={onStationClick} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={3}
        maxDistance={10}
        autoRotate={false}
      />
    </>
  )
}

export default function Globe() {
  const navigate = useNavigate()
  const { data: stations = [], isLoading } = useMapStations()

  // Filter to show only concerning AQI levels (>50) to reduce clutter
  const concerningStations = useMemo(
    () => stations.filter((s) => typeof s.aqi === 'number' && s.aqi > 50),
    [stations]
  )

  const handleStationClick = (uid: number) => {
    navigate(`/city/${uid}`)
  }

  return (
    <div className="relative w-full h-full min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        className="globe-canvas"
      >
        <Scene stations={concerningStations} onStationClick={handleStationClick} />
      </Canvas>

      {/* Stats overlay */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 text-sm">
        <p className="text-muted-foreground">
          {isLoading ? 'Loading stations...' : `${concerningStations.length} stations with AQI > 50`}
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-card/80 backdrop-blur-sm rounded-lg p-3">
        <p className="text-xs font-medium mb-2">AQI Scale</p>
        <div className="flex gap-1">
          {[
            { color: '#00e400', label: '0-50' },
            { color: '#ffff00', label: '51-100' },
            { color: '#ff7e00', label: '101-150' },
            { color: '#ff0000', label: '151-200' },
            { color: '#8f3f97', label: '201-300' },
            { color: '#7e0023', label: '300+' },
          ].map((item) => (
            <div
              key={item.label}
              className="w-6 h-4 rounded text-[8px] flex items-center justify-center font-medium"
              style={{ backgroundColor: item.color, color: item.color === '#ffff00' ? '#000' : '#fff' }}
              title={item.label}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
