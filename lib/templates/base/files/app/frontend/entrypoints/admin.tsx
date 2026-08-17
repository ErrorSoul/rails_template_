import { createRoot, type Root } from 'react-dom/client'
import '../styles/admin.css'
import { AdminBoot } from '../components/admin/AdminBoot'

// Turbo Drive подменяет <body> целиком, а модули из <head> повторно не выполняются:
// смонтируй остров только при загрузке — и после первого же перехода по сайдбару он
// останется пустым. Отсюда пара turbo:load / turbo:before-render. Снимать обязательно:
// иначе React продолжит держать ссылки на выброшенное дерево.
let root: Root | null = null

const mount = () => {
  const el = document.getElementById('admin-react-root')
  if (!el || root) return
  root = createRoot(el)
  root.render(<AdminBoot />)
}

const unmount = () => {
  root?.unmount()
  root = null
}

mount()
document.addEventListener('turbo:load', mount)
document.addEventListener('turbo:before-render', unmount)
