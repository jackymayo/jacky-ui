// Event types and their calendar colors (full class names, so Tailwind picks them up).
export const DEFAULT_TYPE = 'General'

export const colors = {
  General: {
    dot: 'bg-indigo-400',
    unselected: 'z-10 border-indigo-300 bg-indigo-100 hover:bg-indigo-200',
    selected: 'z-30 border-indigo-600 bg-indigo-200 ring-2 ring-indigo-500',
  },
  Commute: {
    dot: 'bg-green-400',
    unselected: 'z-10 border-green-300 bg-green-100 hover:bg-green-200',
    selected: 'z-30 border-green-600 bg-green-200 ring-2 ring-green-500',
  },
  Stay: {
    dot: 'bg-yellow-400',
    unselected: 'z-10 border-yellow-300 bg-yellow-100 hover:bg-yellow-200',
    selected: 'z-30 border-yellow-600 bg-yellow-200 ring-2 ring-yellow-500',
  },
}
