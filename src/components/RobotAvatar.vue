<template>
  <div class="robot-avatar" :style="{ width: size + 'px', height: size + 'px' }">
    <svg :width="size" :height="size" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- Antenna -->
      <line x1="60" y1="8" x2="60" y2="20" stroke="#888" stroke-width="3" stroke-linecap="round"/>
      <circle cx="60" cy="6" r="5" fill="#6ec6f5"/>

      <!-- Head -->
      <rect x="22" y="20" width="76" height="58" rx="18" fill="#2a2a3a"/>
      <rect x="24" y="22" width="72" height="54" rx="16" fill="#3a3a50"/>

      <!-- Eyes -->
      <circle cx="44" cy="46" r="11" fill="#111827"/>
      <circle cx="44" cy="46" r="8" fill="#0d47a1"/>
      <circle cx="44" cy="46" r="5" fill="#1976d2"/>
      <circle cx="41" cy="43" r="2" fill="white" opacity="0.7"/>

      <circle cx="76" cy="46" r="11" fill="#111827"/>
      <circle cx="76" cy="46" r="8" fill="#0d47a1"/>
      <circle cx="76" cy="46" r="5" fill="#1976d2"/>
      <circle cx="73" cy="43" r="2" fill="white" opacity="0.7"/>

      <!-- Mouth -->
      <rect x="40" y="64" width="40" height="6" rx="3" fill="#111827"/>
      <rect x="44" y="65" width="8" height="4" rx="2" fill="#6ec6f5"/>
      <rect x="56" y="65" width="8" height="4" rx="2" fill="#6ec6f5"/>
      <rect x="68" y="65" width="8" height="4" rx="2" fill="#6ec6f5"/>

      <!-- Ears / side details -->
      <rect x="12" y="34" width="10" height="20" rx="5" fill="#2a2a3a"/>
      <rect x="98" y="34" width="10" height="20" rx="5" fill="#2a2a3a"/>

      <!-- Neck -->
      <rect x="50" y="78" width="20" height="10" rx="4" fill="#2a2a3a"/>

      <!-- Body -->
      <rect x="28" y="88" width="64" height="26" rx="12" fill="#2a2a3a"/>
      <rect x="34" y="93" width="52" height="16" rx="8" fill="#3a3a50"/>
      <circle cx="52" cy="101" r="4" fill="#1976d2"/>
      <circle cx="68" cy="101" r="4" fill="#6ec6f5"/>
    </svg>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  size?: number
}>(), {
  size: 100
})
</script>

<style scoped>
.robot-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>

