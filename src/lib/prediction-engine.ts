// Client-side salary prediction engine
// Uses role-specific base salaries with additive bonus factors based on real-world salary data

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

// Role-specific base salaries (industry standard)
const BASE_SALARY: Record<string, number> = {
  "Frontend Developer": 65000,
  "Backend Developer": 70000,
  "Full Stack Developer": 75000,
  "Software Engineer": 70000,
  "Senior Software Engineer": 95000,
  "Staff Engineer": 120000,
  "Principal Engineer": 140000,
  "ML Engineer": 90000,
  "Data Scientist": 85000,
  "AI Engineer": 95000,
  "Data Engineer": 88000,
  "DevOps Engineer": 85000,
  "Cloud Engineer": 90000,
  "Site Reliability Engineer": 95000,
  "Mobile App Developer": 70000,
  "Game Developer": 72000,
  "QA Engineer": 60000,
  "Automation Engineer": 70000,
  "Security Engineer": 95000,
  "Blockchain Developer": 90000,
};

const DEFAULT_BASE_SALARY = 70000;

const EXPERIENCE_BONUS: Record<string, number> = {
  "0-1": 0.0,
  "1-3": 0.10,
  "3-5": 0.25,
  "5-8": 0.45,
  "8-12": 0.70,
  "12+": 1.0,
};

const EDUCATION_BONUS: Record<string, number> = {
  "High School": -0.10,
  "Associate": -0.05,
  "Bachelor's": 0.0,
  "Master's": 0.12,
  "PhD": 0.22,
  "Bootcamp": -0.05,
};

const ROLE_BONUS: Record<string, number> = {
  "Frontend Developer": 0.0,
  "Backend Developer": 0.05,
  "Full Stack Developer": 0.08,
  "Software Engineer": 0.05,
  "Senior Software Engineer": 0.10,
  "Staff Engineer": 0.12,
  "Principal Engineer": 0.15,
  "ML Engineer": 0.15,
  "Data Scientist": 0.12,
  "AI Engineer": 0.18,
  "Data Engineer": 0.10,
  "DevOps Engineer": 0.08,
  "Cloud Engineer": 0.10,
  "Site Reliability Engineer": 0.12,
  "Mobile App Developer": 0.05,
  "Game Developer": 0.03,
  "QA Engineer": 0.0,
  "Automation Engineer": 0.05,
  "Security Engineer": 0.12,
  "Blockchain Developer": 0.10,
};

const LOCATION_BONUS: Record<string, number> = {
  "San Francisco": 0.45,
  "New York": 0.35,
  "Seattle": 0.30,
  "Austin": 0.12,
  "Chicago": 0.08,
  "Denver": 0.08,
  "Boston": 0.25,
  "Los Angeles": 0.20,
  "London": 0.25,
  "Berlin": 0.05,
  "Bangalore": -0.40,
  "Toronto": -0.10,
  "Remote": 0.10,
  "Other": 0.0,
};

const COMPANY_BONUS: Record<string, number> = {
  "Startup": -0.05,
  "Mid-size": 0.05,
  "Enterprise": 0.15,
  "FAANG": 0.50,
  "Consulting": 0.08,
  "Freelance": -0.05,
};

const INDUSTRY_BONUS: Record<string, number> = {
  "Tech": 0.15,
  "Finance": 0.20,
  "Healthcare": 0.05,
  "E-commerce": 0.08,
  "Gaming": 0.05,
  "Education": -0.10,
  "Government": -0.08,
  "AI/ML": 0.25,
};

const WORK_MODE_BONUS: Record<string, number> = {
  "Remote": 0.03,
  "Onsite": 0.0,
  "Hybrid": 0.01,
};

const SKILL_VALUE: Record<string, number> = {
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
  const role = input.jobRole.trim();
  const baseSalary = BASE_SALARY[role] ?? DEFAULT_BASE_SALARY;

  const expKey = getExperienceKey(input.experience);
  const expBonus = EXPERIENCE_BONUS[expKey] ?? 0;
  let eduBonus = EDUCATION_BONUS[input.education] ?? 0;
  const roleBonus = ROLE_BONUS[role] ?? 0;
  let locBonus = LOCATION_BONUS[input.location] ?? 0;
  const compBonus = COMPANY_BONUS[input.companyType] ?? 0;
  let indBonus = INDUSTRY_BONUS[input.industry] ?? 0;
  const workBonus = WORK_MODE_BONUS[input.workMode] ?? 0;

  // Frontend Developer: cap education bonus (Master's doesn't boost as much)
  if (role === "Frontend Developer" && eduBonus > 0.12) {
    eduBonus = 0.12;
  }

  // Cap bonuses for junior profiles (≤2 years)
  if (input.experience <= 2) {
    locBonus = Math.min(locBonus, 0.12);
    indBonus = Math.min(indBonus, 0.15);
  }

  // Additive bonus formula: base * (1 + sum of bonuses)
  let salary = baseSalary * (
    1 +
    expBonus +
    eduBonus +
    roleBonus +
    locBonus +
    compBonus +
    indBonus +
    workBonus
  );

  // Skill bonus (additive flat values)
  let skillBonus = input.skills.reduce((sum, skill) => sum + (SKILL_VALUE[skill] ?? 1500), 0);
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

  // Factor impacts (percentage contribution)
  const expImpact = input.experience <= 1
    ? Math.min(expBonus * 100, 10)
    : expBonus * 100;

  const factors = [
    { name: "Experience", impact: expImpact },
    { name: "Education", impact: eduBonus * 100 },
    { name: "Job Role", impact: roleBonus * 100 },
    { name: "Location", impact: locBonus * 100 },
    { name: "Company Type", impact: compBonus * 100 },
    { name: "Industry", impact: indBonus * 100 },
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

export const SKILLS_OPTIONS = Object.keys(SKILL_VALUE);
export const EDUCATION_OPTIONS = Object.keys(EDUCATION_BONUS);
export const ROLE_OPTIONS = Object.keys(BASE_SALARY);
export const LOCATION_OPTIONS = Object.keys(LOCATION_BONUS);
export const COMPANY_OPTIONS = Object.keys(COMPANY_BONUS);
export const INDUSTRY_OPTIONS = Object.keys(INDUSTRY_BONUS);
export const WORK_MODE_OPTIONS = Object.keys(WORK_MODE_BONUS);
