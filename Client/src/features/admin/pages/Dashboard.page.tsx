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

import { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";
import {
  getAllExpos,
  getBoothApplications,
  approveBoothApplication,
  rejectBoothApplication,
  type BoothApplicationData,
  type ExpoData,
} from "../../../services/expo.service";
import { getUnreadNotificationCount } from "../../../services/notification.service";
import { useAuth } from "../../../contexts/Auth.context";
import { Icon } from "../components/Icons";
import { DashboardOverview } from "../components/DashboardOverview";
import { ExposView } from "../components/ExposView";
import { ApplicationsView } from "../components/ApplicationsView";
import { CreateExpoForm } from "../components/CreateExpoForm";
import { DraftedExposView } from "../components/DraftedExposView";
import type { DashboardPage } from "../types/admin.types";

// ─────────────────────────────────────────────
//  ROOT COMPONENT  (default export)
//
//  This is what gets imported in your router.
//  It holds the Navbar, Sidebar, and pages.
// ─────────────────────────────────────────────

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activePage, setActivePage] = useState<DashboardPage>("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [expos, setExpos] = useState<ExpoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pendingCount, setPendingCount] = useState(0);
  const [applications, setApplications] = useState<BoothApplicationData[]>([]);
  const [busyOverviewActionId, setBusyOverviewActionId] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  const loadDashboardData = async () => {
    const [exposResponse, applicationsResponse] = await Promise.all([
      getAllExpos(),
      getBoothApplications(),
    ]);

    if (exposResponse.success) {
      setExpos(exposResponse.data);
    }

    if (applicationsResponse?.success) {
      const nextApplications = applicationsResponse.data || [];
      setApplications(nextApplications);
      const pending = nextApplications.filter((a) => a.status === "pending").length;
      setPendingCount(pending);
    } else {
      setApplications([]);
      setPendingCount(0);
    }
  };

  useEffect(() => {
    let isActive = true;

    const runLoad = async () => {
      try {
        setLoading(true);
        await loadDashboardData();

        if (!isActive) return;
        setError("");
      } catch (err: any) {
        if (!isActive) return;
        setError(err?.response?.data?.message || "Failed to fetch dashboard data");
      } finally {
        if (isActive) setLoading(false);
      }
    };

    runLoad();
    const intervalId = window.setInterval(runLoad, 15000);

    const loadUnreadNotifications = async () => {
      try {
        const response = await getUnreadNotificationCount();
        if (response.success) {
          setUnreadNotifications(response.data.unreadCount || 0);
        }
      } catch {
        setUnreadNotifications(0);
      }
    };

    loadUnreadNotifications();
    const unreadIntervalId = window.setInterval(loadUnreadNotifications, 30000);

    return () => {
      isActive = false;
      window.clearInterval(intervalId);
      window.clearInterval(unreadIntervalId);
    };
  }, []);

  const fetchExpos = async () => {
    try {
      setLoading(true);
      await loadDashboardData();
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch dashboard data");
      console.error("Error fetching expos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveFromOverview = async (applicationId: string) => {
    try {
      setBusyOverviewActionId(applicationId);
      await approveBoothApplication(applicationId);
      await loadDashboardData();
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to approve application");
    } finally {
      setBusyOverviewActionId(null);
    }
  };

  const handleRejectFromOverview = async (applicationId: string) => {
    const reason = window.prompt("Optional rejection reason:") || "Application rejected by admin";
    try {
      setBusyOverviewActionId(applicationId);
      await rejectBoothApplication(applicationId, reason);
      await loadDashboardData();
      setError("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reject application");
    } finally {
      setBusyOverviewActionId(null);
    }
  };


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
          <button className="bell-btn" onClick={() => navigate("/notifications")}>
            <Icon.Bell />
            {(pendingCount > 0 || unreadNotifications > 0) && <span className="bell-dot" />}
          </button>

          {/* Profile Dropdown */}
          <div className="profile-menu">
            <button
              className="avatar"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              {user?.email?.charAt(0).toUpperCase() || "AD"}
            </button>

            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="avatar-large">
                    {user?.email?.charAt(0).toUpperCase() || "AD"}
                  </div>
                  <div>
                    <p className="user-email">{user?.email}</p>
                    <p className="user-role">{user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : "Admin"}</p>
                  </div>
                </div>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/profile");
                  }}
                >
                  <span>👤 Profile</span>
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate("/settings");
                  }}
                >
                  <span>⚙️ Settings</span>
                </button>

                <div className="dropdown-divider"></div>

                <button
                  className="dropdown-item logout-item"
                  onClick={() => {
                    logout();
                    navigate("/admin/login");
                  }}
                >
                  <span>🚪 Logout</span>
                </button>
              </div>
            )}
          </div>
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
            {isSidebarOpen && <span>All Expos</span>}
          </div>

          <div
            className={`nav-item ${activePage === "drafted-expos" ? "active" : ""}`}
            onClick={() => setActivePage("drafted-expos")}
          >
            <span className="nav-icon"><Icon.FileText /></span>
            {isSidebarOpen && <span>Drafts</span>}
          </div>

          <div
            className={`nav-item ${activePage === "create-expo" ? "active" : ""}`}
            onClick={() => setActivePage("create-expo")}
          >
            <span className="nav-icon"><Icon.Plus /></span>
            {isSidebarOpen && <span>Create Expo</span>}
          </div>

          <div
            className={`nav-item ${activePage === "applications" ? "active" : ""}`}
            onClick={() => setActivePage("applications")}
          >
            <span className="nav-icon"><Icon.Applications /></span>
            {isSidebarOpen && <span>Applications</span>}
          </div>

          <div className="sidebar-footer">
            <div
              className="nav-item"
              onClick={() => navigate("/settings")}
            >
              <span className="nav-icon"><Icon.Settings /></span>
              {isSidebarOpen && <span>Settings</span>}
            </div>
          </div>
        </aside>

        <main className="dashboard-main">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p style={{ marginTop: "16px" }}>Loading dashboard data...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p style={{ display: "inline-flex", gap: "6px", alignItems: "center" }}><AlertTriangle size={16} /> {error}</p>
              <button
                onClick={fetchExpos}
                style={{
                  marginTop: "16px",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  border: "none",
                  background: "var(--accent-blue)",
                  color: "white",
                  cursor: "pointer"
                }}
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              {activePage === "dashboard"    && (
                <DashboardOverview
                  expos={expos}
                  applications={applications}
                  onApproveApplication={handleApproveFromOverview}
                  onRejectApplication={handleRejectFromOverview}
                  busyApplicationId={busyOverviewActionId}
                />
              )}
              {activePage === "expos"        && <ExposView expos={expos} />}
              {activePage === "drafted-expos" && <DraftedExposView expos={expos} onExpoUpdated={fetchExpos} />}
              {activePage === "create-expo"  && <CreateExpoForm onExpoCreated={fetchExpos} />}
              {activePage === "applications" && <ApplicationsView />}
            </>
          )}
        </main>
      </div>
    </div>
  );
}