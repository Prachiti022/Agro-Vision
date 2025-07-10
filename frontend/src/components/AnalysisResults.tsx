import {
  Sprout, Droplets, Sun, Leaf, Calendar, Target, Globe, CloudSun, IndianRupee,
} from "lucide-react";
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisResultsProps {
  result: {
    land_type: string;
    greenness_index: number;
    weather: {
      temperature: number;
      humidity: number;
      precipitation: number;
    };
    suggestions: string[];
    cost_estimate: Record<string, number>;
  };
}

export const AnalysisResults = ({ result }: AnalysisResultsProps) => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-green-800 mb-2">Analysis Complete!</h3>
        <p className="text-gray-600">Here are your personalized sustainable recommendations</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Land Type */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-700" />
              <span>Land Type</span>
            </CardTitle>
            <CardDescription>Recognized terrain or soil surface</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 font-medium capitalize">{result.land_type}</p>
          </CardContent>
        </Card>

        {/* Greenness Index */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-500" />
              <span>Greenness Index</span>
            </CardTitle>
            <CardDescription>Vegetation density from satellite/photo</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 font-semibold">{result.greenness_index.toFixed(2)} / 1.00</p>
          </CardContent>
        </Card>

        {/* Weather Conditions */}
        <Card className="hover:shadow-lg transition-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CloudSun className="h-5 w-5 text-yellow-500" />
              <span>Weather Overview</span>
            </CardTitle>
            <CardDescription>Based on coordinates & current location</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              <li><strong>Temperature:</strong> {result.weather.temperature} °C</li>
              <li><strong>Humidity:</strong> {result.weather.humidity} %</li>
              <li><strong>Precipitation:</strong> {result.weather.precipitation} mm</li>
            </ul>
          </CardContent>
        </Card>

        {/* Sustainable Suggestions */}
        <Card className="hover:shadow-lg transition-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sprout className="h-5 w-5 text-green-700" />
              <span>Sustainable Practices</span>
            </CardTitle>
            <CardDescription>Eco-friendly strategies based on terrain</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {result.suggestions.map((method, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <Target className="h-4 w-4 text-green-500" />
                  <span className="text-gray-700">{method}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Cost Estimate */}
        <Card className="hover:shadow-lg transition-shadow md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <IndianRupee className="h-5 w-5 text-emerald-600" />
              <span>Estimated Costs</span>
            </CardTitle>
            <CardDescription>Approximate breakdown of setup cost (in ₹)</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-gray-700">
              {Object.entries(result.cost_estimate).map(([item, cost], i) => (
                <li key={i}>
                  <strong>{item}:</strong> ₹{cost.toLocaleString()}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
