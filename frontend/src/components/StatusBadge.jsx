const statusColors = {
  AVAILABLE: 'bg-green-100 text-green-800',
  ASSIGNED: 'bg-blue-100 text-blue-800',
  IN_REPAIR: 'bg-yellow-100 text-yellow-800',
  IN_MAINTENANCE: 'bg-orange-100 text-orange-800',
  RETIRED: 'bg-gray-100 text-gray-800',
  LOST: 'bg-red-100 text-red-800',
  DISPOSED: 'bg-slate-100 text-slate-800',
}

export default function StatusBadge({ status }) {
  const color = statusColors[status] || 'bg-gray-100 text-gray-800'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}>
      {status?.replace('_', ' ')}
    </span>
  )
}
