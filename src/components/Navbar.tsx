import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { useApp } from "@/context/AppContext";
import { Zap, BarChart3, LogIn, LogOut, LayoutDashboard, Shield, Home } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/predict", label: "Predict", icon: Zap },
    ...(user ? [{ path: "/dashboard", label: "Dashboard", icon: LayoutDashboard }] : []),
    ...(user?.role === "ADMIN" ? [{ path: "/admin", label: "Admin", icon: Shield }] : []),
  ];

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border"
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative">
            <BarChart3 className="h-7 w-7 text-primary animate-pulse-neon" />
            <div className="absolute inset-0 blur-md bg-primary/30 rounded-full" />
          </div>
          <span className="font-display text-lg font-bold text-primary neon-text-cyan tracking-wider">
            SalaryVision AI
          </span>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive(path)
                  ? "bg-primary/10 text-primary neon-glow-cyan"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="hidden sm:inline">{label}</span>
            </Link>
          ))}

          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-neon-pink hover:bg-neon-pink/10 transition-all"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/login"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive("/login")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              <LogIn className="h-4 w-4" />
              <span className="hidden sm:inline">Login</span>
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}
