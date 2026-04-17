import { useState, useCallback } from "react";
import { AppStateManager } from "./store/appState";

// Layout Components
import ToastContainer from "./components/layout/ToastContainer";

// Pages
import LandingPage from "./pages/LandingPage";
import OnboardingPage from "./pages/OnboardingPage";
import AuthPage from "./pages/AuthPage";
import DashboardPage from "./pages/DashboardPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";
import ClaimsPage from "./pages/ClaimsPage";
import TriggersPage from "./pages/TriggersPage";
import AnalysisLoaderPage from "./pages/AnalysisLoaderPage";
import RiskResultPage from "./pages/RiskResultPage";
import PlanSelectionPage from "./pages/PlanSelectionPage";
import PaymentPage from "./pages/PaymentPage";

// Legacy Pages
import RiskPageLegacy from "./pages/RiskPageLegacy";
import PlansPageLegacy from "./pages/PlansPageLegacy";

export default function App() {
  const [page, setPage] = useState("home");
  const [toasts, setToasts] = useState([]);
  const [appState, setAppState] = useState(() => { 
    AppStateManager.load(); 
    return { ...AppStateManager._data }; 
  });

  const showToast = useCallback((message, type = "info") => {
    const id = Date.now();
    setToasts(t => [...t, { id, message, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3800);
  }, []);

  const navigate = useCallback((p) => { 
    setPage(p); 
    window.scrollTo(0, 0); 
  }, []);

  const pageProps = { navigate, showToast, appState, setAppState };

  return (
    <>
      <ToastContainer toasts={toasts} />
      
      {/* Landing Page */}
      {page === "home" && (
        <div className="page active">
          <LandingPage {...pageProps} />
        </div>
      )}

      {/* Auth & Onboarding */}
      {page === "auth" && (
        <div className="page active">
          <AuthPage {...pageProps} />
        </div>
      )}
      {page === "register" && (
        <div className="page active" style={{ display: 'contents' }}>
          <OnboardingPage {...pageProps} />
        </div>
      )}

      {/* Product Flow (Post-Onboarding) */}
      {page === "analysis" && (
        <div className="page active" style={{ display: 'contents' }}>
          <AnalysisLoaderPage {...pageProps} />
        </div>
      )}
      {page === "risk-result" && (
        <div className="page active" style={{ display: 'contents' }}>
          <RiskResultPage {...pageProps} />
        </div>
      )}
      {page === "plan-selection" && (
        <div className="page active" style={{ display: 'contents' }}>
          <PlanSelectionPage {...pageProps} />
        </div>
      )}
      {page === "payment" && (
        <div className="page active" style={{ display: 'contents' }}>
          <PaymentPage {...pageProps} />
        </div>
      )}

      {/* Main Experience */}
      {page === "dashboard" && (
        <div className="page active" style={{ display: 'contents' }}>
          <DashboardPage {...pageProps} />
        </div>
      )}
      {page === "triggers" && (
        <div className="page active">
          <TriggersPage {...pageProps} />
        </div>
      )}
      {page === "claims" && (
        <div className="page active">
          <ClaimsPage {...pageProps} />
        </div>
      )}
      {page === "profile" && (
        <div className="page active">
          <ProfilePage {...pageProps} />
        </div>
      )}

      {/* Management */}
      {page === "admin" && (
        <div className="page active">
          <AdminPage {...pageProps} />
        </div>
      )}

      {/* Legacy Flow Support */}
      {page === "risk" && (
        <div className="page active">
          <RiskPageLegacy {...pageProps} />
        </div>
      )}
      {page === "plans" && (
        <div className="page active">
          <PlansPageLegacy {...pageProps} />
        </div>
      )}
    </>
  );
}
