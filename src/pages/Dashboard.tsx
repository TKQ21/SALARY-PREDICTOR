import { motion } from "framer-motion";
import { useApp } from "@/context/AppContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Clock, DollarSign, MapPin, Briefcase, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const { user, predictions } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 gradient-mesh">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-display font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground text-sm mb-8">
            Welcome back, <span className="text-primary">{user.email}</span>
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Predictions", value: predictions.length, icon: TrendingUp, color: "text-neon-cyan" },
              { label: "Avg Salary", value: predictions.length ? `$${Math.round(predictions.reduce((s, p) => s + p.result.predictedSalary, 0) / predictions.length).toLocaleString()}` : "N/A", icon: DollarSign, color: "text-neon-green" },
              { label: "Top Role", value: predictions.length ? predictions[0].input.jobRole.split(" ")[0] : "N/A", icon: Briefcase, color: "text-neon-purple" },
              { label: "Avg Confidence", value: predictions.length ? `${Math.round(predictions.reduce((s, p) => s + p.result.confidence, 0) / predictions.length)}%` : "N/A", icon: TrendingUp, color: "text-neon-pink" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-4"
              >
                <stat.icon className={`h-5 w-5 ${stat.color} mb-2`} />
                <div className={`text-xl font-display font-bold ${stat.color}`}>{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* History */}
          <h2 className="text-lg font-display font-bold mb-4">Prediction History</h2>
          {predictions.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground text-sm">No predictions yet. Go make your first one!</p>
              <button
                onClick={() => navigate("/predict")}
                className="mt-4 px-6 py-2 rounded-xl bg-primary text-primary-foreground font-display font-bold text-xs uppercase tracking-wider"
              >
                Predict Now
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {predictions.map((p, i) => (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Briefcase className="h-4 w-4 text-primary" />
                      <span className="font-medium text-sm">{p.input.jobRole}</span>
                      <span className="text-xs text-muted-foreground">• {p.input.experience}yr exp</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.input.location}</span>
                      <span>{p.input.industry}</span>
                      <span>{p.input.workMode}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {p.input.skills.slice(0, 4).map(s => (
                        <span key={s} className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-medium">{s}</span>
                      ))}
                      {p.input.skills.length > 4 && (
                        <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground text-[10px]">+{p.input.skills.length - 4}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-display font-bold text-primary neon-text-cyan">
                      ${p.result.predictedSalary.toLocaleString()}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {new Date(p.date).toLocaleDateString()} • {p.result.confidence}% confidence
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
