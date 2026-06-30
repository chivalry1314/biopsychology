<template>
  <div ref="container" class="canvas-container cursor-grab active:cursor-grabbing"></div>
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

const emit = defineEmits(['select'])
const container = ref(null)

let scene, camera, renderer, brainGroup
let brainRegionsMeshes = {}
let animationId, resizeObserver
let isDragging = false

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

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
  scene.add(ambientLight)

  const pointLight1 = new THREE.PointLight(0x06b6d4, 1.5, 100)
  pointLight1.position.set(10, 10, 10)
  scene.add(pointLight1)

  const pointLight2 = new THREE.PointLight(0x8b5cf6, 1.5, 100)
  pointLight2.position.set(-10, -10, 10)
  scene.add(pointLight2)

  brainGroup = new THREE.Group()
  scene.add(brainGroup)

  Object.values(brainRegions).forEach(region => {
    createProceduralBrainRegion(region)
  })

  createNeuralPathways()

  // Interaction
  let previousMousePosition = { x: 0, y: 0 }

  const onMouseDown = (e) => {
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

  // Touch support
  const onTouchStart = (e) => {
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

  // Raycaster for click selection
  const raycaster = new THREE.Raycaster()
  const mouse = new THREE.Vector2()

  const onClick = (e) => {
    if (isDragging) return
    const rect = el.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)
    const meshes = Object.values(brainRegionsMeshes).map(m => m.shell)
    const hits = raycaster.intersectObjects(meshes)
    if (hits.length) {
      const id = Object.keys(brainRegionsMeshes).find(key => brainRegionsMeshes[key].shell === hits[0].object)
      if (id) emit('select', id)
    }
  }

  el.addEventListener('click', onClick)

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
    if (brainGroup) {
      if (!isDragging) brainGroup.rotation.y += 0.002
      const time = Date.now() * 0.003
      Object.values(brainRegionsMeshes).forEach(meshInfo => {
        const scale = 1 + Math.sin(time + meshInfo.center.y) * 0.02
        meshInfo.group.scale.set(scale, scale, scale)
      })
    }
    renderer.render(scene, camera)
  }
  animate()

  // Initial highlight
  highlightBrainMesh(props.highlightedRegion)

  watch(() => props.highlightedRegion, (newId) => {
    if (newId && brainRegionsMeshes[newId]) {
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
    el.removeEventListener('click', onClick)
    renderer.dispose()
  })
})

function createProceduralBrainRegion(region) {
  const group = new THREE.Group()
  const count = 180
  const [rx, ry, rz] = region.size
  const center = new THREE.Vector3(...region.center)
  const baseColor = new THREE.Color(region.color)

  const positions = new Float32Array(count * 3)
  const sizes = new Float32Array(count)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const u = Math.random()
    const v = Math.random()
    const theta = u * 2.0 * Math.PI
    const phi = Math.acos(2.0 * v - 1.0)
    const r = Math.cbrt(Math.random())

    const x = r * rx * Math.sin(phi) * Math.cos(theta)
    const y = r * ry * Math.sin(phi) * Math.sin(theta)
    const z = r * rz * Math.cos(phi)

    const ridge = Math.sin(x * 4) * Math.cos(y * 4) * 0.15

    positions[i * 3] = center.x + x + ridge
    positions[i * 3 + 1] = center.y + y + ridge
    positions[i * 3 + 2] = center.z + z + ridge

    if (Math.abs(positions[i * 3]) < 0.15 && region.id !== 'brainstem') {
      positions[i * 3] += Math.sign(positions[i * 3] || (Math.random() - 0.5)) * 0.15
    }

    sizes[i] = Math.random() * 0.2 + 0.05

    colors[i * 3] = baseColor.r * (0.8 + Math.random() * 0.4)
    colors[i * 3 + 1] = baseColor.g * (0.8 + Math.random() * 0.4)
    colors[i * 3 + 2] = baseColor.b * (0.8 + Math.random() * 0.4)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  const pMaterial = new THREE.PointsMaterial({
    size: 0.25,
    vertexColors: true,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  })

  const points = new THREE.Points(geometry, pMaterial)
  group.add(points)

  const maxSize = Math.max(rx, ry, rz)
  const shellGeo = new THREE.SphereGeometry(maxSize * 0.9, 8, 8)
  shellGeo.scale(rx / maxSize, ry / maxSize, rz / maxSize)

  const shellMat = new THREE.MeshBasicMaterial({
    color: baseColor,
    wireframe: true,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending
  })
  const shellMesh = new THREE.Mesh(shellGeo, shellMat)
  shellMesh.position.copy(center)
  group.add(shellMesh)

  brainGroup.add(group)
  brainRegionsMeshes[region.id] = {
    group,
    points,
    shell: shellMesh,
    baseColor,
    center
  }
}

function createNeuralPathways() {
  const keys = Object.keys(brainRegionsMeshes)
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x60a5fa,
    transparent: true,
    opacity: 0.15,
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

function highlightBrainMesh(regionId) {
  Object.keys(brainRegionsMeshes).forEach(key => {
    const meshInfo = brainRegionsMeshes[key]
    if (key === regionId) {
      meshInfo.points.material.opacity = 1.0
      meshInfo.points.material.size = 0.45
      meshInfo.shell.material.opacity = 0.45
    } else {
      meshInfo.points.material.opacity = 0.25
      meshInfo.points.material.size = 0.15
      meshInfo.shell.material.opacity = 0.05
    }
  })
}
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 300px;
}
</style>
