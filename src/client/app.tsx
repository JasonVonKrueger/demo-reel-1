import React, { useMemo, useState } from 'react'
import './app.css'

type RowValue = string | number

type DataRow = Record<string, RowValue>

type Column = {
  key: string
  label: string
}

type Panel = {
  id: string
  label: string
  description: string
  accent: string
  columns: Column[]
  rows: DataRow[]
}

type SortState = {
  column: string
  direction: 'asc' | 'desc'
}

const panels: Panel[] = [
  {
    id: 'syslog',
    label: 'Syslog',
    description: 'Operational logging across nodes, applications, and priorities.',
    accent: 'Critical logs need the fastest path to action.',
    columns: [
      { key: 'timestamp', label: 'Timestamp' },
      { key: 'severity', label: 'Severity' },
      { key: 'source', label: 'Source' },
      { key: 'node', label: 'Node' },
      { key: 'message', label: 'Message' },
    ],
    rows: [
      {
        timestamp: '2026-08-19 20:48:11',
        severity: 'Critical',
        source: 'auth-service',
        node: 'app-01',
        message: 'JWT validation failures exceeded threshold',
      },
      {
        timestamp: '2026-08-19 20:43:57',
        severity: 'Warning',
        source: 'cache-cluster',
        node: 'edge-04',
        message: 'Eviction rate trending above baseline',
      },
      {
        timestamp: '2026-08-19 20:39:10',
        severity: 'Info',
        source: 'scheduler',
        node: 'worker-03',
        message: 'Nightly reconciliation completed successfully',
      },
      {
        timestamp: '2026-08-19 20:31:44',
        severity: 'Error',
        source: 'integration-api',
        node: 'api-02',
        message: 'Webhook retries paused after repeated 502 responses',
      },
    ],
  },
  {
    id: 'ecc-queue',
    label: 'ECC Queue',
    description: 'Queue health, throughput, and payload movement through workers.',
    accent: 'Queue bottlenecks surface before downstream SLAs slip.',
    columns: [
      { key: 'agent', label: 'Agent' },
      { key: 'topic', label: 'Topic' },
      { key: 'state', label: 'State' },
      { key: 'priority', label: 'Priority' },
      { key: 'created', label: 'Created' },
      { key: 'payloadSize', label: 'Payload Size (KB)' },
    ],
    rows: [
      {
        agent: 'mid-west-01',
        topic: 'DiscoverySensor',
        state: 'Ready',
        priority: 1,
        created: '2026-08-19 20:50:02',
        payloadSize: 84,
      },
      {
        agent: 'mid-east-02',
        topic: 'Orchestration',
        state: 'Processing',
        priority: 2,
        created: '2026-08-19 20:45:18',
        payloadSize: 143,
      },
      {
        agent: 'mid-central-07',
        topic: 'EventProbe',
        state: 'Error',
        priority: 1,
        created: '2026-08-19 20:36:40',
        payloadSize: 56,
      },
      {
        agent: 'mid-remote-03',
        topic: 'ScriptAction',
        state: 'Ready',
        priority: 3,
        created: '2026-08-19 20:29:11',
        payloadSize: 31,
      },
    ],
  },
  {
    id: 'events',
    label: 'Events',
    description: 'Event visibility for routing, ownership, and remediation timing.',
    accent: 'High-volume event streams stay readable with fast sorting.',
    columns: [
      { key: 'eventName', label: 'Event Name' },
      { key: 'state', label: 'State' },
      { key: 'source', label: 'Source' },
      { key: 'owner', label: 'Owner' },
      { key: 'firedAt', label: 'Fired At' },
      { key: 'ageMinutes', label: 'Age (min)' },
    ],
    rows: [
      {
        eventName: 'incident.priority.changed',
        state: 'Open',
        source: 'incident-engine',
        owner: 'Automation',
        firedAt: '2026-08-19 20:51:22',
        ageMinutes: 7,
      },
      {
        eventName: 'security.login.anomaly',
        state: 'Investigating',
        source: 'security-ops',
        owner: 'SOC Team',
        firedAt: '2026-08-19 20:41:07',
        ageMinutes: 17,
      },
      {
        eventName: 'db.replica.lag',
        state: 'Resolved',
        source: 'database-monitor',
        owner: 'DBA',
        firedAt: '2026-08-19 20:34:33',
        ageMinutes: 24,
      },
      {
        eventName: 'partner.feed.timeout',
        state: 'Open',
        source: 'integration-api',
        owner: 'Platform Team',
        firedAt: '2026-08-19 20:26:14',
        ageMinutes: 32,
      },
    ],
  },
  {
    id: 'emails',
    label: 'Emails',
    description: 'Messaging delivery status, templates, and audience coverage.',
    accent: 'Campaign delivery and operational email drift are visible at a glance.',
    columns: [
      { key: 'subject', label: 'Subject' },
      { key: 'type', label: 'Type' },
      { key: 'recipient', label: 'Recipient' },
      { key: 'status', label: 'Status' },
      { key: 'queuedAt', label: 'Queued At' },
      { key: 'attempts', label: 'Attempts' },
    ],
    rows: [
      {
        subject: 'Weekly Ops Summary',
        type: 'Digest',
        recipient: 'operations@company.com',
        status: 'Sent',
        queuedAt: '2026-08-19 20:49:08',
        attempts: 1,
      },
      {
        subject: 'Password Reset Requested',
        type: 'Transactional',
        recipient: 'jane.doe@company.com',
        status: 'Delivered',
        queuedAt: '2026-08-19 20:42:51',
        attempts: 1,
      },
      {
        subject: 'MID Server Health Alert',
        type: 'Alert',
        recipient: 'infra-oncall@company.com',
        status: 'Deferred',
        queuedAt: '2026-08-19 20:38:19',
        attempts: 2,
      },
      {
        subject: 'Change Approval Reminder',
        type: 'Workflow',
        recipient: 'cab-members@company.com',
        status: 'Queued',
        queuedAt: '2026-08-19 20:25:47',
        attempts: 1,
      },
    ],
  },
]

const collator = new Intl.Collator(undefined, {
  numeric: true,
  sensitivity: 'base',
})

const totalRecords = panels.reduce((count, panel) => count + panel.rows.length, 0)
const totalColumns = panels.reduce((count, panel) => count + panel.columns.length, 0)
const actionItems = panels.reduce(
  (count, panel) =>
    count +
    panel.rows.filter((row) =>
      Object.values(row).some((value) =>
        ['Critical', 'Error', 'Deferred', 'Investigating', 'Open'].includes(String(value)),
      ),
    ).length,
  0,
)

export function App() {
  const [activePanelId, setActivePanelId] = useState(panels[0].id)
  const [sortState, setSortState] = useState<SortState>({
    column: panels[0].columns[0].key,
    direction: 'asc',
  })

  const activePanel = panels.find((panel) => panel.id === activePanelId) ?? panels[0]

  const sortedRows = useMemo(() => {
    return [...activePanel.rows].sort((left, right) => {
      const leftValue = left[sortState.column]
      const rightValue = right[sortState.column]

      if (typeof leftValue === 'number' && typeof rightValue === 'number') {
        return sortState.direction === 'asc' ? leftValue - rightValue : rightValue - leftValue
      }

      const comparison = collator.compare(String(leftValue), String(rightValue))
      return sortState.direction === 'asc' ? comparison : -comparison
    })
  }, [activePanel.rows, sortState])

  const handleSort = (column: string) => {
    setSortState((current) => ({
      column,
      direction:
        current.column === column && current.direction === 'asc'
          ? 'desc'
          : 'asc',
    }))
  }

  const handlePanelChange = (panel: Panel) => {
    setActivePanelId(panel.id)
    setSortState({
      column: panel.columns[0].key,
      direction: 'asc',
    })
  }

  return (
    <div className="dashboard-shell">
      <header className="hero-panel">
        <div>
          <p className="eyebrow">React + TypeScript monitoring workspace</p>
          <h1>Operations signal center</h1>
          <p className="hero-copy">
            A modern viewer for syslog, ECC queue, events, and email records with fast,
            field-level sorting on every column.
          </p>
        </div>
        <div className="hero-accent-card">
          <span>Live modules</span>
          <strong>{panels.length}</strong>
          <p>Purpose-built list views for monitoring and triage.</p>
        </div>
      </header>

      <section className="stats-grid" aria-label="Dashboard summary">
        <article className="stat-card">
          <span className="stat-label">Records loaded</span>
          <strong>{totalRecords}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Sortable fields</span>
          <strong>{totalColumns}</strong>
        </article>
        <article className="stat-card">
          <span className="stat-label">Action items</span>
          <strong>{actionItems}</strong>
        </article>
      </section>

      <section className="workspace-card">
        <div className="tab-row" role="tablist" aria-label="Monitoring modules">
          {panels.map((panel) => {
            const isActive = panel.id === activePanel.id
            return (
              <button
                key={panel.id}
                type="button"
                className={`tab-button ${isActive ? 'active' : ''}`}
                onClick={() => handlePanelChange(panel)}
                role="tab"
                aria-selected={isActive}
              >
                <span>{panel.label}</span>
                <small>{panel.rows.length} records</small>
              </button>
            )
          })}
        </div>

        <div className="panel-header">
          <div>
            <p className="panel-kicker">Now viewing</p>
            <h2>{activePanel.label}</h2>
            <p className="panel-description">{activePanel.description}</p>
          </div>
          <div className="panel-note">
            <span className="pill">All columns sortable</span>
            <p>{activePanel.accent}</p>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                {activePanel.columns.map((column) => {
                  const isSorted = sortState.column === column.key
                  const direction = isSorted && sortState.direction === 'asc' ? '↑' : '↓'
                  return (
                    <th key={column.key} scope="col">
                      <button
                        type="button"
                        className="sort-button"
                        onClick={() => handleSort(column.key)}
                      >
                        <span>{column.label}</span>
                        <span className={`sort-indicator ${isSorted ? 'active' : ''}`}>
                          {isSorted ? direction : '↕'}
                        </span>
                      </button>
                    </th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              {sortedRows.map((row, index) => (
                <tr key={`${activePanel.id}-${index}`}>
                  {activePanel.columns.map((column) => (
                    <td key={column.key}>{row[column.key]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

