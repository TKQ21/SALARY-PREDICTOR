import React, { createContext, useContext, useState, useCallback } from "react";
import { PredictionInput, PredictionResult } from "@/lib/prediction-engine";

interface PredictionHistory {
  id: string;
  input: PredictionInput;
  result: PredictionResult;
  date: string;
}

interface AppContextType {
  user: { email: string; role: string } | null;
  login: (email: string, password: string) => boolean;
  register: (email: string, password: string) => boolean;
  logout: () => void;
  predictions: PredictionHistory[];
  addPrediction: (input: PredictionInput, result: PredictionResult) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const DEMO_USERS = [
  { email: "admin@salaryvision.ai", password: "admin123", role: "ADMIN" },
  { email: "user@salaryvision.ai", password: "user123", role: "USER" },
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<{ email: string; role: string } | null>(null);
  const [users, setUsers] = useState(DEMO_USERS);
  const [predictions, setPredictions] = useState<PredictionHistory[]>([]);

  const login = useCallback((email: string, password: string) => {
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      setUser({ email: found.email, role: found.role });
      return true;
    }
    return false;
  }, [users]);

  const register = useCallback((email: string, password: string) => {
    if (users.find(u => u.email === email)) return false;
    setUsers(prev => [...prev, { email, password, role: "USER" }]);
    setUser({ email, role: "USER" });
    return true;
  }, [users]);

  const logout = useCallback(() => setUser(null), []);

  const addPrediction = useCallback((input: PredictionInput, result: PredictionResult) => {
    setPredictions(prev => [
      { id: Date.now().toString(), input, result, date: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  return (
    <AppContext.Provider value={{ user, login, register, logout, predictions, addPrediction }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
