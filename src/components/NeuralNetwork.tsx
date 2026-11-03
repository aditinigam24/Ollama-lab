import { Component, useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PRIMARY = new THREE.Color('#B6FF4A')
const SECONDARY = new THREE.Color('#00D68F')

/** Deterministic pseudo-random so the brain looks the same every load */
function mulberry32(seed: number) {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Soft round sprite so points render as glowing dots instead of squares */
function makeDot() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')!
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.35, 'rgba(255,255,255,0.9)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}

function Brain() {
  const dot = useMemo(makeDot, [])
  const group = useRef<THREE.Group>(null)
  const pulsePoints = useRef<THREE.Points>(null)
  const field = useRef<THREE.Points>(null)

  const { nodePositions, nodeColors, linePositions, edges, nodes } = useMemo(() => {
    const rand = mulberry32(42)
    const nodes: THREE.Vector3[] = []
    const N = 90
    // two slightly offset ellipsoid lobes -> a rough "brain" silhouette
    for (let i = 0; i < N; i++) {
      const lobe = i % 2 === 0 ? -0.38 : 0.38
      const u = rand()
      const v = rand()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      const r = 0.75 + rand() * 0.25
      nodes.push(
        new THREE.Vector3(
          lobe + r * 0.85 * Math.sin(phi) * Math.cos(theta),
          r * 0.95 * Math.cos(phi) * 0.9,
          r * 1.1 * Math.sin(phi) * Math.sin(theta),
        ),
      )
    }
    const edges: [number, number][] = []
    const lines: number[] = []
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        if (nodes[i].distanceTo(nodes[j]) < 0.62 && edges.length < 260) {
          edges.push([i, j])
          lines.push(nodes[i].x, nodes[i].y, nodes[i].z, nodes[j].x, nodes[j].y, nodes[j].z)
        }
      }
    }
    const nodePositions = new Float32Array(nodes.flatMap((n) => [n.x, n.y, n.z]))
    const nodeColors = new Float32Array(
      nodes.flatMap((_, i) => {
        const c = PRIMARY.clone().lerp(SECONDARY, (i % 7) / 7)
        return [c.r, c.g, c.b]
      }),
    )
    return { nodePositions, nodeColors, linePositions: new Float32Array(lines), edges, nodes }
  }, [])

  const pulses = useMemo(() => {
    const rand = mulberry32(7)
    return Array.from({ length: 18 }, () => ({
      edge: Math.floor(rand() * edges.length),
      t: rand(),
      speed: 0.25 + rand() * 0.45,
    }))
  }, [edges])
  const pulseBuffer = useMemo(() => new Float32Array(pulses.length * 3), [pulses])

  const fieldPositions = useMemo(() => {
    const rand = mulberry32(99)
    const arr = new Float32Array(700 * 3)
    for (let i = 0; i < 700; i++) {
      const r = 2.2 + rand() * 3.2
      const th = rand() * Math.PI * 2
      const ph = Math.acos(2 * rand() - 1)
      arr[i * 3] = r * Math.sin(ph) * Math.cos(th)
      arr[i * 3 + 1] = r * Math.cos(ph) * 0.7
      arr[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    const g = group.current
    if (g) {
      g.rotation.y += delta * 0.16
      // gentle interactive tilt toward the pointer
      g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * -0.35, 0.05)
      g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.25, 0.05)
    }
    if (field.current) {
      field.current.rotation.y -= delta * 0.03
      field.current.rotation.x = THREE.MathUtils.lerp(field.current.rotation.x, state.pointer.y * 0.12, 0.03)
    }
    // move pulses along edges
    pulses.forEach((p, i) => {
      p.t += delta * p.speed
      if (p.t >= 1) {
        p.t = 0
        p.edge = Math.floor(Math.random() * edges.length)
      }
      const [a, b] = edges[p.edge]
      pulseBuffer[i * 3] = THREE.MathUtils.lerp(nodes[a].x, nodes[b].x, p.t)
      pulseBuffer[i * 3 + 1] = THREE.MathUtils.lerp(nodes[a].y, nodes[b].y, p.t)
      pulseBuffer[i * 3 + 2] = THREE.MathUtils.lerp(nodes[a].z, nodes[b].z, p.t)
    })
    const attr = pulsePoints.current?.geometry.getAttribute('position') as THREE.BufferAttribute | undefined
    if (attr) attr.needsUpdate = true
  })

  return (
    <>
      <group ref={group} scale={1.9}>
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
          </bufferGeometry>
          <lineBasicMaterial color="#00D68F" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
        </lineSegments>

        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[nodePositions, 3]} />
            <bufferAttribute attach="attributes-color" args={[nodeColors, 3]} />
          </bufferGeometry>
          <pointsMaterial map={dot} alphaTest={0.02} size={0.09} vertexColors transparent opacity={0.95} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>

        <points ref={pulsePoints}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[pulseBuffer, 3]} />
          </bufferGeometry>
          <pointsMaterial map={dot} alphaTest={0.02} size={0.16} color="#F5FFD9" transparent opacity={0.95} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
        </points>
      </group>

      <points ref={field}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[fieldPositions, 3]} />
        </bufferGeometry>
        <pointsMaterial map={dot} alphaTest={0.02} size={0.04} color="#B6FF4A" transparent opacity={0.45} sizeAttenuation depthWrite={false} />
      </points>
    </>
  )
}

class CanvasBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      // graceful fallback if WebGL is unavailable
      return <div className="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(182,255,74,0.12),transparent_60%)]" />
    }
    return this.props.children
  }
}

export default function NeuralNetwork() {
  return (
    <CanvasBoundary>
      <Canvas camera={{ position: [0, 0, 6], fov: 50 }} dpr={[1, 1.75]} gl={{ alpha: true, antialias: true }} style={{ background: 'transparent' }}>
        <Brain />
      </Canvas>
    </CanvasBoundary>
  )
}
