<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import * as LucideIcons from 'lucide-vue-next'

const { theme, site } = useData()

const logoConfig = computed(() => theme.value.nlddocLogo)
const baseUrl = computed(() => site.value.base || '/')

// Determine logo type and icon
const logoType = computed(() => {
  if (!logoConfig.value) return null
  
  // If it's a string
  if (typeof logoConfig.value === 'string') {
    // Check for lucide: prefix
    if (logoConfig.value.startsWith('lucide:')) {
      return 'lucide'
    }
    // Otherwise it's a file path
    return 'file'
  }
  
  // If it's an object with type property
  if (typeof logoConfig.value === 'object' && logoConfig.value.type) {
    return logoConfig.value.type
  }
  
  return null
})

const iconName = computed(() => {
  if (logoType.value !== 'lucide') return null
  
  if (typeof logoConfig.value === 'string') {
    // Extract icon name from "lucide:icon-name"
    return logoConfig.value.replace('lucide:', '')
  }
  
  if (typeof logoConfig.value === 'object') {
    return logoConfig.value.icon
  }
  
  return null
})

const iconComponent = computed(() => {
  if (!iconName.value) return null
  
  // Convert kebab-case to PascalCase (e.g., "book-open" -> "BookOpen")
  const pascalCase = iconName.value
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('')
  
  return LucideIcons[pascalCase] || null
})

const logoText = computed(() => {
  if (typeof logoConfig.value === 'object' && logoConfig.value.text) {
    return logoConfig.value.text
  }
  return null
})

const iconColor = computed(() => {
  if (typeof logoConfig.value === 'object' && logoConfig.value.color) {
    return logoConfig.value.color
  }
  return null
})

const logoPath = computed(() => {
  if (logoType.value !== 'file') return null
  
  const path = typeof logoConfig.value === 'string' 
    ? logoConfig.value 
    : logoConfig.value.path
  
  // If path starts with ./ or is relative, prepend base URL
  if (path && !path.startsWith('http') && !path.startsWith('/')) {
    return baseUrl.value + path.replace(/^\.\//, '')
  }
  
  // If path starts with /, prepend base URL (unless base is /)
  if (path && path.startsWith('/') && baseUrl.value !== '/') {
    return baseUrl.value.replace(/\/$/, '') + path
  }
  
  return path
})
</script>

<template>
  <div v-if="logoType" class="nlddoc-logo">
    <!-- Lucide icon logo -->
    <component 
      v-if="logoType === 'lucide' && iconComponent" 
      :is="iconComponent"
      :size="24"
      :color="iconColor"
      class="logo-icon"
      :style="iconColor ? {} : undefined"
    />
    
    <!-- File-based logo -->
    <img 
      v-else-if="logoType === 'file' && logoPath"
      :src="logoPath"
      class="logo-image"
      alt="Logo"
    />
    
    <!-- Optional text next to icon -->
    <span v-if="logoText" class="logo-text">{{ logoText }}</span>
  </div>
</template>

<style scoped>
.nlddoc-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 0.5rem;
}

.logo-icon {
  flex-shrink: 0;
}

.logo-icon:not([color]) {
  color: var(--vp-c-brand-1);
}

.logo-image {
  height: 24px;
  flex-shrink: 0;
}

.logo-text {
  font-weight: 600;
  font-size: 1rem;
  color: var(--vp-c-text-1);
}
</style>
