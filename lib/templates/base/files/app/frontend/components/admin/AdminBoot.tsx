import { Badge } from '../../ds/components/atoms/Badge'

// Минимальный остров: доказывает, что сборка жива и вендоренные ds-компоненты
// импортируются и рендерятся. Экраны админки приезжают сюда следующим шагом.
export function AdminBoot() {
  return <Badge variant="success">ds</Badge>
}
