import { Link } from "react-router-dom"
import { TrendingUp, Twitter, Linkedin, Mail } from "lucide-react"

const footerLinks = {
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Story", href: "/story" },
    { name: "Team", href: "/team" },
    { name: "Careers", href: "/careers" },
    { name: "Press Kit", href: "/press" },
  ],
  product: [
    { name: "Expert Advisors", href: "/products" },
    
    { name: "Pricing Plans", href: "/pricing" },
    { name: "API Documentation", href: "/docs" },
    { name: "System Status", href: "/status" },
  ],
  support: [
    { name: "Help Center", href: "/support" },
    { name: "Live Chat", href: "#", onClick: () => window.open('https://lovable.dev', '_blank') },
    { name: "Email Support", href: "mailto:support@algotrading.com" },
    { name: "Knowledge Base", href: "/support#knowledge-base" },
    { name: "Community Forum", href: "https://t.me/+your-telegram-group", external: true },
  ],
  resources: [
    { name: "Trading Guides", href: "/guides" },
    { name: "Market Analysis", href: "/analysis" },
    { name: "Educational Videos", href: "/videos" },
    { name: "Webinars", href: "/webinars" },
    { name: "Blog", href: "/blog" },
  ],
  legal: [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Cookie Policy", href: "/cookies" },
    { name: "License Agreement", href: "/license" },
    { name: "Risk Disclosure", href: "/risk-disclosure" },
  ],
}

const socialLinks = [
  { name: "Twitter", href: "https://twitter.com/ALG0_TRADING", icon: Twitter },
  { name: "LinkedIn", href: "https://linkedin.com/company/algotrading", icon: Linkedin },
  { name: "Email", href: "mailto:algotradingwithighodalo@gmail.com", icon: Mail },
]

export function Footer() {
  const handleLinkClick = (item: any) => {
    if (item.onClick) {
      item.onClick()
    } else if (item.external) {
      window.open(item.href, '_blank', 'noopener noreferrer')
    }
  }

  return (
    <footer className="border-t bg-gradient-subtle relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:50px_50px]" />
      
      <div className="container relative py-20">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 lg:gap-12">
          
          {/* Brand section */}
          <div className="col-span-1 md:col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <TrendingUp className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl text-gradient">AlgoTrading</span>
            </Link>
            
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-8">
              Professional algorithmic trading solutions with secure Expert Advisors 
              for MetaTrader 5. Join thousands of traders automating their success with 
              our cutting-edge technology.
            </p>
            
            {/* Social links */}
            <div className="flex space-x-4">
              {socialLinks.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted/50 text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-all duration-200 hover:scale-105"
                  aria-label={item.name}
                  {...(item.href.startsWith('http') ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                >
                  <item.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-card/50 rounded-lg border">
              <p className="text-xs text-muted-foreground mb-2">
                <strong>Risk Warning:</strong> Trading involves substantial risk of loss.
              </p>
              <p className="text-xs text-muted-foreground">
                Past performance is not indicative of future results.
              </p>
            </div>
          </div>

          {/* Company Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-sm mb-6 text-foreground">Company</h3>
            <ul className="space-y-4">
              {footerLinks.company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-sm mb-6 text-foreground">Products</h3>
            <ul className="space-y-4">
              {footerLinks.product.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-sm mb-6 text-foreground">Support</h3>
            <ul className="space-y-4">
              {footerLinks.support.map((item) => (
                <li key={item.name}>
                  {item.onClick || item.external ? (
                    <button
                      onClick={() => handleLinkClick(item)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline text-left"
                    >
                      {item.name}
                    </button>
                  ) : (
                    <Link
                      to={item.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                    >
                      {item.name}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div className="col-span-1">
            <h3 className="font-semibold text-sm mb-6 text-foreground">Resources</h3>
            <ul className="space-y-4">
              {footerLinks.resources.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200 hover:underline"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Legal links */}
        <div className="mt-16 pt-8 border-t border-border/50">
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {footerLinks.legal.map((item, index) => (
              <span key={item.name} className="flex items-center">
                <Link
                  to={item.href}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  {item.name}
                </Link>
                {index < footerLinks.legal.length - 1 && (
                  <span className="mx-3 text-muted-foreground/50">•</span>
                )}
              </span>
            ))}
          </div>
          
          {/* Bottom footer */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                © 2024 AlgoTrading with Ighodalo. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center gap-6 text-xs text-muted-foreground">
              <span>Professional trading tools for serious traders</span>
              <span className="hidden md:inline">•</span>
              <span className="hidden md:inline">Made with ❤️ for traders worldwide</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}