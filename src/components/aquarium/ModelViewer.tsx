import { useState, useRef, useEffect, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Button } from "@/components/ui/button";
import { heroPhoto } from "@/data/content";
import { varieties, type Variety } from "@/data/varieties";
import { aquariumAudio } from "@/lib/aquarium-audio";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  Eye,
  EyeOff,
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  Compass,
} from "lucide-react";

// Anatomical hotspots coordinates calibrated to the guppy 3D mesh
interface Hotspot {
  id: string;
  name: string;
  subtitle: string;
  pos: [number, number, number];
  cameraTarget: [number, number, number];
  cameraPos: [number, number, number];
  description: string;
  fact: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: "caudal",
    name: "Aleta Caudal Delta",
    subtitle: "Propulsión y atracción visual",
    pos: [-0.42, 0.0, 0.08],
    cameraTarget: [-0.38, 0.0, 0.0],
    cameraPos: [-0.6, 0.05, 1.4],
    description:
      "Aleta en abanico con un ángulo de apertura de hasta 70°. Compuesta por radios dérmicos flexibles cubiertos de células pigmentarias e iridóforos.",
    fact: "Genera el 85% de la fuerza propulsora en nado crucero.",
  },
  {
    id: "dorsal",
    name: "Aleta Dorsal",
    subtitle: "Estabilidad y cortejo",
    pos: [-0.14, 0.16, 0.03],
    cameraTarget: [-0.14, 0.12, 0.0],
    cameraPos: [-0.14, 0.35, 1.3],
    description:
      "Aleta eréctil que actúa como quilla estabilizadora. Durante el cortejo, el macho la despliega en toda su amplitud junto con el arco corporal sigmoideo.",
    fact: "Previene el cabeceo lateral durante giros veloces.",
  },
  {
    id: "branquias",
    name: "Opérculo y Branquias",
    subtitle: "Respiración osmótica",
    pos: [0.24, 0.0, 0.1],
    cameraTarget: [0.24, 0.0, 0.0],
    cameraPos: [0.38, 0.05, 1.2],
    description:
      "Placas protectoras que cubren arcos branquiales hipervascularizados, capaces de extraer oxígeno en aguas poco oxigenadas de arroyos tropicales.",
    fact: "El ritmo respiratorio normal es de 90 a 140 pulsos por minuto.",
  },
  {
    id: "ojo",
    name: "Ojo y Línea Lateral",
    subtitle: "Percepción multisensorial",
    pos: [0.44, 0.01, 0.07],
    cameraTarget: [0.42, 0.01, 0.0],
    cameraPos: [0.58, 0.05, 1.2],
    description:
      "Ojos con conos sensibles a longitudes de onda ultravioleta para identificar los patrones iridiscentes de sus congéneres, sumado a mecanorreceptores laterales.",
    fact: "Detecta fluctuaciones de corriente menores a 1 mm/s.",
  },
  {
    id: "vientre",
    name: "Gonosoma y Zona Ventral",
    subtitle: "Dimorfismo sexual y reproducción",
    pos: [0.1, -0.12, 0.04],
    cameraTarget: [0.1, -0.1, 0.0],
    cameraPos: [0.15, -0.28, 1.3],
    description:
      "En machos, la aleta anal está modificada en un órgano copulador móvil llamado gonopodio, permitiendo la fecundación interna como especie vivípara.",
    fact: "Las hembras pueden almacenar esperma para múltiples camadas sin macho.",
  },
];

interface VarietyColorConfig {
  hex: number;
  ambientHex: number;
  name: string;
}

const DEFAULT_VARIETY_COLOR: VarietyColorConfig = {
  hex: 0x38bdf8,
  ambientHex: 0x0284c7,
  name: "Neon Blue",
};

// Color mapping for varieties in Three.js
const VARIETY_COLORS: Record<string, VarietyColorConfig> = {
  blue: DEFAULT_VARIETY_COLOR,
  red: { hex: 0xf43f5e, ambientHex: 0xe11d48, name: "Full Red" },
  yellow: { hex: 0xfacc15, ambientHex: 0xd97706, name: "Yellow Gold" },
  black: { hex: 0x64748b, ambientHex: 0x334155, name: "Black Prince" },
  cobra: { hex: 0x10b981, ambientHex: 0x059669, name: "Cobra Green" },
  endler: { hex: 0x06b6d4, ambientHex: 0xd946ef, name: "Endler Neon" },
  mosaic: { hex: 0x8b5cf6, ambientHex: 0x6366f1, name: "Purple Mosaic" },
  orange: { hex: 0xf97316, ambientHex: 0xea580c, name: "Sunset Orange" },
  fancy: { hex: 0x22d3ee, ambientHex: 0xf43f5e, name: "Fancy Prism" },
};

interface ModelViewerProps {
  activeVarietyId?: string | undefined;
  onSelectVariety?: ((variety: Variety) => void) | undefined;
}

// Calculate optimal camera distance based on viewport aspect ratio
// Guppy length is ~1.17 units. Dynamic formula guarantees the full fish occupies ~65% of screen width on any device.
function getResponsiveCameraDistance(aspect: number): number {
  if (aspect <= 0) return 3.5;
  const calculated = 2.75 / aspect;
  return Math.min(4.2, Math.max(1.95, calculated));
}

export function ModelViewer({ activeVarietyId = "blue", onSelectVariety }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // UI state
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSwimming, setIsSwimming] = useState(true);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [isWireframe, setIsWireframe] = useState(false);
  const [activeCameraView, setActiveCameraView] = useState<string>("360");
  const [screenCoords, setScreenCoords] = useState<
    Record<string, { x: number; y: number; visible: boolean }>
  >({});
  const [fps, setFps] = useState(60);
  const initialVarietyRef = useRef(activeVarietyId);

  // Three.js internal references
  const threeRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    controls: OrbitControls;
    fishMesh: THREE.Mesh | null;
    particles: THREE.Points | null;
    rimLight: THREE.PointLight;
    bellyLight: THREE.PointLight;
    material: THREE.MeshStandardMaterial | null;
    shaderUniforms: {
      uTime: { value: number };
      uSwimSpeed: { value: number };
      uSwimAmplitude: { value: number };
      uMinX: { value: number };
      uMaxX: { value: number };
      uTint: { value: THREE.Color };
    };
    targetCameraPos: THREE.Vector3 | null;
    targetControlsTarget: THREE.Vector3 | null;
    animFrameId: number;
  } | null>(null);

  // Synchronize color changes to lights and materials
  useEffect(() => {
    if (!threeRef.current) return;
    const { rimLight, bellyLight, shaderUniforms } = threeRef.current;
    const vConfig =
      (activeVarietyId ? VARIETY_COLORS[activeVarietyId] : undefined) ?? DEFAULT_VARIETY_COLOR;
    const color = new THREE.Color(vConfig.hex);
    const ambientColor = new THREE.Color(vConfig.ambientHex);

    rimLight.color.lerp(color, 0.8);
    bellyLight.color.lerp(ambientColor, 0.8);
    shaderUniforms.uTint.value.lerp(color, 0.8);
  }, [activeVarietyId]);

  // Wireframe toggle
  useEffect(() => {
    if (!threeRef.current?.material) return;
    threeRef.current.material.wireframe = isWireframe;
  }, [isWireframe]);

  // Swimming toggle
  useEffect(() => {
    if (!threeRef.current) return;
    threeRef.current.shaderUniforms.uSwimSpeed.value = isSwimming ? 4.2 : 0.0;
    threeRef.current.shaderUniforms.uSwimAmplitude.value = isSwimming ? 0.09 : 0.0;
  }, [isSwimming]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const width = containerRef.current.clientWidth || 600;
    const height = containerRef.current.clientHeight || 450;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera - Posición normal erguida a nivel de ojos
    const aspect = width / height;
    const initialDist = getResponsiveCameraDistance(aspect);
    const camera = new THREE.PerspectiveCamera(36, aspect, 0.1, 50);
    camera.position.set(0.0, 0.0, initialDist);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 0.8;
    controls.maxDistance = Math.max(5.5, initialDist * 2.0);
    controls.maxPolarAngle = Math.PI / 1.7; // ~105° para no voltear el pez
    controls.minPolarAngle = Math.PI / 4.0; // ~45° vista cenital controlada
    controls.target.set(0.0, 0.0, 0.0);

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0x0a2432, 2.2);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xdcf8fb, 2.8);
    sunLight.position.set(1.5, 4, 2);
    scene.add(sunLight);

    const initialColor =
      (initialVarietyRef.current ? VARIETY_COLORS[initialVarietyRef.current] : undefined) ??
      DEFAULT_VARIETY_COLOR;
    const rimLight = new THREE.PointLight(initialColor.hex, 4.5, 6);
    rimLight.position.set(0.7, 0.5, -0.6);
    scene.add(rimLight);

    const bellyLight = new THREE.PointLight(initialColor.ambientHex, 2.8, 5);
    bellyLight.position.set(-0.2, -0.7, 0.4);
    scene.add(bellyLight);

    // 6. Floating Particles (Micro-bubbles & aquatic dust)
    const particleCount = 130;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSpeeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 4;
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      particleSpeeds[i] = 0.002 + Math.random() * 0.005;
    }
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x67e8f9,
      size: 0.022,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // 7. Shader uniforms for swimming deformation
    const shaderUniforms = {
      uTime: { value: 0 },
      uSwimSpeed: { value: 4.2 },
      uSwimAmplitude: { value: 0.09 },
      uMinX: { value: -0.43 },
      uMaxX: { value: 0.74 },
      uTint: { value: new THREE.Color(initialColor.hex) },
    };

    const threeState = {
      scene,
      camera,
      renderer,
      controls,
      fishMesh: null as THREE.Mesh | null,
      particles,
      rimLight,
      bellyLight,
      material: null as THREE.MeshStandardMaterial | null,
      shaderUniforms,
      targetCameraPos: null as THREE.Vector3 | null,
      targetControlsTarget: null as THREE.Vector3 | null,
      animFrameId: 0,
    };
    threeRef.current = threeState;

    // 8. Load GLTF model
    const loader = new GLTFLoader();
    loader.load(
      "/models/guppy.glb",
      (gltf) => {
        const mesh = gltf.scene.children[0] as THREE.Mesh;
        if (mesh) {
          // El modelo original fue exportado con los flancos en Y y la aleta dorsal en -Z (acostado de lado).
          // rotateX(Math.PI / 2) coloca al pez 100% ERGUIDO:
          // Aleta dorsal ARRIBA (+Y), vientre ABAJO (-Y), y flancos mirando hacia la cámara (+Z).
          mesh.geometry.rotateX(Math.PI / 2);
          mesh.geometry.computeBoundingBox();
          mesh.geometry.center();

          // Hook custom swimming deformation in vertex shader
          const mat = mesh.material as THREE.MeshStandardMaterial;
          mat.roughness = 0.35;
          mat.metalness = 0.2;

          mat.onBeforeCompile = (shader) => {
            shader.uniforms["uTime"] = shaderUniforms.uTime;
            shader.uniforms["uSwimSpeed"] = shaderUniforms.uSwimSpeed;
            shader.uniforms["uSwimAmplitude"] = shaderUniforms.uSwimAmplitude;
            shader.uniforms["uTint"] = shaderUniforms.uTint;

            shader.vertexShader = `
              uniform float uTime;
              uniform float uSwimSpeed;
              uniform float uSwimAmplitude;
              ${shader.vertexShader}
            `;

            shader.vertexShader = shader.vertexShader.replace(
              "#include <begin_vertex>",
              `
              #include <begin_vertex>
              // Ondulación anatómica lateral de natación a lo largo de X
              float normX = clamp((position.x - (-0.55)) / (0.55 - (-0.55)), 0.0, 1.0);
              float wave = sin(uTime * uSwimSpeed - normX * 4.2);
              float sway = (0.008 + pow(normX, 1.9) * uSwimAmplitude) * wave;
              transformed.z += sway;
              // Ondulación secundaria suave en aletas dorsal y anal
              transformed.y += sin(uTime * (uSwimSpeed * 0.5) - normX * 2.8) * (normX * 0.012);
              `,
            );
          };

          threeState.material = mat;
          threeState.fishMesh = mesh;
          scene.add(mesh);
        }
        setLoading(false);
      },
      (xhr) => {
        if (xhr.total > 0) {
          setLoadProgress(Math.round((xhr.loaded / xhr.total) * 100));
        }
      },
      (err) => {
        console.error("Error loading guppy 3D model:", err);
        setLoading(false);
      },
    );

    // 9. Animation & Render Loop
    let lastTime = performance.now();
    let frameCount = 0;
    let fpsTimer = performance.now();

    const animate = (time: number) => {
      threeState.animFrameId = requestAnimationFrame(animate);

      const delta = (time - lastTime) * 0.001;
      lastTime = time;

      // FPS measurement
      frameCount++;
      if (time - fpsTimer > 1000) {
        setFps(Math.round((frameCount * 1000) / (time - fpsTimer)));
        frameCount = 0;
        fpsTimer = time;
      }

      // Update shader time for swimming
      shaderUniforms.uTime.value = time * 0.001;

      // Gentle floating buoyancy motion
      if (threeState.fishMesh) {
        threeState.fishMesh.position.y = Math.sin(time * 0.0018) * 0.025;
        threeState.fishMesh.rotation.z = Math.cos(time * 0.0012) * 0.012;
      }

      // Drift floating particles
      if (particles) {
        const positionAttr = particleGeometry.getAttribute("position");
        if (positionAttr && positionAttr instanceof THREE.BufferAttribute) {
          const positions = positionAttr.array as Float32Array;
          for (let i = 0; i < particleCount; i++) {
            const yIndex = i * 3 + 1;
            const xIndex = i * 3;
            const speed = particleSpeeds[i] ?? 0.003;
            const currentY = positions[yIndex];
            const currentX = positions[xIndex];
            if (currentY !== undefined && currentX !== undefined) {
              const newY = currentY + speed;
              if (newY > 1.8) {
                positions[yIndex] = -1.8;
                positions[xIndex] = (Math.random() - 0.5) * 4;
              } else {
                positions[yIndex] = newY;
                positions[xIndex] = currentX + Math.sin(time * 0.001 + i) * 0.0006;
              }
            }
          }
          positionAttr.needsUpdate = true;
        }
      }

      // Smooth camera interpolation to target presets/hotspots
      if (threeState.targetCameraPos) {
        camera.position.lerp(threeState.targetCameraPos, 0.06);
        if (camera.position.distanceTo(threeState.targetCameraPos) < 0.01) {
          threeState.targetCameraPos = null;
        }
      }
      if (threeState.targetControlsTarget) {
        controls.target.lerp(threeState.targetControlsTarget, 0.06);
        if (controls.target.distanceTo(threeState.targetControlsTarget) < 0.01) {
          threeState.targetControlsTarget = null;
        }
      }

      controls.update();
      renderer.render(scene, camera);

      // Project hotspots to 2D canvas coordinates
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const coords: Record<string, { x: number; y: number; visible: boolean }> = {};
        const tempVec = new THREE.Vector3();

        for (const h of HOTSPOTS) {
          tempVec.set(...h.pos);
          tempVec.project(camera);

          // Check if hotspot is facing the camera (Z depth)
          const visible = tempVec.z < 1.0;
          const x = (tempVec.x * 0.5 + 0.5) * rect.width;
          const y = (-(tempVec.y * 0.5) + 0.5) * rect.height;

          coords[h.id] = { x, y, visible };
        }
        setScreenCoords(coords);
      }
    };

    threeState.animFrameId = requestAnimationFrame(animate);

    // 10. Resize handler con recalibración responsiva
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      if (w === 0 || h === 0) return;
      const aspect = w / h;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);

      const rDist = getResponsiveCameraDistance(aspect);
      controls.maxDistance = Math.max(5.5, rDist * 2.0);

      // Si está en la vista normal/lateral, ajustar distancia para evitar cortes
      if (
        !threeState.targetCameraPos &&
        (!activeCameraView || activeCameraView === "360" || activeCameraView === "flank")
      ) {
        threeState.targetCameraPos = new THREE.Vector3(0.0, 0.0, rDist);
        threeState.targetControlsTarget = new THREE.Vector3(0.0, 0.0, 0.0);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(threeState.animFrameId);
      controls.dispose();
      renderer.dispose();
    };
  }, [activeCameraView]);

  // Preset Camera Views
  const setCameraView = useCallback((viewId: string) => {
    if (!threeRef.current) return;
    aquariumAudio.playBubblePlop(600);
    setActiveCameraView(viewId);
    setActiveHotspot(null);

    const currentAspect = containerRef.current
      ? containerRef.current.clientWidth / (containerRef.current.clientHeight || 1)
      : 1.0;
    const rDist = getResponsiveCameraDistance(currentAspect);

    let targetPos: [number, number, number] = [0.0, 0.0, rDist];
    let controlsTarget: [number, number, number] = [0.0, 0.0, 0.0];

    switch (viewId) {
      case "flank": // Perfil lateral puro
        targetPos = [0.0, 0.0, rDist];
        controlsTarget = [0.0, 0.0, 0.0];
        break;
      case "head": // Primer plano cabeza (lado derecho +X)
        targetPos = [0.45, 0.02, Math.max(1.2, rDist * 0.48)];
        controlsTarget = [0.4, 0.0, 0.0];
        break;
      case "tail": // Foco en aleta caudal delta (lado izquierdo -X)
        targetPos = [-0.45, 0.02, Math.max(1.3, rDist * 0.52)];
        controlsTarget = [-0.38, 0.0, 0.0];
        break;
      case "top": // Vista cenital superior
        targetPos = [0.0, rDist * 1.05, 0.05];
        controlsTarget = [0.0, 0.0, 0.0];
        break;
      case "360":
      default:
        // Posición normal: pez 100% erguido, aleta dorsal arriba, vientre abajo, natación horizontal
        targetPos = [0.0, 0.0, rDist];
        controlsTarget = [0.0, 0.0, 0.0];
        break;
    }

    threeRef.current.targetCameraPos = new THREE.Vector3(...targetPos);
    threeRef.current.targetControlsTarget = new THREE.Vector3(...controlsTarget);
  }, []);

  // Focus on hotspot
  const handleSelectHotspot = (hotspot: Hotspot) => {
    if (!threeRef.current) return;
    aquariumAudio.playBubblePlop(700);
    setActiveHotspot(hotspot);
    setActiveCameraView("");

    threeRef.current.targetCameraPos = new THREE.Vector3(...hotspot.cameraPos);
    threeRef.current.targetControlsTarget = new THREE.Vector3(...hotspot.cameraTarget);
  };

  const resetView = () => {
    setCameraView("360");
  };

  return (
    <div
      ref={containerRef}
      className={`group relative h-full w-full select-none overflow-hidden rounded-2xl border border-border/80 bg-gradient-to-b from-deep/70 via-abyss to-black/90 shadow-2xl transition-all duration-500 ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none border-0" : ""
      }`}
    >
      {/* Visual underwater ambient glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, var(--live, #06b6d4) 15%, transparent 70%)`,
        }}
      />
      <div className="caustics pointer-events-none absolute inset-0 opacity-40" />

      {/* Loading overlay */}
      {loading && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4 bg-abyss/90 backdrop-blur-md">
          <img
            src={heroPhoto}
            alt="Guppy preview"
            className="absolute inset-0 h-full w-full object-cover opacity-25 blur-lg"
          />
          <div className="relative flex flex-col items-center gap-3">
            <div className="relative h-14 w-14">
              <div className="absolute inset-0 animate-ping rounded-full bg-live/20" />
              <div className="relative h-full w-full animate-spin rounded-full border-2 border-live/30 border-t-live" />
            </div>
            <p className="eyebrow relative text-xs tracking-wider">Cargando Guppy 3D interactivo</p>
            <span className="font-mono text-xs text-muted-foreground">
              {loadProgress}% procesado
            </span>
          </div>
        </div>
      )}

      {/* Canvas WebGL */}
      <canvas
        ref={canvasRef}
        className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
      />

      {/* Top Header HUD */}
      <div className="pointer-events-none absolute inset-x-3 top-3 z-20 flex items-center justify-between gap-2 sm:inset-x-4 sm:top-4">
        <div className="glass pointer-events-auto flex items-center gap-2 rounded-full px-3 py-1 sm:gap-2.5 sm:px-3.5 sm:py-1.5 shadow-lg backdrop-blur-md">
          <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-live opacity-75" />
            <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-live" />
          </span>
          <span className="font-display text-xs sm:text-sm tracking-wide text-foreground">
            Poecilia reticulata
          </span>
          <span className="rounded bg-muted/60 px-1.5 py-0.5 font-mono text-[9px] sm:text-[10px] text-muted-foreground">
            {fps} FPS
          </span>
        </div>

        {/* View presets */}
        <div className="glass pointer-events-auto hidden items-center gap-1 rounded-full p-1 md:flex shadow-lg backdrop-blur-md">
          {[
            { id: "360", label: "Normal", icon: Compass },
            { id: "flank", label: "Lateral" },
            { id: "head", label: "Cabeza" },
            { id: "tail", label: "Cola Delta" },
            { id: "top", label: "Cenital" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setCameraView(v.id)}
              className={`rounded-full px-2.5 py-1 text-xs font-medium transition-all ${
                activeCameraView === v.id
                  ? "bg-live text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Action icons */}
        <div className="glass pointer-events-auto flex items-center gap-1 rounded-full p-1 shadow-lg backdrop-blur-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
            onClick={resetView}
            title="Restablecer posición normal"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 rounded-full text-muted-foreground hover:text-foreground"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? (
              <Minimize2 className="h-3.5 w-3.5" />
            ) : (
              <Maximize2 className="h-3.5 w-3.5" />
            )}
          </Button>
        </div>
      </div>

      {/* Interactive 3D Anatomy Pins */}
      {showHotspots &&
        !loading &&
        HOTSPOTS.map((h) => {
          const coord = screenCoords[h.id];
          if (!coord || !coord.visible) return null;
          const isSelected = activeHotspot?.id === h.id;

          return (
            <div
              key={h.id}
              style={{
                left: `${coord.x}px`,
                top: `${coord.y}px`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute z-10 transition-transform duration-100 hover:scale-125"
            >
              <button
                onClick={() => handleSelectHotspot(h)}
                className={`group relative flex h-6 w-6 items-center justify-center rounded-full transition-all ${
                  isSelected
                    ? "bg-live text-primary-foreground ring-4 ring-live/30 scale-125 shadow-[0_0_15px_var(--live)]"
                    : "glass border border-white/30 text-white hover:border-live"
                }`}
                aria-label={`Ver detalles de ${h.name}`}
              >
                <span className="h-2 w-2 rounded-full bg-current" />
                <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-md bg-abyss/90 px-2 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-md sm:group-hover:inline-block">
                  {h.name}
                </span>
              </button>
            </div>
          );
        })}

      {/* Hotspot detail popup card */}
      {activeHotspot && (
        <div className="glass absolute bottom-20 left-4 right-4 z-20 mx-auto max-w-sm rounded-2xl p-4 shadow-2xl backdrop-blur-xl transition-all sm:left-4 sm:right-auto">
          <div className="flex items-start justify-between gap-3">
            <div>
              <span className="eyebrow text-[10px] text-live">{activeHotspot.subtitle}</span>
              <h4 className="mt-0.5 font-display text-xl leading-tight text-foreground">
                {activeHotspot.name}
              </h4>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="rounded-full p-1 text-muted-foreground hover:bg-white/10 hover:text-foreground"
            >
              ✕
            </button>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
            {activeHotspot.description}
          </p>
          <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-live/10 p-2 text-[11px] text-live">
            <Info className="h-3.5 w-3.5 shrink-0" />
            <span>{activeHotspot.fact}</span>
          </div>
        </div>
      )}

      {/* Bottom Floating Control Bar */}
      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-20 flex items-center justify-between gap-2 sm:inset-x-4 sm:bottom-4">
        {/* Variety color palette pills */}
        <div className="glass pointer-events-auto flex items-center gap-1 sm:gap-1.5 overflow-x-auto rounded-full px-2 py-1 sm:px-2.5 sm:py-1.5 shadow-lg backdrop-blur-md">
          <span className="mr-0.5 text-[10px] text-muted-foreground hidden lg:inline">Tinte:</span>
          {varieties.slice(0, 6).map((v) => (
            <button
              key={v.id}
              onClick={() => {
                aquariumAudio.playBubblePlop(520);
                onSelectVariety?.(v);
              }}
              title={`Variedad ${v.name}`}
              className={`relative h-5 w-5 sm:h-6 sm:w-6 rounded-full transition-all hover:scale-115 ${
                activeVarietyId === v.id
                  ? "ring-2 ring-white scale-110 shadow-md"
                  : "opacity-75 hover:opacity-100"
              }`}
              style={{ background: v.color }}
            />
          ))}
        </div>

        {/* Interaction toggles */}
        <div className="glass pointer-events-auto flex items-center gap-1 rounded-full p-1 shadow-lg backdrop-blur-md">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSwimming(!isSwimming)}
            className={`h-7 rounded-full px-2 sm:px-2.5 text-xs font-medium gap-1.5 ${
              isSwimming ? "text-live" : "text-muted-foreground"
            }`}
            title={isSwimming ? "Pausar nado" : "Activar nado"}
          >
            {isSwimming ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
            <span className="hidden sm:inline">{isSwimming ? "Nado activo" : "Pausado"}</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowHotspots(!showHotspots)}
            className={`h-7 rounded-full px-2 sm:px-2.5 text-xs font-medium gap-1.5 ${
              showHotspots ? "text-live" : "text-muted-foreground"
            }`}
            title="Mostrar/ocultar puntos anatómicos"
          >
            {showHotspots ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
            <span className="hidden sm:inline">Puntos</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsWireframe(!isWireframe)}
            className={`h-7 rounded-full px-2 sm:px-2.5 text-xs font-medium gap-1.5 ${
              isWireframe ? "text-live bg-live/15" : "text-muted-foreground"
            }`}
            title="Ver topología de malla 3D"
          >
            <Layers className="h-3 w-3" />
            <span className="hidden sm:inline">Malla</span>
          </Button>
        </div>
      </div>

      {/* Drag & Orbit gesture indicator */}
      <div className="pointer-events-none absolute bottom-16 right-4 hidden items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 font-mono text-[10px] text-muted-foreground/80 backdrop-blur-md sm:flex">
        <span>Arrastra para rotar 360° · Rueda para zoom</span>
      </div>
    </div>
  );
}
