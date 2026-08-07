interface EnvConfig {
  apiUrl: string;
  nodeEnv: string;
  isDevelopment: boolean;
  isProduction: boolean;
}

const config: EnvConfig = {
  apiUrl: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  nodeEnv: import.meta.env.VITE_NODE_ENV || "development",
  isDevelopment: import.meta.env.VITE_NODE_ENV === "development",
  isProduction: import.meta.env.VITE_NODE_ENV === "production",
};

export default config;
