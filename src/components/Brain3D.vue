<template>
  <div ref="container" class="canvas-container cursor-grab active:cursor-grabbing">
    <!-- Visualization controls -->
    <div class="viz-controls pointer-events-auto">
      <button
        class="control-toggle"
        @click="controlsOpen = !controlsOpen"
      >
        <i class="fa-solid fa-sliders"></i>
        <span>显示调节</span>
      </button>

      <div v-show="controlsOpen" class="control-panel">
        <div class="control-row">
          <label>点大小</label>
          <input v-model.number="pointSize" type="range" min="0.05" max="0.25" step="0.005" />
          <span class="value">{{ pointSize.toFixed(3) }}</span>
        </div>
        <div class="control-row">
          <label>点亮度</label>
          <input v-model.number="pointOpacity" type="range" min="0.3" max="1" step="0.05" />
          <span class="value">{{ pointOpacity.toFixed(2) }}</span>
        </div>
        <div class="control-row">
          <label>背光</label>
          <input v-model.number="backLightOpacity" type="range" min="0" max="0.6" step="0.02" />
          <span class="value">{{ backLightOpacity.toFixed(2) }}</span>
        </div>
        <div class="control-row">
          <label>轮廓光</label>
          <input v-model.number="shellOpacity" type="range" min="0" max="0.8" step="0.02" />
          <span class="value">{{ shellOpacity.toFixed(2) }}</span>
        </div>
        <div class="control-row">
          <label>自动旋转</label>
          <input v-model.number="rotationSpeed" type="range" min="0" max="0.005" step="0.0002" />
          <span class="value">{{ rotationSpeed.toFixed(4) }}</span>
        </div>
        <button class="reset-btn" @click="resetControls">
          <i class="fa-solid fa-rotate-left"></i> 重置
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import * as THREE from 'three'
import { brainRegions } from '../data/brainRegions.js'

const props = defineProps({
  highlightedRegion: {
    type: String,
    default: 'frontal'
  }
})

const container = ref(null)

let scene, camera, renderer, brainGroup
let brainRegionsMeshes = {}
let animationId, resizeObserver
let isDragging = false
let signalParticles = []
let signalRings = []
let isLoaded = false

// Shared visual elements
let backLightMesh = null
let shellPoints = null
let pointCloudMaterials = []

// Controls
const controlsOpen = ref(false)
const pointSize = ref(0.12)
const pointOpacity = ref(0.9)
const backLightOpacity = ref(0.22)
const shellOpacity = ref(0.35)
const rotationSpeed = ref(0.0012)

const DEFAULT_POINT_COLOR = new THREE.Color(0xffffff)
const DIMMED_POINT_COLOR = new THREE.Color(0x94a3b8)

const MODEL_SCALE = 0.055
const MODEL_URL = '/models/brain_vertex_low.obj'

function createPointTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 64
  canvas.height = 64
  const ctx = canvas.getContext('2d')
  const gradient = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)')
  gradient.addColorStop(0.35, 'rgba(255, 255, 255, 0.5)')
  gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)')
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, 64, 64)
  const texture = new THREE.CanvasTexture(canvas)
  texture.needsUpdate = true
  return texture
}

function resetControls() {
  pointSize.value = 0.12
  pointOpacity.value = 0.9
  backLightOpacity.value = 0.22
  shellOpacity.value = 0.35
  rotationSpeed.value = 0.0012
}

onMounted(() => {
  const el = container.value
  const width = el.clientWidth
  const height = el.clientHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000)
  camera.position.z = 22

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  el.appendChild(renderer.domElement)

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
  scene.add(ambientLight)

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.7)
  keyLight.position.set(10, 15, 12)
  scene.add(keyLight)

  const rimLight = new THREE.PointLight(0x06b6d4, 0.9, 100)
  rimLight.position.set(0, 5, -12)
  scene.add(rimLight)

  // Soft backlight sphere behind the brain
  const backLightGeo = new THREE.SphereGeometry(7, 32, 32)
  const backLightMat = new THREE.MeshBasicMaterial({
    color: 0x1e293b,
    transparent: true,
    opacity: backLightOpacity.value,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
  })
  backLightMesh = new THREE.Mesh(backLightGeo, backLightMat)
  backLightMesh.position.set(0, 0, -2)
  scene.add(backLightMesh)

  brainGroup = new THREE.Group()
  scene.add(brainGroup)

  createInternalFiberCore()
  loadBrainModel()

  // Interaction
  let previousMousePosition = { x: 0, y: 0 }

  const onMouseDown = (e) => {
    // Don't trigger drag when clicking controls
    if (e.target.closest('.viz-controls')) return
    isDragging = true
    previousMousePosition = { x: e.clientX, y: e.clientY }
  }

  const onMouseMove = (e) => {
    if (!isDragging) return
    const deltaMove = {
      x: e.clientX - previousMousePosition.x,
      y: e.clientY - previousMousePosition.y
    }
    brainGroup.rotation.y += deltaMove.x * 0.005
    brainGroup.rotation.x += deltaMove.y * 0.005
    previousMousePosition = { x: e.clientX, y: e.clientY }
  }

  const onMouseUp = () => { isDragging = false }

  el.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', onMouseUp)

  const onTouchStart = (e) => {
    if (e.target.closest('.viz-controls')) return
    isDragging = true
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchMove = (e) => {
    if (!isDragging) return
    const deltaMove = {
      x: e.touches[0].clientX - previousMousePosition.x,
      y: e.touches[0].clientY - previousMousePosition.y
    }
    brainGroup.rotation.y += deltaMove.x * 0.008
    brainGroup.rotation.x += deltaMove.y * 0.008
    previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  const onTouchEnd = () => { isDragging = false }

  el.addEventListener('touchstart', onTouchStart, { passive: true })
  el.addEventListener('touchmove', onTouchMove, { passive: true })
  el.addEventListener('touchend', onTouchEnd)

  resizeObserver = new ResizeObserver(() => {
    const w = el.clientWidth
    const h = el.clientHeight
    camera.aspect = w / h
    camera.updateProjectionMatrix()
    renderer.setSize(w, h)
  })
  resizeObserver.observe(el)

  const animate = () => {
    animationId = requestAnimationFrame(animate)
    const time = Date.now() * 0.001

    if (brainGroup) {
      if (!isDragging) brainGroup.rotation.y += rotationSpeed.value

      Object.values(brainRegionsMeshes).forEach(meshInfo => {
        const scale = 1 + Math.sin(time * 1.2 + meshInfo.center.y) * 0.004
        meshInfo.group.scale.set(scale, scale, scale)
      })
    }

    updateSignalParticles(time)
    renderer.render(scene, camera)
  }
  animate()

  // Watch control changes and apply to scene
  watch(pointSize, (v) => {
    pointCloudMaterials.forEach(mat => { mat.size = v })
  })

  watch(pointOpacity, (v) => {
    pointCloudMaterials.forEach(mat => { mat.opacity = v })
  })

  watch(backLightOpacity, (v) => {
    if (backLightMesh) backLightMesh.material.opacity = v
  })

  watch(shellOpacity, (v) => {
    if (shellPoints) shellPoints.material.opacity = v
  })

  watch(() => props.highlightedRegion, (newId) => {
    if (isLoaded && newId && brainRegionsMeshes[newId]) {
      highlightBrainMesh(newId)
    }
  })

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    resizeObserver.disconnect()
    el.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
    el.removeEventListener('touchstart', onTouchStart)
    el.removeEventListener('touchmove', onTouchMove)
    el.removeEventListener('touchend', onTouchEnd)
    renderer.dispose()
  })
})

// ---------------------------------------------------------------------------
// Load real brain model and convert to region point clouds
// ---------------------------------------------------------------------------

async function loadBrainModel() {
  try {
    const response = await fetch(MODEL_URL)
    if (!response.ok) {
      throw new Error(`Failed to load ${MODEL_URL}: ${response.status}`)
    }
    const text = await response.text()

    const rawVertices = []
    text.split('\n').forEach(line => {
      if (line.startsWith('v ')) {
        const parts = line.trim().split(/\s+/)
        rawVertices.push(new THREE.Vector3(
          parseFloat(parts[1]),
          parseFloat(parts[2]),
          parseFloat(parts[3])
        ))
      }
    })

    if (rawVertices.length === 0) {
      console.warn('Brain model loaded but no vertices found')
      return
    }

    buildPointCloudsFromVertices(rawVertices)
    createBrainShellFromVertices(rawVertices)
    createNeuralPathways()
    createSignalParticles()

    isLoaded = true
    highlightBrainMesh(props.highlightedRegion)
  } catch (err) {
    console.error('Failed to load brain model:', err)
  }
}

function centerAndScaleVertices(vertices) {
  const min = new THREE.Vector3(Infinity, Infinity, Infinity)
  const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity)
  vertices.forEach(v => {
    min.min(v)
    max.max(v)
  })

  const center = new THREE.Vector3().addVectors(min, max).multiplyScalar(0.5)

  return vertices.map(v => {
    return new THREE.Vector3(
      (v.x - center.x) * MODEL_SCALE,
      (v.y - center.y) * MODEL_SCALE,
      (v.z - center.z) * MODEL_SCALE
    )
  })
}

function classifyVertex(p) {
  const rXZ = Math.sqrt(p.x * p.x + p.z * p.z)

  if (p.y < -1.8 && rXZ < 0.9) return 'brainstem'
  if (p.y < -0.4 && p.z < -1.4) return 'cerebellum'
  if (p.z < -2.0) return 'occipital'
  if (p.z > 1.3) return 'frontal'
  if (p.y > 1.0 && p.z < 0.8) return 'parietal'
  return 'temporal'
}

function buildPointCloudsFromVertices(rawVertices) {
  const vertices = centerAndScaleVertices(rawVertices)

  const regionBuckets = {}
  Object.keys(brainRegions).forEach(id => { regionBuckets[id] = [] })

  vertices.forEach(v => {
    const regionId = classifyVertex(v)
    if (regionBuckets[regionId]) {
      regionBuckets[regionId].push(v)
    }
  })

  // The source model has very few brainstem vertices, so supplement them
  const extraBrainstem = generateBrainstemPoints(350)
  regionBuckets.brainstem.push(...extraBrainstem)

  Object.values(brainRegions).forEach(region => {
    const bucket = regionBuckets[region.id] || []
    if (bucket.length === 0) {
      console.warn(`No vertices classified for region ${region.id}`)
      return
    }
    createRegionPointCloud(region, bucket)
  })

  Object.keys(regionBuckets).forEach(id => {
    const bucket = regionBuckets[id]
    if (bucket.length && brainRegionsMeshes[id]) {
      const c = new THREE.Vector3()
      bucket.forEach(v => c.add(v))
      c.divideScalar(bucket.length)
      brainRegionsMeshes[id].center.copy(c)
    }
  })
}

function createRegionPointCloud(region, vertices) {
  const group = new THREE.Group()
  const regionColor = new THREE.Color(region.color)
  const center = new THREE.Vector3(...region.center)

  const count = vertices.length
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)
  const sizes = new Float32Array(count)

  for (let i = 0; i < count; i++) {
    const v = vertices[i]
    positions[i * 3] = v.x
    positions[i * 3 + 1] = v.y
    positions[i * 3 + 2] = v.z

    colors[i * 3] = DEFAULT_POINT_COLOR.r
    colors[i * 3 + 1] = DEFAULT_POINT_COLOR.g
    colors[i * 3 + 2] = DEFAULT_POINT_COLOR.b

    sizes[i] = 0.06 + Math.random() * 0.04
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  const material = new THREE.PointsMaterial({
    size: pointSize.value,
    vertexColors: true,
    transparent: true,
    opacity: pointOpacity.value,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    depthWrite: false,
    map: createPointTexture(),
    alphaTest: 0.01
  })
  pointCloudMaterials.push(material)

  const pointCloud = new THREE.Points(geometry, material)
  pointCloud.userData.regionId = region.id
  group.add(pointCloud)

  brainGroup.add(group)
  brainRegionsMeshes[region.id] = {
    group,
    pointCloud,
    baseColor: regionColor,
    center
  }
}

function generateBrainstemPoints(count) {
  const points = []
  // Brainstem: a slightly tapered vertical column beneath the cerebrum
  const topY = -1.9
  const bottomY = -4.2
  const topRadius = 0.55
  const bottomRadius = 0.32
  const centerZ = -0.4
  const centerX = 0

  for (let i = 0; i < count; i++) {
    const t = Math.random()
    const y = topY + t * (bottomY - topY)
    const radius = topRadius + t * (bottomRadius - topRadius)

    const angle = Math.random() * Math.PI * 2
    const r = Math.sqrt(Math.random()) * radius

    const x = centerX + Math.cos(angle) * r
    const z = centerZ + Math.sin(angle) * r

    // Add slight organic noise
    const nx = (Math.random() - 0.5) * 0.08
    const ny = (Math.random() - 0.5) * 0.08
    const nz = (Math.random() - 0.5) * 0.08

    points.push(new THREE.Vector3(x + nx, y + ny, z + nz))
  }
  return points
}

function createBrainShellFromVertices(rawVertices) {
  const vertices = centerAndScaleVertices(rawVertices)

  const count = Math.min(vertices.length, 4000)
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    const v = vertices[Math.floor(Math.random() * vertices.length)]
    const dir = v.clone().normalize()
    const p = v.clone().addScaledVector(dir, 0.15)
    positions[i * 3] = p.x
    positions[i * 3 + 1] = p.y
    positions[i * 3 + 2] = p.z
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  const material = new THREE.PointsMaterial({
    color: 0xcbd5e1,
    size: 0.08,
    transparent: true,
    opacity: shellOpacity.value,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
    depthWrite: false,
    map: createPointTexture(),
    alphaTest: 0.01
  })

  shellPoints = new THREE.Points(geometry, material)
  shellPoints.scale.setScalar(1.02)
  brainGroup.add(shellPoints)
}

// ---------------------------------------------------------------------------
// Fibers and pathways
// ---------------------------------------------------------------------------

function createInternalFiberCore() {
  const fiberCount = 60
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffeebb,
    transparent: true,
    opacity: 0.14,
    blending: THREE.AdditiveBlending
  })

  for (let i = 0; i < fiberCount; i++) {
    const points = []
    const t = (i / fiberCount) * Math.PI * 2
    const radius = 0.8 + Math.random() * 2.0
    const phase = Math.random() * Math.PI * 2

    for (let j = 0; j <= 40; j++) {
      const s = (j / 40) * Math.PI - Math.PI / 2
      const x = Math.cos(t + s * 0.7) * radius * Math.cos(s)
      const y = Math.sin(t + s * 0.7) * radius * Math.cos(s) * 0.5 + 0.5
      const z = Math.sin(s) * 4.2 + Math.sin(s * 2.5 + phase) * 0.6
      points.push(new THREE.Vector3(x, y, z))
    }

    const curve = new THREE.CatmullRomCurve3(points)
    const curvePoints = curve.getPoints(50)
    const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
    const line = new THREE.Line(geometry, lineMaterial)
    brainGroup.add(line)
  }

  const glowGeo = new THREE.CylinderGeometry(0.28, 0.2, 5.5, 12, 1, true)
  const glowMat = new THREE.MeshBasicMaterial({
    color: 0x06b6d4,
    transparent: true,
    opacity: 0.07,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
  })
  const glowColumn = new THREE.Mesh(glowGeo, glowMat)
  glowColumn.position.set(0, -2.5, -0.5)
  glowColumn.rotation.x = 0.12
  brainGroup.add(glowColumn)
}

function createNeuralPathways() {
  const keys = Object.keys(brainRegionsMeshes)
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.07,
    blending: THREE.AdditiveBlending
  })

  for (let i = 0; i < keys.length; i++) {
    for (let j = i + 1; j < keys.length; j++) {
      const start = brainRegionsMeshes[keys[i]].center
      const end = brainRegionsMeshes[keys[j]].center

      const curve = new THREE.QuadraticBezierCurve3(
        start,
        new THREE.Vector3(
          (start.x + end.x) / 2 + (Math.random() - 0.5) * 2,
          (start.y + end.y) / 2 + 2,
          (start.z + end.z) / 2
        ),
        end
      )

      const curvePoints = curve.getPoints(12)
      const geometry = new THREE.BufferGeometry().setFromPoints(curvePoints)
      const line = new THREE.Line(geometry, lineMaterial)
      brainGroup.add(line)
    }
  }
}

// ---------------------------------------------------------------------------
// Signal particles
// ---------------------------------------------------------------------------

function createSignalParticles() {
  const keys = Object.keys(brainRegionsMeshes)
  if (keys.length === 0) return

  const signalCount = 30

  for (let i = 0; i < signalCount; i++) {
    const startKey = keys[Math.floor(Math.random() * keys.length)]
    let endKey = keys[Math.floor(Math.random() * keys.length)]
    let safety = 0
    while (endKey === startKey && safety < 100) {
      endKey = keys[Math.floor(Math.random() * keys.length)]
      safety++
    }
    if (endKey === startKey) continue

    const start = brainRegionsMeshes[startKey].center.clone()
    const end = brainRegionsMeshes[endKey].center.clone()
    const mid = new THREE.Vector3(
      (start.x + end.x) / 2 + (Math.random() - 0.5) * 3,
      (start.y + end.y) / 2 + (Math.random() - 0.5) * 3,
      (start.z + end.z) / 2 + (Math.random() - 0.5) * 3
    )

    const curve = new THREE.QuadraticBezierCurve3(start, mid, end)
    const geometry = new THREE.SphereGeometry(0.05, 6, 6)
    const color = new THREE.Color(brainRegions[startKey].color)
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    })
    const mesh = new THREE.Mesh(geometry, material)

    signalParticles.push({
      mesh,
      curve,
      progress: Math.random(),
      speed: 0.003 + Math.random() * 0.005,
      baseColor: color
    })

    brainGroup.add(mesh)
  }

  keys.forEach(key => {
    const center = brainRegionsMeshes[key].center
    const ringGeo = new THREE.RingGeometry(0.5, 0.55, 32)
    const ringMat = new THREE.MeshBasicMaterial({
      color: brainRegions[key].color,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    })
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.position.copy(center)
    ring.lookAt(camera.position)
    ring.userData.regionId = key
    signalRings.push({ mesh: ring, phase: Math.random() * Math.PI * 2 })
    brainGroup.add(ring)
  })
}

function updateSignalParticles(time) {
  signalParticles.forEach(p => {
    p.progress += p.speed
    if (p.progress > 1) p.progress = 0

    const pos = p.curve.getPoint(p.progress)
    p.mesh.position.copy(pos)

    const scale = 1 + Math.sin(time * 8 + p.progress * Math.PI * 2) * 0.4
    p.mesh.scale.setScalar(scale)
  })

  signalRings.forEach((ring) => {
    const isActive = ring.mesh.userData.regionId === props.highlightedRegion
    const baseOpacity = isActive ? 0.3 : 0.02
    const pulse = Math.sin(time * 2 + ring.phase) * 0.12
    ring.mesh.material.opacity = Math.max(0, baseOpacity + pulse)

    const scale = 1 + (time * 0.3 + ring.phase) % 2
    ring.mesh.scale.setScalar(scale)
    ring.mesh.lookAt(camera.position)
  })
}

// ---------------------------------------------------------------------------
// Highlighting
// ---------------------------------------------------------------------------

function highlightBrainMesh(regionId) {
  Object.keys(brainRegionsMeshes).forEach(key => {
    const meshInfo = brainRegionsMeshes[key]
    const colors = meshInfo.pointCloud.geometry.attributes.color.array
    const sizes = meshInfo.pointCloud.geometry.attributes.size.array
    const count = meshInfo.pointCloud.geometry.attributes.position.count

    if (key === regionId) {
      for (let i = 0; i < count; i++) {
        colors[i * 3] = meshInfo.baseColor.r
        colors[i * 3 + 1] = meshInfo.baseColor.g
        colors[i * 3 + 2] = meshInfo.baseColor.b
        sizes[i] = Math.min(0.2, sizes[i] * 1.6)
      }
      meshInfo.pointCloud.material.opacity = pointOpacity.value
      meshInfo.pointCloud.material.size = pointSize.value * 1.25
    } else {
      for (let i = 0; i < count; i++) {
        colors[i * 3] = DIMMED_POINT_COLOR.r
        colors[i * 3 + 1] = DIMMED_POINT_COLOR.g
        colors[i * 3 + 2] = DIMMED_POINT_COLOR.b
        sizes[i] = Math.max(0.04, sizes[i] * 0.75)
      }
      meshInfo.pointCloud.material.opacity = pointOpacity.value * 0.35
      meshInfo.pointCloud.material.size = pointSize.value * 0.7
    }

    meshInfo.pointCloud.geometry.attributes.color.needsUpdate = true
    meshInfo.pointCloud.geometry.attributes.size.needsUpdate = true
  })
}
</script>

<style scoped>
.canvas-container {
  position: absolute;
  inset: 0;
  cursor: grab;
}
.canvas-container:active {
  cursor: grabbing;
}

.viz-controls {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 20;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: 'Share Tech Mono', 'Noto Sans SC', monospace;
}

.control-toggle {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 12px;
  background: rgba(15, 23, 42, 0.85);
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: 6px;
  color: #38bdf8;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  backdrop-filter: blur(6px);
  transition: all 0.2s;
  width: fit-content;
}
.control-toggle:hover {
  background: rgba(15, 23, 42, 0.95);
  border-color: rgba(56, 189, 248, 0.7);
}

.control-panel {
  width: 220px;
  padding: 12px;
  background: rgba(15, 23, 42, 0.9);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: 8px;
  backdrop-filter: blur(8px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
}

.control-row {
  display: grid;
  grid-template-columns: 56px 1fr 38px;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.control-row:last-of-type {
  margin-bottom: 0;
}
.control-row label {
  color: #94a3b8;
  font-size: 10px;
  font-weight: 600;
}
.control-row input[type="range"] {
  width: 100%;
  height: 4px;
  background: rgba(148, 163, 184, 0.25);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}
.control-row input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: #38bdf8;
  border-radius: 50%;
  cursor: pointer;
}
.control-row input[type="range"]::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: #38bdf8;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
.control-row .value {
  color: #38bdf8;
  font-size: 10px;
  text-align: right;
}

.reset-btn {
  width: 100%;
  margin-top: 10px;
  padding: 5px 0;
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  border-radius: 4px;
  color: #38bdf8;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}
.reset-btn:hover {
  background: rgba(56, 189, 248, 0.25);
}
</style>
