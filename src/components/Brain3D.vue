<template>
  <div ref="container" class="canvas-container"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'
import { brainRegions } from '../data/brainRegions.js'

const emit = defineEmits(['select'])
const container = ref(null)

let scene, camera, renderer, spheres = []
let animationId, resizeObserver
let isDragging = false
let hovered = null
const mouse = new THREE.Vector2()

onMounted(() => {
  const el = container.value
  const width = el.clientWidth
  const height = el.clientHeight

  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
  camera.position.set(0, 0, 7)

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  el.appendChild(renderer.domElement)

  const ambient = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambient)
  const dir = new THREE.DirectionalLight(0xffffff, 0.8)
  dir.position.set(5, 5, 5)
  scene.add(dir)
  const backLight = new THREE.DirectionalLight(0x4f46e5, 0.3)
  backLight.position.set(-5, 0, -5)
  scene.add(backLight)

  // Brain outline
  const brainGeo = new THREE.SphereGeometry(2.2, 48, 48)
  const brainMat = new THREE.MeshPhongMaterial({
    color: 0x1e293b,
    transparent: true,
    opacity: 0.2,
    shininess: 60
  })
  const brain = new THREE.Mesh(brainGeo, brainMat)
  scene.add(brain)

  // Region markers
  brainRegions.forEach(r => {
    const geo = new THREE.SphereGeometry(0.26, 24, 24)
    const mat = new THREE.MeshPhongMaterial({
      color: r.color,
      emissive: r.color,
      emissiveIntensity: 0.2
    })
    const mesh = new THREE.Mesh(geo, mat)
    mesh.position.set(...r.pos)
    mesh.userData = r
    scene.add(mesh)
    spheres.push(mesh)
  })

  const raycaster = new THREE.Raycaster()

  const updateMouse = (e) => {
    const rect = el.getBoundingClientRect()
    mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1
  }

  const onClick = () => {
    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(spheres)
    if (hits.length) {
      emit('select', hits[0].object.userData)
    }
  }

  let startX, startY
  const onMouseDown = (e) => {
    isDragging = true
    startX = e.clientX
    startY = e.clientY
  }
  const onMouseUp = () => { isDragging = false }
  const onMouseMove = (e) => {
    updateMouse(e)
    if (isDragging) {
      scene.rotation.y += (e.clientX - startX) * 0.005
      scene.rotation.x += (e.clientY - startY) * 0.005
      startX = e.clientX
      startY = e.clientY
    }
  }

  el.addEventListener('click', onClick)
  el.addEventListener('mousedown', onMouseDown)
  window.addEventListener('mouseup', onMouseUp)
  window.addEventListener('mousemove', onMouseMove)

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
    if (!isDragging) {
      scene.rotation.y += 0.0015
    }
    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(spheres)
    if (hovered && (!hits.length || hits[0].object !== hovered)) {
      hovered.scale.set(1, 1, 1)
      hovered = null
      el.style.cursor = 'default'
    }
    if (hits.length) {
      const obj = hits[0].object
      if (obj !== hovered) {
        hovered = obj
        obj.scale.set(1.25, 1.25, 1.25)
        el.style.cursor = 'pointer'
      }
    }
    renderer.render(scene, camera)
  }
  animate()

  onUnmounted(() => {
    cancelAnimationFrame(animationId)
    resizeObserver.disconnect()
    el.removeEventListener('click', onClick)
    el.removeEventListener('mousedown', onMouseDown)
    window.removeEventListener('mouseup', onMouseUp)
    window.removeEventListener('mousemove', onMouseMove)
    renderer.dispose()
    spheres.forEach(s => {
      s.geometry.dispose()
      s.material.dispose()
    })
  })
})
</script>

<style scoped>
.canvas-container {
  position: relative;
  width: 100%;
  height: 560px;
  border-radius: 1.25rem;
  overflow: hidden;
  background: #05060c;
}
</style>
