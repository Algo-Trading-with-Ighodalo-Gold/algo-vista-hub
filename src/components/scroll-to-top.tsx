import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top when route changes. Dashboard uses #dashboard-content as scroll container.
    const dashboardContent = document.getElementById('dashboard-content')
    if (dashboardContent) {
      dashboardContent.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }, [pathname]);

  return null;
}