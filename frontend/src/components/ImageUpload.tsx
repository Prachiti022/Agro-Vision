import { useState, useRef } from "react";
import { Upload, Image as ImageIcon, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { AnalysisResult } from "@/types/analysis";

interface ImageUploadProps {
  selectedImage: File | null;
  onImageSelect: (file: File | null) => void;
  onAnalysisComplete: (result: AnalysisResult | null) => void;
}

export const ImageUpload = ({
  selectedImage,
  onImageSelect,
  onAnalysisComplete,
}: ImageUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) handleFile(files[0]);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) handleFile(files[0]);
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      onImageSelect(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeImage = () => {
    onImageSelect(null);
    onAnalysisComplete(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;

    setLoading(true);
    toast("Analyzing your land...");

    const formData = new FormData();
    formData.append("file", selectedImage);

    try {
      const res = await fetch("http://localhost:8000/analyze", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to analyze image");
      }

      const result = await res.json();

      const formattedResult: AnalysisResult = {
        land_type: result.land_type,
        greenness_index: result.greenness_index,
        weather: {
          temperature: result.weather.temperature,
          humidity: result.weather.humidity,
          description: result.weather.description,
          precipitation: result.weather.precipitation || 0,
        },
        suggestions: result.suggestions,
        cost_estimate: Object.fromEntries(result.costs || []),
      };

      toast.success("Analysis complete!");
      onAnalysisComplete(formattedResult);
    } catch (error) {
  const message = error instanceof Error ? error.message : "Unknown error";
  console.error("Error analyzing image:", error);
  toast.error("Analysis failed: " + message);
  onAnalysisComplete(null);
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        title="Upload land image"
      />

      {selectedImage ? (
        <Card className="relative p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <ImageIcon className="h-5 w-5 text-green-600" />
              <span className="font-medium">{selectedImage.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={removeImage}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex justify-center">
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Selected land"
              className="max-h-64 max-w-full object-contain rounded-lg shadow-md"
            />
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze Land"
              )}
            </Button>
          </div>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed p-8 text-center cursor-pointer transition-colors ${
            dragActive
              ? "border-green-500 bg-green-50"
              : "border-gray-300 hover:border-green-400 hover:bg-green-50"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-green-100 rounded-full">
              <Upload className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700">
                Upload Land Image
              </h3>
              <p className="text-gray-500 mt-1">
                Drag and drop your image here, or click to select
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Supports JPG, PNG, and other image formats
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
