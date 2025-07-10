import { useState } from "react";
import { Leaf, Droplets, Sun, Sprout } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/ImageUpload";
import { AnalysisResults } from "@/components/AnalysisResults";
import { Separator } from "@/components/ui/separator";

import { AnalysisResult } from "@/types/analysis";


const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <header className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-2">
            <Leaf className="h-8 w-8 text-green-600" />
            <h1 className="text-2xl font-bold text-green-800">Sustainable Farming Advisory</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Transform Your Land with AI-Powered Insights
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload an image of your land and get personalized, sustainable farming recommendations 
            tailored to your specific conditions and environment.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Sprout className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Crop Suggestions</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Get personalized crop recommendations based on your land analysis</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Sun className="h-8 w-8 text-orange-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Soil Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Comprehensive soil health evaluation and improvement suggestions</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Leaf className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <CardTitle className="text-lg">Sustainable Methods</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Eco-friendly farming practices and techniques</CardDescription>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="text-center">
              <Droplets className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <CardTitle className="text-lg">Water Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Smart irrigation and water conservation strategies</CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-green-800">Land Analysis Tool</CardTitle>
              <CardDescription>Upload an image of your land to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ImageUpload
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
                onAnalysisComplete={setAnalysisResults}
              />

              {analysisResults && (
                <>
                  <Separator className="my-6" />
                  <AnalysisResults result={analysisResults} />
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
