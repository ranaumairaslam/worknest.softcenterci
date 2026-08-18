import { Suspense, useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function useLandDotsGrid(imageUrl, radius = 1.5, gridSteps = 120) {
  const [positions, setPositions] = useState(null);

  useEffect(() => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

      const pts = [];

      for (let latI = 0; latI < gridSteps; latI++) {
        const v = latI / (gridSteps - 1);
        const phi = v * Math.PI;

        const ringRadius = Math.sin(phi);
        const lonSteps = Math.max(4, Math.round(gridSteps * 2 * ringRadius));

        for (let lonI = 0; lonI < lonSteps; lonI++) {
          const u = lonI / lonSteps;
          const theta = u * Math.PI * 2;

          const px = Math.floor(u * canvas.width);
          const py = Math.floor(v * canvas.height);
          const idx = (py * canvas.width + px) * 4;

          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];
          const brightness = (r * 0.299 + g * 0.587 + b * 0.114) / 255;

          if (brightness > 0.32 && brightness < 0.88) {
            const x = Math.sin(phi) * Math.cos(theta) * radius;
            const y = Math.cos(phi) * radius;
            const z = Math.sin(phi) * Math.sin(theta) * radius;
            pts.push(x, y, z);
          }
        }
      }

      setPositions(new Float32Array(pts));
    };
  }, [imageUrl, radius, gridSteps]);

  return positions;
}

function RimGlow({ radius }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: { glowColor: { value: new THREE.Color("#a3feff") } },
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          uniform vec3 glowColor;
          void main() {
            float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.5);
            gl_FragColor = vec4(glowColor, intensity * 0.9);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    []
  );

  return (
    <mesh scale={1.08}>
      <sphereGeometry args={[radius, 64, 64]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}

function EarthDots() {
  const groupRef = useRef();
  const radius = 1.5;
  const positions = useLandDotsGrid(
    "https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg",
    radius,
    130
  );

  const oceanMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#016472",
        roughness: 0.6,
        metalness: 0.2,
      }),
    []
  );

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.18;
  });

  return (
    
    <group ref={groupRef} position={[0, 0.3, 0]}>
      <mesh>
        <sphereGeometry args={[radius - 0.01, 64, 64]} />
        <primitive object={oceanMaterial} attach="material" />
      </mesh>

      {positions && (
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={positions}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial
            color="#a3feff"
            size={0.018}
            sizeAttenuation
            transparent
            opacity={1}
          />
        </points>
      )}

      <RimGlow radius={radius} />
    </group>

  );
}

export default function Earth() {
  return (
    <div className="mx-auto h-[320px] w-[320px] sm:h-[420px] sm:w-[420px] md:h-[500px] md:w-[500px] lg:h-[600px] lg:w-[600px] xl:h-[650px] xl:w-[650px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        dpr={[1, 1]}
        shadows={false}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <EarthDots />
        </Suspense>

        <OrbitControls
          autoRotate
          autoRotateSpeed={0.15}
          enableZoom={false}
          enablePan={false}
          enableDamping={false}
        />
      </Canvas>
    </div>
  );
}