import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { AdminRoute } from "@/components/auth/admin-route";
import { Layout } from "@/components/layout/layout";
import { EnhancedLayout } from "@/components/layout/enhanced-layout";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import { initializeReferralTracking } from "@/lib/referral-tracking";
import HomePage from "./pages/home";
import ProductsPage from "./pages/products";
import SupportPage from "./pages/support";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import ResetPasswordPage from "./pages/auth/reset-password";
import ProfilePage from "./pages/dashboard/profile";
import DashboardEADevelopmentPage from "./pages/dashboard/ea-development";
import EADevelopmentPage from "./pages/ea-development";
import AccountsPage from "./pages/dashboard/accounts";
import TransactionsPage from "./pages/dashboard/transactions";
import RenewSubscriptionPage from "./pages/dashboard/renew-subscription";
import ResourcesPage from "./pages/dashboard/resources";
import FAQPage from "./pages/dashboard/faq";
import AffiliatePage from "./pages/dashboard/affiliate";
import AffiliateProgramPage from "./pages/affiliate-program";
import CheckoutPage from "./pages/checkout"
import PaymentPage from "./pages/payment"
import PaymentSuccessPage from "./pages/payment/success"
import PaymentFailurePage from "./pages/payment/failure"
import DashboardCheckoutPage from "./pages/dashboard/checkout"
import NotFound from "./pages/NotFound"
import EATitanXPage from "./pages/products/ea-titanx";
import EAQuantumEdgePage from "./pages/products/ea-quantumedge";
import EAVelocityProPage from "./pages/products/ea-velocitypro";
import ProductDetailPage from "./pages/products/product-detail";
import SubscriptionPlansPage from "./pages/products/subscription-plans";

import PrivacyPolicyPage from "./pages/legal/privacy-policy";
import TermsOfServicePage from "./pages/legal/terms-of-service";
import LicenseAgreementPage from "./pages/legal/license-agreement";
import CookiePolicyPage from "./pages/legal/cookie-policy";
import AboutUsPage from "./pages/about-us";
import PublicFAQPage from "./pages/faq";
import RefundPolicyPage from "./pages/refund-policy";
import TeamPage from "./pages/team";
import WebinarsPage from "./pages/webinars";
import BlogPage from "./pages/blog";
import StoryPage from "./pages/story";
import CareersPage from "./pages/careers";
import PressPage from "./pages/press";
import DocsPage from "./pages/docs";
import StatusPage from "./pages/status";
import GuidesPage from "./pages/guides";
import RiskDisclosurePage from "./pages/risk-disclosure";
import AdminDashboardPage from "./pages/admin/dashboard";
import EAManagementPage from "./pages/admin/ea-management";
import UsersManagementPage from "./pages/admin/users";
import AdminAccountsPage from "./pages/admin/accounts";
import AdminAffiliatesPage from "./pages/admin/affiliates";
import AdminAffiliateApplicationsPage from "./pages/admin/affiliate-applications";
import LicenseManagementPage from "./pages/admin/licenses";
import TransactionManagementPage from "./pages/admin/transactions";
import SubscriptionManagementPage from "./pages/admin/subscriptions";
import EADevelopmentProjectsPage from "./pages/admin/ea-development-projects";
import AdminDiscountsPage from "./pages/admin/discounts";
import AdminSupportTicketsPage from "./pages/admin/support-tickets";

const queryClient = new QueryClient();

// Error boundary to catch render errors and prevent blank white screen
class AppErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("App error:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, background: '#fff' }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <h1 style={{ fontSize: 24, fontWeight: 700, color: '#dc2626', marginBottom: 16 }}>Something went wrong</h1>
            <p style={{ color: '#666', marginBottom: 16 }}>{this.state.error?.message}</p>
            <button
              onClick={() => window.location.reload()}
              style={{ padding: '8px 16px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer' }}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  // Initialize referral tracking on app load
  useEffect(() => {
    initializeReferralTracking()
  }, [])

  return (
    <AppErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <ScrollToTop />
            <AuthProvider>
              <Routes>
                {/* Public Routes with Enhanced Layout (includes public header) */}
                <Route path="/" element={<EnhancedLayout><HomePage /></EnhancedLayout>} />
                <Route path="/products" element={<EnhancedLayout><ProductsPage /></EnhancedLayout>} />
                <Route path="/products/:eaId" element={<EnhancedLayout><ProductDetailPage /></EnhancedLayout>} />
                <Route path="/products/:eaId/plans" element={<EnhancedLayout><SubscriptionPlansPage /></EnhancedLayout>} />
                <Route path="/products/ea-titanx" element={<EnhancedLayout><EATitanXPage /></EnhancedLayout>} />
                <Route path="/products/ea-quantumedge" element={<EnhancedLayout><EAQuantumEdgePage /></EnhancedLayout>} />
                <Route path="/products/ea-velocitypro" element={<EnhancedLayout><EAVelocityProPage /></EnhancedLayout>} />
                <Route path="/support" element={<EnhancedLayout><SupportPage /></EnhancedLayout>} />
                <Route path="/affiliate-program" element={<EnhancedLayout><AffiliateProgramPage /></EnhancedLayout>} />
                <Route path="/ea-development" element={<EnhancedLayout><EADevelopmentPage /></EnhancedLayout>} />
                <Route path="/checkout" element={<EnhancedLayout><CheckoutPage /></EnhancedLayout>} />
                <Route path="/payment" element={<EnhancedLayout><PaymentPage /></EnhancedLayout>} />
                <Route path="/payment/success" element={<EnhancedLayout><PaymentSuccessPage /></EnhancedLayout>} />
                <Route path="/payment/failure" element={<EnhancedLayout><PaymentFailurePage /></EnhancedLayout>} />
                <Route path="/privacy" element={<EnhancedLayout><PrivacyPolicyPage /></EnhancedLayout>} />
                <Route path="/terms" element={<EnhancedLayout><TermsOfServicePage /></EnhancedLayout>} />
                <Route path="/license" element={<EnhancedLayout><LicenseAgreementPage /></EnhancedLayout>} />
                <Route path="/cookies" element={<EnhancedLayout><CookiePolicyPage /></EnhancedLayout>} />
                <Route path="/about" element={<EnhancedLayout><AboutUsPage /></EnhancedLayout>} />
                <Route path="/faq" element={<EnhancedLayout><PublicFAQPage /></EnhancedLayout>} />
                <Route path="/refund" element={<EnhancedLayout><RefundPolicyPage /></EnhancedLayout>} />
                <Route path="/team" element={<EnhancedLayout><TeamPage /></EnhancedLayout>} />
                <Route path="/webinars" element={<EnhancedLayout><WebinarsPage /></EnhancedLayout>} />
                <Route path="/blog" element={<EnhancedLayout><BlogPage /></EnhancedLayout>} />
                <Route path="/story" element={<EnhancedLayout><StoryPage /></EnhancedLayout>} />
                <Route path="/careers" element={<EnhancedLayout><CareersPage /></EnhancedLayout>} />
                <Route path="/press" element={<EnhancedLayout><PressPage /></EnhancedLayout>} />
                <Route path="/docs" element={<EnhancedLayout><DocsPage /></EnhancedLayout>} />
                <Route path="/status" element={<EnhancedLayout><StatusPage /></EnhancedLayout>} />
                <Route path="/guides" element={<EnhancedLayout><GuidesPage /></EnhancedLayout>} />
                <Route path="/risk-disclosure" element={<EnhancedLayout><RiskDisclosurePage /></EnhancedLayout>} />
                <Route path="/auth/login" element={<EnhancedLayout><LoginPage /></EnhancedLayout>} />
                <Route path="/auth/register" element={<EnhancedLayout><RegisterPage /></EnhancedLayout>} />
                <Route path="/auth/forgot-password" element={<EnhancedLayout><ForgotPasswordPage /></EnhancedLayout>} />
                <Route path="/auth/reset-password" element={<EnhancedLayout><ResetPasswordPage /></EnhancedLayout>} />
                
                {/* Dashboard Routes with Dashboard Layout Only (no public header) */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<ProfilePage />} />
                  <Route path="profile" element={<ProfilePage />} />
                  <Route path="ea-development" element={<DashboardEADevelopmentPage />} />
                  <Route path="accounts" element={<AccountsPage />} />
                  <Route path="transactions" element={<TransactionsPage />} />
                  <Route path="renew-subscription" element={<RenewSubscriptionPage />} />
                  <Route path="checkout" element={<DashboardCheckoutPage />} />
                  <Route path="resources" element={<ResourcesPage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="affiliate" element={<AffiliatePage />} />
                </Route>

                {/* Admin Routes with Dashboard Layout and Admin Protection */}
                <Route path="/admin" element={
                  <AdminRoute>
                    <DashboardLayout />
                  </AdminRoute>
                }>
                  <Route index element={<AdminDashboardPage />} />
                  <Route path="dashboard" element={<AdminDashboardPage />} />
                  <Route path="ea-management" element={<EAManagementPage />} />
                  <Route path="users" element={<UsersManagementPage />} />
                  <Route path="licenses" element={<LicenseManagementPage />} />
                  <Route path="accounts" element={<AdminAccountsPage />} />
                  <Route path="transactions" element={<TransactionManagementPage />} />
                  <Route path="subscriptions" element={<SubscriptionManagementPage />} />
                  <Route path="affiliates" element={<AdminAffiliatesPage />} />
                  <Route path="affiliate-applications" element={<AdminAffiliateApplicationsPage />} />
                  <Route path="ea-development-projects" element={<EADevelopmentProjectsPage />} />
                  <Route path="support-tickets" element={<AdminSupportTicketsPage />} />
                  <Route path="discounts" element={<AdminDiscountsPage />} />
                </Route>
                <Route path="*" element={<EnhancedLayout><NotFound /></EnhancedLayout>} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
    </AppErrorBoundary>
  )
}

export default App;