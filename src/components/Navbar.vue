<script setup>
// The bar across the top of every app: which app you're in (with a switcher), and who you're logged in as.
// It asks the accounts service itself, so each app only passes its own name and the accounts URL.
import { ref, computed, onMounted } from 'vue'
import Avatar from './Avatar.vue'
import Button from './Button.vue'
import { loadEmotes } from '../ttv.js'

const props = defineProps({
  app: { type: String, required: true }, // shown as the current app, e.g. "Todo"
  accountsUrl: { type: String, required: true }, // e.g. https://accounts.jackymayo.ca
})

const me = ref(null)
const apps = ref([])
const open = ref(false)
const loaded = ref(false)

const base = computed(() => props.accountsUrl.replace(/\/$/, ''))
const get = async (path) => {
  const res = await fetch(base.value + path, { credentials: 'include' })
  if (!res.ok) throw new Error(String(res.status))
  return res.json()
}
const here = () => encodeURIComponent(location.href)
const loginUrl = computed(() => `${base.value}/?next=${here()}`)

onMounted(async () => {
  try {
    me.value = (await get('/api/auth/me')).profile
    apps.value = await get('/api/apps')
    loadEmotes(base.value) // the shared emote dictionary, for headings (not awaited: pictures just appear when it arrives)
  } catch {} // logged out or accounts unreachable: show the logged-out bar
  loaded.value = true
})

async function logout() {
  try {
    await fetch(base.value + '/api/auth/logout', { method: 'POST', credentials: 'include' })
  } catch {}
  location.href = loginUrl.value
}
</script>

<template>
  <header class="relative z-30 border-b border-slate-200 bg-white text-slate-900">
    <div class="mx-auto flex min-h-12 max-w-5xl items-center justify-between gap-2 px-4">
      <div class="flex items-center gap-1">
        <a :href="base" class="text-sm font-semibold text-slate-500 hover:text-slate-800">Jacky</a>
        <span class="text-slate-300" aria-hidden="true">/</span>
        <span class="text-sm font-bold" aria-current="page">{{ app }}</span>
        <div class="relative">
          <button class="flex size-11 items-center justify-center rounded text-slate-500 hover:bg-slate-100"
            :aria-expanded="open" aria-haspopup="menu" aria-label="Switch app" @click="open = !open" @keydown.esc="open = false">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
          </button>
          <div v-if="open" class="fixed inset-0 z-10" @click="open = false"></div>
          <ul v-if="open" role="menu" class="absolute left-0 z-20 mt-1 min-w-48 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            <li role="none"><a role="menuitem" :href="base" class="block min-h-11 px-4 py-3 text-sm hover:bg-slate-50">Dashboard</a></li>
            <li v-for="a in apps" :key="a.name" role="none">
              <a role="menuitem" :href="a.links[0]" class="block min-h-11 px-4 py-3 text-sm capitalize hover:bg-slate-50"
                :class="a.name.toLowerCase() === app.toLowerCase() ? 'font-bold text-indigo-700' : ''">{{ a.name }}</a>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="loaded" class="flex items-center gap-1 text-sm">
        <template v-if="me">
          <a :href="base" class="flex min-h-11 items-center gap-2 rounded px-2 hover:bg-slate-100">
            <Avatar :profile="me" :size="28" /><span class="max-w-32 truncate">{{ me.name }}</span>
          </a>
          <Button icon="ttv:donowall" :size="22" class="min-h-11 rounded px-3 text-indigo-700 hover:bg-indigo-50" @click="logout">Log out</Button>
        </template>
        <Button v-else :href="loginUrl" class="min-h-11 rounded px-3 font-semibold text-indigo-700 hover:bg-indigo-50">Log in</Button>
      </div>
    </div>
  </header>
</template>
