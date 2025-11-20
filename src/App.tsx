import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ScrollToTop } from "@/components/scroll-to-top";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Layout } from "@/components/layout/layout";
import { EnhancedLayout } from "@/components/layout/enhanced-layout";
import { DashboardLayout } from "@/layouts/dashboard-layout";
import HomePage from "./pages/home";
import ProductsPage from "./pages/products";
import SupportPage from "./pages/support";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import ProfilePage from "./pages/dashboard/profile";
import DashboardEADevelopmentPage from "./pages/dashboard/ea-development";
import EADevelopmentPage from "./pages/ea-development";
import AccountsPage from "./pages/dashboard/accounts";
import TransactionsPage from "./pages/dashboard/transactions";
import ResourcesPage from "./pages/dashboard/resources";
import FAQPage from "./pages/dashboard/faq";
import AffiliatePage from "./pages/dashboard/affiliate";
import AffiliateProgramPage from "./pages/affiliate-program";
import CheckoutPage from "./pages/checkout"
import PaymentPage from "./pages/payment"
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
import ContactUsPage from "./pages/contact-us";
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

const queryClient = new QueryClient();

function App() {
  return (
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
                <Route path="/privacy" element={<EnhancedLayout><PrivacyPolicyPage /></EnhancedLayout>} />
                <Route path="/terms" element={<EnhancedLayout><TermsOfServicePage /></EnhancedLayout>} />
                <Route path="/license" element={<EnhancedLayout><LicenseAgreementPage /></EnhancedLayout>} />
                <Route path="/cookies" element={<EnhancedLayout><CookiePolicyPage /></EnhancedLayout>} />
                <Route path="/about" element={<EnhancedLayout><AboutUsPage /></EnhancedLayout>} />
                <Route path="/contact" element={<EnhancedLayout><ContactUsPage /></EnhancedLayout>} />
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
                  <Route path="resources" element={<ResourcesPage />} />
                  <Route path="faq" element={<FAQPage />} />
                  <Route path="affiliate" element={<AffiliatePage />} />
                </Route>
                <Route path="*" element={<EnhancedLayout><NotFound /></EnhancedLayout>} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App;