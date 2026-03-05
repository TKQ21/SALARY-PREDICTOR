import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Zap, TrendingUp, Shield, Brain, ArrowRight, Sparkles } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered",
    description: "Advanced ML model trained on real salary data across industries",
    color: "text-neon-cyan",
    glow: "neon-glow-cyan",
  },
  {
    icon: TrendingUp,
    title: "Accurate Ranges",
    description: "Get predicted salary with min/max range and confidence score",
    color: "text-neon-green",
    glow: "neon-glow-green",
  },
  {
    icon: Shield,
    title: "Multi-Factor",
    description: "Considers skills, experience, location, industry, and more",
    color: "text-neon-purple",
    glow: "neon-glow-purple",
  },
  {
    icon: Sparkles,
    title: "Instant Results",
    description: "Get your salary prediction in seconds with factor breakdown",
    color: "text-neon-pink",
    glow: "neon-glow-pink",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen gradient-mesh">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full bg-primary/5 blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-neon-purple/5 blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

        <div className="container mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-medium text-primary tracking-wide uppercase">AI-Powered Salary Intelligence</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
              <span className="text-foreground">Know Your</span>
              <br />
              <span className="text-primary neon-text-cyan">Worth</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 font-body">
              Predict your salary with precision using our AI model. 
              Get insights based on your skills, experience, and market data.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/predict"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wider neon-glow-cyan hover:scale-105 transition-transform duration-200"
              >
                Predict My Salary
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-border bg-card text-foreground font-display font-bold text-sm uppercase tracking-wider hover:bg-muted transition-colors duration-200"
              >
                Get Started Free
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="grid grid-cols-3 gap-6 max-w-lg mx-auto mt-16"
          >
            {[
              { value: "95%", label: "Accuracy" },
              { value: "50K+", label: "Predictions" },
              { value: "12+", label: "Industries" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl md:text-3xl font-display font-black text-primary neon-text-cyan">{stat.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-display font-bold text-center mb-12"
          >
            Why <span className="text-primary neon-text-cyan">SalaryVision</span>?
          </motion.h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`glass-card rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200 ${feature.glow}`}
              >
                <feature.icon className={`h-8 w-8 ${feature.color} mb-4`} />
                <h3 className="font-display font-bold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="glass-card rounded-3xl p-12 text-center neon-glow-cyan"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Ready to discover your market value?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of professionals making informed career decisions with AI-powered salary insights.
            </p>
            <Link
              to="/predict"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-display font-bold text-sm uppercase tracking-wider hover:scale-105 transition-transform"
            >
              Start Predicting <Zap className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto text-center text-sm text-muted-foreground">
        © 2026 Mohd Kaif. All rights reserved.
          <br />
          <span className="text-xs opacity-60">Built with AI assistance</span>
        </div>
      </footer>
    </div>
  );
}
