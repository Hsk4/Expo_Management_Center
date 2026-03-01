// =====================================================
//  EventSphere — Admin Dashboard
//  File  : src/features/admin/pages/Dashboard.page.tsx
//  Styles: src/features/admin/pages/dashboard.css
//
//  NOTE: No "import React" needed here because
//  tsconfig.app.json already has "jsx": "react-jsx"
//  which handles React automatically.
// =====================================================



/// IF there is error after pulling run this command : npm install --save-dev @types/react @types/react-dom vite



import { useState } from "react";
import "./dashboard.css"


// ─────────────────────────────────────────────
//  TYPESCRIPT INTERFACES
//
//  An interface defines the shape of an object.
//  TypeScript will warn you if data doesn't match.
// ─────────────────────────────────────────────

interface Expo {
  id: number
  name: string
  category: string
  status: "ongoing" | "completed" | "upcoming"
  date: string
  location: string
  attendees: number
  exhibitors: number
}

interface Application {
  id: number
  name: string
  email: string
  company: string
  role: "exhibitor" | "attendee"
  expo: string
  appliedOn: string
  status: "pending" | "approved" | "rejected"
}


// ─────────────────────────────────────────────
//  MOCK DATA
//
//  Replace with real API calls later:
//    useEffect(() => { fetch('/api/expos').then(...) }, [])
// ─────────────────────────────────────────────

const expos: Expo[] = [
  { id: 1, name: "TechWorld Summit 2025", category: "Technology",   status: "ongoing",   date: "Mar 01, 2025", location: "Karachi Expo Centre",      attendees: 1240, exhibitors: 87  },
  { id: 2, name: "BuildCon Expo 2025",    category: "Construction", status: "ongoing",   date: "Mar 05, 2025", location: "Lahore Expo Hall",          attendees: 980,  exhibitors: 65  },
  { id: 3, name: "HealthFest 2024",       category: "Healthcare",   status: "completed", date: "Nov 15, 2024", location: "Islamabad Convention Ctr",  attendees: 3200, exhibitors: 142 },
  { id: 4, name: "EduSummit 2024",        category: "Education",    status: "completed", date: "Sep 22, 2024", location: "Karachi Arts Council",      attendees: 2100, exhibitors: 98  },
  { id: 5, name: "AgriExpo 2024",         category: "Agriculture",  status: "completed", date: "Jul 10, 2024", location: "Multan Exhibition Grounds", attendees: 1750, exhibitors: 77  },
  { id: 6, name: "GreenFuture 2025",      category: "Environment",  status: "upcoming",  date: "May 20, 2025", location: "Faisalabad Expo Park",      attendees: 0,    exhibitors: 0   },
]

const applications: Application[] = [
  { id: 1, name: "Raza Ahmed",      email: "raza@techco.pk",      company: "TechCo Pakistan", role: "exhibitor", expo: "TechWorld Summit 2025", appliedOn: "Feb 20, 2025", status: "pending"  },
  { id: 2, name: "Sara Khan",        email: "sara.k@gmail.com",    company: "",                role: "attendee",  expo: "TechWorld Summit 2025", appliedOn: "Feb 21, 2025", status: "approved" },
  { id: 3, name: "Innovatech Ltd",   email: "info@innovatech.com", company: "Innovatech Ltd",  role: "exhibitor", expo: "BuildCon Expo 2025",    appliedOn: "Feb 22, 2025", status: "pending"  },
  { id: 4, name: "Ali Mirza",        email: "ali.m@mail.com",      company: "",                role: "attendee",  expo: "BuildCon Expo 2025",    appliedOn: "Feb 23, 2025", status: "rejected" },
  { id: 5, name: "FutureBuild Co.", email: "fb@future.io",         company: "FutureBuild Co.", role: "exhibitor", expo: "GreenFuture 2025",      appliedOn: "Feb 25, 2025", status: "pending"  },
  { id: 6, name: "Zara Noor",        email: "zara.n@uni.edu.pk",   company: "",                role: "attendee",  expo: "GreenFuture 2025",      appliedOn: "Feb 26, 2025", status: "approved" },
]


// ─────────────────────────────────────────────
//  SVG ICONS
//
//  Tiny components, each returns one SVG shape.
//  Usage: <Icon.Bell />
// ─────────────────────────────────────────────

const Icon = {
  Dashboard: () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="14" y="14" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Expos: () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
      <polyline points="9,22 9,12 15,12 15,22"/>
    </svg>
  ),
  Applications: () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/>
      <rect x="8" y="2" width="8" height="4" rx="1"/>
    </svg>
  ),
  Settings: () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  Menu: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <line x1="3" y1="6" x2="21" y2="6"/>
      <line x1="3" y1="12" x2="21" y2="12"/>
      <line x1="3" y1="18" x2="21" y2="18"/>
    </svg>
  ),
  Bell: () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  Search: () => (
    <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Users: () => (
    <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
      <path d="M16 3.13a4 4 0 010 7.75"/>
    </svg>
  ),
  TrendUp: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="23,6 13.5,15.5 8.5,10.5 1,18"/>
    </svg>
  ),
  Check: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20,6 9,17 4,12"/>
    </svg>
  ),
  X: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  ),
  Calendar: () => (
    <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  ),
}


// ─────────────────────────────────────────────
//  DASHBOARD PAGE
// ─────────────────────────────────────────────

function DashboardPage() {

  const ongoingCount    = expos.filter(e => e.status === "ongoing").length
  const completedCount  = expos.filter(e => e.status === "completed").length
  const totalAttendees  = expos.reduce((total, e) => total + e.attendees, 0)
  const totalExhibitors = expos.reduce((total, e) => total + e.exhibitors, 0)
  const pendingApplications = applications.filter(a => a.status === "pending")

  const exposWithData = expos.filter(e => e.attendees > 0)
  const maxAttendees  = Math.max(...exposWithData.map(e => e.attendees))
  const maxExhibitors = Math.max(...exposWithData.map(e => e.exhibitors))

  return (
    <div>

      <div className="page-header">
        <h1 className="page-title">Control Centre</h1>
        <p className="page-subtitle">Everything happening across EventSphere — live.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="stat-grid">

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Ongoing Expos</span>
            <div className="stat-icon-box"><Icon.Expos /></div>
          </div>
          <div className="stat-number">{ongoingCount}</div>
          <div className="stat-trend"><Icon.TrendUp /> Live right now</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Completed Expos</span>
            <div className="stat-icon-box"><Icon.Dashboard /></div>
          </div>
          <div className="stat-number">{completedCount}</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Total Attendees</span>
            <div className="stat-icon-box"><Icon.Users /></div>
          </div>
          <div className="stat-number">{totalAttendees.toLocaleString()}</div>
          <div className="stat-trend"><Icon.TrendUp /> Across all expos</div>
        </div>

        <div className="stat-card">
          <div className="stat-card-top">
            <span className="stat-label">Total Exhibitors</span>
            <div className="stat-icon-box"><Icon.Applications /></div>
          </div>
          <div className="stat-number">{totalExhibitors.toLocaleString()}</div>
        </div>

      </div>

      {/* ── Bar Charts ── */}
      <div className="two-col">

        <div className="glass-panel">
          <p className="panel-label">Attendees per Expo</p>
          <div className="bar-chart">
            {exposWithData.map(expo => (
              <div key={expo.id} className="bar-col">
                <span className="bar-top-label">{expo.attendees.toLocaleString()}</span>
                <div className="bar" style={{ height: `${(expo.attendees / maxAttendees) * 72}px` }} />
                <span className="bar-bottom-label">{expo.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel">
          <p className="panel-label">Exhibitors per Expo</p>
          <div className="bar-chart">
            {exposWithData.map(expo => (
              <div key={expo.id} className="bar-col">
                <span className="bar-top-label">{expo.exhibitors}</span>
                <div className="bar" style={{ height: `${(expo.exhibitors / maxExhibitors) * 72}px` }} />
                <span className="bar-bottom-label">{expo.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ── Pending Applications Table ── */}
      <div className="glass-panel">

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <p className="panel-label" style={{ marginBottom: 0 }}>Pending Applications</p>
          <span className="badge badge-pending">{pendingApplications.length} awaiting</span>
        </div>

        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Role</th>
                <th>Expo</th>
                <th>Applied On</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingApplications.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="cell-name">{app.name}</div>
                    <div className="cell-email">{app.email}</div>
                  </td>
                  <td><span className={`badge badge-${app.role}`}>{app.role}</span></td>
                  <td><span className="cell-soft">{app.expo}</span></td>
                  <td><span className="cell-date"><Icon.Calendar /> {app.appliedOn}</span></td>
                  <td>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button className="btn-approve"><Icon.Check /> Approve</button>
                      <button className="btn-reject"><Icon.X /> Reject</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  )
}


// ─────────────────────────────────────────────
//  EXPOS PAGE
// ─────────────────────────────────────────────

function ExposPage() {

  const ongoingCount   = expos.filter(e => e.status === "ongoing").length
  const completedCount = expos.filter(e => e.status === "completed").length
  const upcomingCount  = expos.filter(e => e.status === "upcoming").length

  return (
    <div>

      <div className="page-header">
        <h1 className="page-title">All Expos</h1>
        <p className="page-subtitle">Browse every expo registered on the platform.</p>
      </div>

      <div style={{ display: "flex", gap: "10px", marginBottom: "24px" }}>
        <span className="badge badge-ongoing">{ongoingCount} Ongoing</span>
        <span className="badge badge-completed">{completedCount} Completed</span>
        <span className="badge badge-upcoming">{upcomingCount} Upcoming</span>
      </div>

      <div className="glass-panel">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Expo Name</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Location</th>
                <th>Attendees</th>
                <th>Exhibitors</th>
              </tr>
            </thead>
            <tbody>
              {expos.map(expo => (
                <tr key={expo.id}>
                  <td><span className="cell-strong">{expo.name}</span></td>
                  <td><span className="cell-dim">{expo.category}</span></td>
                  <td><span className={`badge badge-${expo.status}`}>{expo.status}</span></td>
                  <td><span className="cell-date"><Icon.Calendar /> {expo.date}</span></td>
                  <td><span className="cell-dim">{expo.location}</span></td>
                  <td><span className="cell-number">{expo.attendees > 0 ? expo.attendees.toLocaleString() : "—"}</span></td>
                  <td><span className="cell-number">{expo.exhibitors > 0 ? expo.exhibitors.toLocaleString() : "—"}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}


// ─────────────────────────────────────────────
//  APPLICATIONS PAGE
// ─────────────────────────────────────────────

function ApplicationsPage() {

  const [filter, setFilter] = useState<"all" | "exhibitor" | "attendee">("all")

  let visibleApps = applications
  if (filter === "exhibitor") visibleApps = applications.filter(a => a.role === "exhibitor")
  if (filter === "attendee")  visibleApps = applications.filter(a => a.role === "attendee")

  return (
    <div>

      <div className="page-header">
        <h1 className="page-title">Applications</h1>
        <p className="page-subtitle">Review and manage exhibitor & attendee applications.</p>
      </div>

      <div className="filter-row">
        <button className={`filter-btn ${filter === "all"       ? "active" : ""}`} onClick={() => setFilter("all")}>All</button>
        <button className={`filter-btn ${filter === "exhibitor" ? "active" : ""}`} onClick={() => setFilter("exhibitor")}>Exhibitors</button>
        <button className={`filter-btn ${filter === "attendee"  ? "active" : ""}`} onClick={() => setFilter("attendee")}>Attendees</button>
      </div>

      <div className="glass-panel">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Applicant</th>
                <th>Company</th>
                <th>Role</th>
                <th>Expo</th>
                <th>Applied On</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleApps.map(app => (
                <tr key={app.id}>
                  <td>
                    <div className="cell-name">{app.name}</div>
                    <div className="cell-email">{app.email}</div>
                  </td>
                  <td><span className="cell-dim">{app.company || "—"}</span></td>
                  <td><span className={`badge badge-${app.role}`}>{app.role}</span></td>
                  <td><span className="cell-soft">{app.expo}</span></td>
                  <td><span className="cell-date"><Icon.Calendar /> {app.appliedOn}</span></td>
                  <td><span className={`badge badge-${app.status}`}>{app.status}</span></td>
                  <td>
                    {app.status === "pending" ? (
                      <div style={{ display: "flex", gap: "6px" }}>
                        <button className="btn-approve"><Icon.Check /> Approve</button>
                        <button className="btn-reject"><Icon.X /> Reject</button>
                      </div>
                    ) : (
                      <span className="cell-dim">— resolved —</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}


// ─────────────────────────────────────────────
//  ROOT COMPONENT  (default export)
//
//  This is what gets imported in your router.
//  It holds the Navbar, Sidebar, and pages.
// ─────────────────────────────────────────────

export default function AdminDashboardPage() {

  const [activePage, setActivePage]       = useState<"dashboard" | "expos" | "applications">("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const pendingCount = applications.filter(a => a.status === "pending").length

  return (
    <div className="dashboard-root">

      {/* ── NAVBAR ── */}
      <header className="navbar">

        <div className="navbar-left">
          <button className="menu-btn" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <Icon.Menu />
          </button>
          <div className="logo">
            <div className="logo-dot" />
            <span className="logo-text">EVENT<span>SPHERE</span></span>
            <span className="logo-tag">ADMIN</span>
          </div>
        </div>

        <div className="navbar-right">
          <div className="search-box">
            <Icon.Search />
            <input placeholder="Search expos, people…" />
          </div>
          <button className="bell-btn">
            <Icon.Bell />
            {pendingCount > 0 && <span className="bell-dot" />}
          </button>
          <div className="avatar">AD</div>
        </div>

      </header>

      {/* ── BODY (sidebar + main) ── */}
      <div className="dashboard-body">

        <aside className={`sidebar ${isSidebarOpen ? "" : "closed"}`}>

          <div
            className={`nav-item ${activePage === "dashboard" ? "active" : ""}`}
            onClick={() => setActivePage("dashboard")}
          >
            <span className="nav-icon"><Icon.Dashboard /></span>
            {isSidebarOpen && <span>Dashboard</span>}
          </div>

          <div
            className={`nav-item ${activePage === "expos" ? "active" : ""}`}
            onClick={() => setActivePage("expos")}
          >
            <span className="nav-icon"><Icon.Expos /></span>
            {isSidebarOpen && <span>Expos</span>}
          </div>

          <div
            className={`nav-item ${activePage === "applications" ? "active" : ""}`}
            onClick={() => setActivePage("applications")}
          >
            <span className="nav-icon"><Icon.Applications /></span>
            {isSidebarOpen && <span>Applications</span>}
          </div>

          <div className="sidebar-footer">
            <div className="nav-item">
              <span className="nav-icon"><Icon.Settings /></span>
              {isSidebarOpen && <span>Settings</span>}
            </div>
          </div>

        </aside>

        <main className="dashboard-main">
          {activePage === "dashboard"    && <DashboardPage    />}
          {activePage === "expos"        && <ExposPage        />}
          {activePage === "applications" && <ApplicationsPage />}
        </main>

      </div>
    </div>
  )
}