import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Layout } from "@/components/layout/layout";
import { EnhancedLayout } from "@/components/layout/enhanced-layout";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import HomePage from "./pages/home";
import ProductsPage from "./pages/products";
import PricingPage from "./pages/pricing";
import SupportPage from "./pages/support";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import DashboardPage from "./pages/dashboard/dashboard";
import DashboardOverview from "./pages/dashboard/overview";
import ProfilePage from "./pages/dashboard/profile";
import AffiliateProgramPage from "./pages/affiliate-program";
import CheckoutPage from "./pages/checkout";
import NotFound from "./pages/NotFound";
import EATitanXPage from "./pages/products/ea-titanx";
import EAQuantumEdgePage from "./pages/products/ea-quantumedge";
import EAVelocityProPage from "./pages/products/ea-velocitypro";
import EADevelopmentPage from "./pages/ea-development";
import PrivacyPolicyPage from "./pages/legal/privacy-policy";
import TermsOfServicePage from "./pages/legal/terms-of-service";
import LicenseAgreementPage from "./pages/legal/license-agreement";
import CookiePolicyPage from "./pages/legal/cookie-policy";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <EnhancedLayout>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/products/ea-titanx" element={<EATitanXPage />} />
                  <Route path="/products/ea-quantumedge" element={<EAQuantumEdgePage />} />
                  <Route path="/products/ea-velocitypro" element={<EAVelocityProPage />} />
                  <Route path="/development" element={<EADevelopmentPage />} />
                  <Route path="/affiliate-program" element={<AffiliateProgramPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/support" element={<SupportPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/privacy" element={<PrivacyPolicyPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  <Route path="/license" element={<LicenseAgreementPage />} />
                  <Route path="/cookies" element={<CookiePolicyPage />} />
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                  <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                  
                  {/* Dashboard Routes with Sidebar Layout */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<DashboardOverview />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="subscriptions" element={<div className="animate-fade-in">Subscriptions coming soon...</div>} />
                    <Route path="analytics" element={<div className="animate-fade-in">Analytics coming soon...</div>} />
                    <Route path="ea-development" element={<div className="animate-fade-in">EA Development coming soon...</div>} />
                    <Route path="affiliate" element={<div className="animate-fade-in">Affiliate management coming soon...</div>} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </EnhancedLayout>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App;