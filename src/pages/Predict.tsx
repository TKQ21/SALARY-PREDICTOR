import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useApp } from "@/context/AppContext";
import {
  predictSalary,
  PredictionInput,
  PredictionResult,
  SKILLS_OPTIONS,
  EDUCATION_OPTIONS,
  ROLE_OPTIONS,
  LOCATION_OPTIONS,
  COMPANY_OPTIONS,
  INDUSTRY_OPTIONS,
  WORK_MODE_OPTIONS,
} from "@/lib/prediction-engine";
import { Zap, Loader2 } from "lucide-react";

export default function Predict() {
  const { user, addPrediction } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);

  const [form, setForm] = useState<PredictionInput>({
    skills: [],
    experience: 3,
    education: "Bachelor's",
    jobRole: "Software Engineer",
    location: "Remote",
    companyType: "Mid-size",
    industry: "Tech",
    workMode: "Remote",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (form.skills.length === 0) e.skills = "Select at least one skill";
    if (form.experience < 0 || form.experience > 50) e.experience = "Invalid experience";
    if (!form.education) e.education = "Select education";
    if (!form.jobRole) e.jobRole = "Select job role";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 1500));

    try {
      const prediction = predictSalary(form);
      setResult(prediction);
      if (user) addPrediction(form, prediction);
      toast.success("Salary predicted successfully!");
    } catch {
      toast.error("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSkill = (skill: string) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill],
    }));
    setErrors(prev => ({ ...prev, skills: "" }));
  };

  const SelectField = ({ label, value, options, field }: { label: string; value: string; options: string[]; field: keyof PredictionInput }) => (
    <div>
      <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>
      <select
        value={value}
        onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
        className="w-full rounded-xl bg-input border border-border px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {errors[field] && <p className="text-xs text-destructive mt-1">{errors[field]}</p>}
    </div>
  );

  if (result) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 gradient-mesh">
        <div className="container mx-auto max-w-3xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-8 neon-glow-cyan"
          >
            <h2 className="text-2xl font-display font-bold text-center mb-2">Prediction Result</h2>
            <p className="text-center text-muted-foreground text-sm mb-8">Based on your profile analysis</p>

            <div className="text-center mb-8">
              <div className="text-5xl md:text-6xl font-display font-black text-primary neon-text-cyan">
                ${result.predictedSalary.toLocaleString()}
              </div>
              <p className="text-muted-foreground mt-2 text-sm">per year</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <div className="text-lg font-display font-bold text-neon-green neon-text-green">${result.minSalary.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Minimum</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <div className="text-lg font-display font-bold text-neon-yellow">{result.confidence}%</div>
                <div className="text-xs text-muted-foreground">Confidence</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-muted/50">
                <div className="text-lg font-display font-bold text-neon-pink neon-text-pink">${result.maxSalary.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Maximum</div>
              </div>
            </div>

            {/* Factor impact bars */}
            <h3 className="font-display font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Factor Impact</h3>
            <div className="space-y-3 mb-8">
              {result.factors.slice(0, 5).map(f => (
                <div key={f.name}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{f.name}</span>
                    <span className={f.impact >= 0 ? "text-neon-green" : "text-neon-red"}>
                      {f.impact >= 0 ? "+" : ""}{f.impact.toFixed(1)}%
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(Math.abs(f.impact) * 2, 100)}%` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className={`h-full rounded-full ${f.impact >= 0 ? "bg-neon-green" : "bg-neon-red"}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setResult(null)}
                className="flex-1 py-3 rounded-xl border border-border text-sm font-display font-bold hover:bg-muted transition-colors"
              >
                New Prediction
              </button>
              {user && (
                <button
                  onClick={() => navigate("/dashboard")}
                  className="flex-1 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-display font-bold hover:scale-[1.02] transition-transform"
                >
                  View History
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 gradient-mesh">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-3xl p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold mb-2">Predict Your Salary</h1>
            <p className="text-muted-foreground text-sm">Fill in your details for an AI-powered estimate</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Skills</label>
              <div className="flex flex-wrap gap-2">
                {SKILLS_OPTIONS.map(skill => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      form.skills.includes(skill)
                        ? "bg-primary/20 text-primary border border-primary/40 neon-glow-cyan"
                        : "bg-muted text-muted-foreground border border-border hover:border-primary/30"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
              {errors.skills && <p className="text-xs text-destructive mt-1">{errors.skills}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                Experience: <span className="text-primary">{form.experience} years</span>
              </label>
              <input
                type="range"
                min={0}
                max={30}
                value={form.experience}
                onChange={e => setForm(prev => ({ ...prev, experience: Number(e.target.value) }))}
                className="w-full accent-primary"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <SelectField label="Education" value={form.education} options={EDUCATION_OPTIONS} field="education" />
              <SelectField label="Job Role" value={form.jobRole} options={ROLE_OPTIONS} field="jobRole" />
              <SelectField label="Location" value={form.location} options={LOCATION_OPTIONS} field="location" />
              <SelectField label="Company Type" value={form.companyType} options={COMPANY_OPTIONS} field="companyType" />
              <SelectField label="Industry" value={form.industry} options={INDUSTRY_OPTIONS} field="industry" />
              <SelectField label="Work Mode" value={form.workMode} options={WORK_MODE_OPTIONS} field="workMode" />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wider neon-glow-cyan hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Predict Salary
                </>
              )}
            </button>
          </form>

          {!user && (
            <p className="text-center text-xs text-muted-foreground mt-4">
              Login to save your prediction history
            </p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
