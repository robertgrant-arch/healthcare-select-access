// Healthcare Select Access — App Router
// Design: Secure Clarity | Federal Blue + Medical Teal
// Typography: Sora (headings) + IBM Plex Sans (body) + IBM Plex Mono (data)

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch, Redirect } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// Pages
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import VerifyIdentity from "./pages/auth/VerifyIdentity";
import MfaSetup from "./pages/auth/MfaSetup";
import MfaVerify from "./pages/auth/MfaVerify";
import Dashboard from "./pages/dashboard/Dashboard";
import Records from "./pages/records/Records";
import RecordDetail from "./pages/records/RecordDetail";
import ShareCreate from "./pages/share/ShareCreate";
import ShareView from "./pages/share/ShareView";
import AdminPanel from "./pages/admin/AdminPanel";
import Settings from "./pages/settings/Settings";
import OIDCDocs from "./pages/docs/OIDCDocs";

// Protected Route wrapper — redirects to login if not authenticated
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType<any>; path?: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  return <Component {...rest} />;
}

// Admin Route wrapper — requires admin role
function AdminRoute({ component: Component, ...rest }: { component: React.ComponentType<any>; path?: string }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Redirect to="/auth/login" />;
  }

  if (user.role !== "admin") {
    return <Redirect to="/dashboard" />;
  }

  return <Component {...rest} />;
}

function Router() {
  return (
    <Switch>
      {/* Public */}
      <Route path="/" component={Home} />
      <Route path="/docs/oidc" component={OIDCDocs} />

      {/* Auth flows */}
      <Route path="/auth/login" component={Login} />
      <Route path="/auth/register" component={Register} />
      <Route path="/auth/verify-email" component={VerifyEmail} />
      <Route path="/auth/verify-identity" component={VerifyIdentity} />
      <Route path="/auth/mfa/setup" component={MfaSetup} />
      <Route path="/auth/mfa/verify" component={MfaVerify} />

      {/* Authenticated — protected routes */}
      <Route path="/dashboard">{() => <ProtectedRoute component={Dashboard} />}</Route>
      <Route path="/records">{() => <ProtectedRoute component={Records} />}</Route>
      <Route path="/records/:id">{(params) => <ProtectedRoute component={RecordDetail} {...params} />}</Route>
      <Route path="/share/create">{() => <ProtectedRoute component={ShareCreate} />}</Route>
      <Route path="/share/:shareId">{(params) => <ProtectedRoute component={ShareView} {...params} />}</Route>
      <Route path="/settings">{() => <ProtectedRoute component={Settings} />}</Route>

      {/* Admin only */}
      <Route path="/admin">{() => <AdminRoute component={AdminPanel} />}</Route>

      {/* 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <AuthProvider>
          <TooltipProvider>
            <Toaster position="top-right" richColors />
            <Router />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
