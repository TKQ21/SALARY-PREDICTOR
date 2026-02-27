import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Users, BarChart3, Activity, Shield } from "lucide-react";

export default function Admin() {
  const { user, predictions } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.role !== "ADMIN") navigate("/login");
  }, [user, navigate]);

  if (!user || user.role !== "ADMIN") return null;

  const uniqueRoles = [...new Set(predictions.map(p => p.input.jobRole))];
  const uniqueLocations = [...new Set(predictions.map(p => p.input.location))];
  const avgSalary = predictions.length
    ? Math.round(predictions.reduce((s, p) => s + p.result.predictedSalary, 0) / predictions.length)
    : 0;

  const roleDistribution = uniqueRoles.map(role => ({
    role,
    count: predictions.filter(p => p.input.jobRole === role).length,
    avgSalary: Math.round(
      predictions.filter(p => p.input.jobRole === role).reduce((s, p) => s + p.result.predictedSalary, 0) /
      predictions.filter(p => p.input.jobRole === role).length
    ),
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 gradient-mesh">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="h-6 w-6 text-neon-pink" />
            <h1 className="text-3xl font-display font-bold">Admin Panel</h1>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Total Predictions", value: predictions.length, icon: BarChart3, color: "text-neon-cyan", glow: "neon-glow-cyan" },
              { label: "Unique Roles", value: uniqueRoles.length, icon: Users, color: "text-neon-green", glow: "neon-glow-green" },
              { label: "Avg Salary", value: avgSalary ? `$${avgSalary.toLocaleString()}` : "N/A", icon: Activity, color: "text-neon-purple", glow: "neon-glow-purple" },
              { label: "Locations", value: uniqueLocations.length, icon: Activity, color: "text-neon-pink", glow: "neon-glow-pink" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-2xl p-5 ${stat.glow}`}
              >
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <div className={`text-2xl font-display font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Role Distribution */}
          <h2 className="text-lg font-display font-bold mb-4">Role Distribution</h2>
          {roleDistribution.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground text-sm">
              No prediction data yet. Stats will appear here once users start making predictions.
            </div>
          ) : (
            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-display text-xs uppercase tracking-wider text-muted-foreground">Role</th>
                    <th className="text-center p-4 font-display text-xs uppercase tracking-wider text-muted-foreground">Count</th>
                    <th className="text-right p-4 font-display text-xs uppercase tracking-wider text-muted-foreground">Avg Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {roleDistribution.map((r, i) => (
                    <motion.tr
                      key={r.role}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4 font-medium">{r.role}</td>
                      <td className="p-4 text-center text-primary">{r.count}</td>
                      <td className="p-4 text-right font-display font-bold text-neon-green">${r.avgSalary.toLocaleString()}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Recent Predictions */}
          <h2 className="text-lg font-display font-bold mt-8 mb-4">Recent Predictions</h2>
          <div className="space-y-2">
            {predictions.slice(0, 10).map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="glass-card rounded-xl px-5 py-3 flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <span className="font-medium">{p.input.jobRole}</span>
                  <span className="text-muted-foreground text-xs">{p.input.location} • {p.input.experience}yr</span>
                </div>
                <div className="font-display font-bold text-primary">${p.result.predictedSalary.toLocaleString()}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
