import { useEffect, useState } from 'react'
import api from '../services/api'
import {
  Package, Users, Wrench, AlertTriangle, Activity
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'

// Design tokens ported from the Asset Ledger dark theme
const COLORS = {
  bg: '#0B0F14',
  panel: '#121822',
  panelAlt: '#182130',
  border: '#26313F',
  text: '#E7ECF3',
  textDim: '#8B96A6',
  textFaint: '#5C6779',
  accent: '#22E6AC',
  accentDim: '#15A67D',
  accentGlow: 'rgba(34,230,172,0.14)',
  warn: '#F5A93E',
  warnGlow: 'rgba(245,169,62,0.14)',
  danger: '#F16368',
  dangerGlow: 'rgba(241,99,104,0.14)',
  info: '#5B93FF',
  infoGlow: 'rgba(91,147,255,0.14)',
}

const PIE_COLORS = [COLORS.accent, COLORS.info, COLORS.warn, COLORS.danger, '#8b5cf6', COLORS.textDim]

const fontFamily = "'Inter', sans-serif"
const displayFont = "'Space Grotesk', sans-serif"
const monoFont = "'JetBrains Mono', monospace"

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/').then((res) => {
      setData(res.data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div
        className="flex flex-col items-center justify-center gap-3"
        style={{ minHeight: '60vh', color: COLORS.textDim, fontFamily: monoFont, fontSize: 12 }}
      >
        <div
          style={{
            width: 22, height: 22, borderRadius: '50%',
            border: `2px solid ${COLORS.border}`, borderTopColor: COLORS.accent,
            animation: 'spin .7s linear infinite'
          }}
        />
        <span>LOADING DASHBOARD…</span>
        <style>{`@keyframes spin{to{transform:rotate(360deg);}}`}</style>
      </div>
    )
  }

  const stats = data.stats
  const statusData = Object.entries(data.assets_by_status).map(([name, value]) => ({ name, value }))
  const categoryData = data.assets_by_category

  return (
    <div style={{ fontFamily, color: COLORS.text }} className="space-y-6">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&display=swap"
        rel="stylesheet"
      />

      <div>
        <h1 style={{ fontFamily: displayFont, fontSize: 22, fontWeight: 700, letterSpacing: '-0.01em', margin: 0 }}>
          Dashboard
        </h1>
        <p style={{ color: COLORS.textDim, fontSize: 13, margin: '4px 0 0' }}>
          Live snapshot of your IT asset fleet.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Assets" value={stats.total_assets} accent={COLORS.accent} />
        <StatCard icon={Users} label="Assigned" value={stats.assigned_assets} accent={COLORS.info} />
        <StatCard icon={Wrench} label="In Repair" value={stats.in_repair_assets} accent={COLORS.warn} />
        <StatCard
          icon={AlertTriangle}
          label="Warranty Expiring"
          value={stats.upcoming_warranty_expiry}
          accent={stats.upcoming_warranty_expiry > 0 ? COLORS.danger : COLORS.accent}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Assets by Status">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={95}
                stroke={COLORS.panel}
                strokeWidth={2}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: COLORS.panelAlt,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  color: COLORS.text,
                  fontSize: 12,
                  fontFamily,
                }}
                itemStyle={{ color: COLORS.text }}
                labelStyle={{ color: COLORS.textDim }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Panel>

        <Panel title="Assets by Category">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
              <XAxis dataKey="name" tick={{ fill: COLORS.textDim, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
              <YAxis tick={{ fill: COLORS.textDim, fontSize: 11 }} axisLine={{ stroke: COLORS.border }} tickLine={false} />
              <Tooltip
                cursor={{ fill: COLORS.panelAlt }}
                contentStyle={{
                  background: COLORS.panelAlt,
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: 8,
                  color: COLORS.text,
                  fontSize: 12,
                  fontFamily,
                }}
                itemStyle={{ color: COLORS.text }}
                labelStyle={{ color: COLORS.textDim }}
              />
              <Bar dataKey="count" fill={COLORS.accentDim} radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Panel>
      </div>

      <Panel title="Recent Activity">
        <div>
          {data.recent_activity.map((log, i) => (
            <div
              key={log.id}
              className="flex items-start gap-2.5"
              style={{
                padding: '9px 0',
                borderBottom: i === data.recent_activity.length - 1 ? 'none' : `1px solid ${COLORS.border}`,
                fontSize: 12.5,
              }}
            >
              <span
                style={{
                  width: 6, height: 6, borderRadius: '50%', background: COLORS.accent,
                  marginTop: 5, flex: '0 0 6px',
                }}
              />
              <div className="flex-1">
                <p style={{ margin: 0, color: COLORS.text }}>
                  {log.action} on {log.table_name}
                </p>
                <p style={{ margin: '2px 0 0', color: COLORS.textFaint, fontSize: 11, fontFamily: monoFont }}>
                  by {log.performed_by || 'System'} · {new Date(log.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
          {data.recent_activity.length === 0 && (
            <p style={{ color: COLORS.textFaint, fontSize: 12.5 }}>No recent activity.</p>
          )}
        </div>
      </Panel>
    </div>
  )
}

function Panel({ title, children }) {
  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: '18px 20px',
      }}
    >
      <h3 style={{ fontFamily: displayFont, fontSize: 14, margin: '0 0 14px', color: COLORS.text }}>{title}</h3>
      {children}
    </div>
  )
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div
      style={{
        background: COLORS.panel,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 10,
        padding: '16px 18px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: accent }} />
      <div className="flex items-center justify-between">
        <span
          style={{
            fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.06em',
            color: COLORS.textFaint, fontWeight: 600,
          }}
        >
          {label}
        </span>
        <Icon size={16} color={accent} strokeWidth={2} />
      </div>
      <div style={{ fontFamily: displayFont, fontSize: 28, fontWeight: 700, marginTop: 6, color: COLORS.text }}>
        {value}
      </div>
    </div>
  )
}
