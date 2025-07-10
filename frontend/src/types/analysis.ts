export interface WeatherInfo {
  temperature: number;
  humidity: number;
  description: string;
  precipitation: number;
  wind_speed?: number;
}

export interface AnalysisResult {
  land_type: string;
  greenness_index: number;
  weather: {
    temperature: number;
    humidity: number;
    precipitation: number;
    description: string; // ✅ Required
  };
  suggestions: string[];
  cost_estimate: Record<string, number>;
}
