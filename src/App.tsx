import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Layout } from "@/components/layout/layout";
import HomePage from "./pages/home";
import ProductsPage from "./pages/products";
import PricingPage from "./pages/pricing";
import SupportPage from "./pages/support";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import ForgotPasswordPage from "./pages/auth/forgot-password";
import DashboardPage from "./pages/dashboard/dashboard";
import AffiliateProgramPage from "./pages/affiliate-program";
import CheckoutPage from "./pages/checkout";
import NotFound from "./pages/NotFound";
import EATitanXPage from "./pages/products/ea-titanx";
import EAQuantumEdgePage from "./pages/products/ea-quantumedge";
import EAVelocityProPage from "./pages/products/ea-velocitypro";
import EADevelopmentPage from "./pages/ea-development";

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
              <Layout>
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
                  <Route path="/auth/login" element={<LoginPage />} />
                  <Route path="/auth/register" element={<RegisterPage />} />
                  <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Layout>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App;