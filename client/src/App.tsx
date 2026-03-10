// Healthcare Select Access — App Router
// Design: Secure Clarity | Federal Blue + Medical Teal
// Typography: Sora (headings) + IBM Plex Sans (body) + IBM Plex Mono (data)

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider } from "./contexts/AuthContext";

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

      {/* Authenticated */}
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/records" component={Records} />
      <Route path="/records/:id" component={RecordDetail} />
      <Route path="/share/create" component={ShareCreate} />
      <Route path="/share/:shareId" component={ShareView} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/settings" component={Settings} />

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
