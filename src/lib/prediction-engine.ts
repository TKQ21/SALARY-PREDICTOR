// Client-side salary prediction engine
// Simulates an ML model using weighted factors based on real-world salary data patterns

export interface PredictionInput {
  skills: string[];
  experience: number;
  education: string;
  jobRole: string;
  location: string;
  companyType: string;
  industry: string;
  workMode: string;
}

export interface PredictionResult {
  predictedSalary: number;
  minSalary: number;
  maxSalary: number;
  confidence: number;
  factors: { name: string; impact: number }[];
}

const BASE_SALARY = 45000;

const EXPERIENCE_MULTIPLIER: Record<string, number> = {
  "0-1": 1.0,
  "1-3": 1.25,
  "3-5": 1.55,
  "5-8": 1.9,
  "8-12": 2.4,
  "12+": 3.0,
};

const EDUCATION_MULTIPLIER: Record<string, number> = {
  "High School": 0.75,
  "Associate": 0.85,
  "Bachelor's": 1.0,
  "Master's": 1.25,
  "PhD": 1.45,
  "Bootcamp": 0.9,
};

const ROLE_MULTIPLIER: Record<string, number> = {
  "Software Engineer": 1.15,
  "Data Scientist": 1.25,
  "Product Manager": 1.2,
  "DevOps Engineer": 1.18,
  "UX Designer": 1.0,
  "ML Engineer": 1.35,
  "Frontend Developer": 1.05,
  "Backend Developer": 1.12,
  "Full Stack Developer": 1.15,
  "Data Analyst": 0.95,
  "QA Engineer": 0.9,
  "Mobile Developer": 1.1,
};

const LOCATION_MULTIPLIER: Record<string, number> = {
  "San Francisco": 1.5,
  "New York": 1.4,
  "Seattle": 1.35,
  "Austin": 1.15,
  "Chicago": 1.1,
  "Denver": 1.1,
  "Boston": 1.3,
  "Los Angeles": 1.25,
  "London": 1.3,
  "Berlin": 1.05,
  "Bangalore": 0.55,
  "Toronto": 0.9,
  "Remote": 1.15,
  "Other": 1.0,
};

const COMPANY_MULTIPLIER: Record<string, number> = {
  "Startup": 0.9,
  "Mid-size": 1.05,
  "Enterprise": 1.2,
  "FAANG": 1.6,
  "Consulting": 1.1,
  "Freelance": 0.95,
};

const INDUSTRY_MULTIPLIER: Record<string, number> = {
  "Tech": 1.2,
  "Finance": 1.25,
  "Healthcare": 1.05,
  "E-commerce": 1.1,
  "Gaming": 1.05,
  "Education": 0.85,
  "Government": 0.9,
  "AI/ML": 1.35,
};

const WORK_MODE_MULTIPLIER: Record<string, number> = {
  "Remote": 1.05,
  "Onsite": 1.0,
  "Hybrid": 1.02,
};

const SKILL_BONUS: Record<string, number> = {
  "Python": 3000,
  "JavaScript": 2500,
  "TypeScript": 3500,
  "React": 3000,
  "Node.js": 2800,
  "AWS": 4000,
  "Docker": 3000,
  "Kubernetes": 4500,
  "Machine Learning": 5000,
  "SQL": 2000,
  "Go": 4000,
  "Rust": 5000,
  "Java": 2500,
  "C++": 3000,
  "TensorFlow": 4000,
  "PyTorch": 4500,
  "GraphQL": 2500,
  "System Design": 5000,
};

export function predictSalary(input: PredictionInput): PredictionResult {
  const expKey = getExperienceKey(input.experience);
  const expMult = EXPERIENCE_MULTIPLIER[expKey] ?? 1;
  let eduMult = EDUCATION_MULTIPLIER[input.education] ?? 1;
  const roleMult = ROLE_MULTIPLIER[input.jobRole] ?? 1;

  // Frontend Developer: cap education bonus (Master's doesn't boost as much)
  if (input.jobRole === "Frontend Developer" && eduMult > 1.12) {
    eduMult = 1.12;
  }
  let locMult = LOCATION_MULTIPLIER[input.location] ?? 1;
  const compMult = COMPANY_MULTIPLIER[input.companyType] ?? 1;
  let indMult = INDUSTRY_MULTIPLIER[input.industry] ?? 1;
  const workMult = WORK_MODE_MULTIPLIER[input.workMode] ?? 1;

  // Cap bonuses for junior profiles (≤2 years)
  if (input.experience <= 2) {
    locMult = Math.min(locMult, 1.12);
    indMult = Math.min(indMult, 1.15);
  }

  let salary = BASE_SALARY * expMult * eduMult * roleMult * locMult * compMult * indMult * workMult;

  let skillBonus = input.skills.reduce((sum, skill) => sum + (SKILL_BONUS[skill] ?? 1500), 0);
  if (input.experience <= 2) {
    skillBonus = Math.min(skillBonus, salary * 0.15);
  }
  salary += skillBonus;

  // Sanity caps for junior profiles (industry-standard reality check)
  if (input.experience <= 1 && input.education === "High School") {
    salary = Math.min(salary, 70000) * 0.65;
  } else if (input.experience <= 1) {
    salary = Math.min(salary, 95000);
  } else if (input.experience <= 2) {
    salary = Math.min(salary, 110000) * 0.75;
  } else if (input.experience <= 3) {
    salary = Math.min(salary, 115000) * 0.70;
  }

  // Add some controlled randomness for realism
  const noise = 1 + (Math.random() * 0.04 - 0.02);
  salary *= noise;

  const predicted = Math.round(salary / 100) * 100;
  const variance = 0.12 + Math.random() * 0.06;

  // Realistic confidence based on experience level
  let confidence: number;
  if (input.experience <= 1) {
    confidence = 50 + input.skills.length * 1.5;
  } else if (input.experience <= 2) {
    confidence = 55 + input.skills.length * 1.5;
  } else if (input.experience <= 3) {
    confidence = 58 + input.skills.length * 1.5;
  } else if (input.experience <= 5) {
    confidence = 78 + input.skills.length * 1.5;
  } else {
    confidence = 85 + input.skills.length * 1;
  }
  confidence = Math.min(95, Math.round(confidence));

  // Realistic factor impacts — cap experience impact for juniors
  const expImpact = input.experience <= 1
    ? Math.min((expMult - 1) * 100, 10)
    : (expMult - 1) * 100;

  const factors = [
    { name: "Experience", impact: expImpact },
    { name: "Education", impact: (eduMult - 1) * 100 },
    { name: "Job Role", impact: (roleMult - 1) * 100 },
    { name: "Location", impact: (locMult - 1) * 100 },
    { name: "Company Type", impact: (compMult - 1) * 100 },
    { name: "Industry", impact: (indMult - 1) * 100 },
    { name: "Skills", impact: salary > 0 ? (skillBonus / salary) * 100 : 0 },
  ].sort((a, b) => Math.abs(b.impact) - Math.abs(a.impact));

  return {
    predictedSalary: predicted,
    minSalary: Math.round((predicted * (1 - variance)) / 100) * 100,
    maxSalary: Math.round((predicted * (1 + variance)) / 100) * 100,
    confidence,
    factors,
  };
}

function getExperienceKey(years: number): string {
  if (years < 1) return "0-1";
  if (years < 3) return "1-3";
  if (years < 5) return "3-5";
  if (years < 8) return "5-8";
  if (years < 12) return "8-12";
  return "12+";
}

export const SKILLS_OPTIONS = Object.keys(SKILL_BONUS);
export const EDUCATION_OPTIONS = Object.keys(EDUCATION_MULTIPLIER);
export const ROLE_OPTIONS = Object.keys(ROLE_MULTIPLIER);
export const LOCATION_OPTIONS = Object.keys(LOCATION_MULTIPLIER);
export const COMPANY_OPTIONS = Object.keys(COMPANY_MULTIPLIER);
export const INDUSTRY_OPTIONS = Object.keys(INDUSTRY_MULTIPLIER);
export const WORK_MODE_OPTIONS = Object.keys(WORK_MODE_MULTIPLIER);
