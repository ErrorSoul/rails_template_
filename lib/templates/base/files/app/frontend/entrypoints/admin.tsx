import { createRoot } from 'react-dom/client'
import '../styles/admin.css'
import { AdminBoot } from '../components/admin/AdminBoot'

// Точка монтирования живёт в layouts/dashboard.html.erb. Пока React-остров один;
// экраны админки переезжают на ds/ отдельным шагом.
const el = document.getElementById('admin-react-root')
if (el) createRoot(el).render(<AdminBoot />)
