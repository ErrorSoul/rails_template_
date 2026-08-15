import { createRoot } from 'react-dom/client'
import '../styles/tma.css'
import { TmaApp } from '../components/tma/TmaApp'

const el = document.getElementById('tma-root')
if (el) createRoot(el).render(<TmaApp />)
