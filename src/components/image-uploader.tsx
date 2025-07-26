"use client";

import { useState, useCallback, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UploadCloud, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onUpload: (files: File[]) => void;
  isAnalyzing: boolean;
}

const MAX_FILES = 10;
const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ACCEPTED_FORMATS = ["image/jpeg", "image/png", "image/webp"];

export function ImageUploader({ onUpload, isAnalyzing }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    
    if (fileList.length > MAX_FILES) {
      toast({ variant: "destructive", title: "Too many files", description: `You can upload a maximum of ${MAX_FILES} images at a time.` });
      return;
    }

    const validFiles = fileList.filter(file => {
      if (!ACCEPTED_FORMATS.includes(file.type)) {
        toast({ variant: "destructive", title: "Invalid file type", description: `${file.name} is not a supported format.` });
        return false;
      }
      if (file.size > MAX_SIZE_BYTES) {
        toast({ variant: "destructive", title: "File too large", description: `${file.name} exceeds the ${MAX_SIZE_MB}MB size limit.` });
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      onUpload(validFiles);
    }
  }, [onUpload, toast]);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  return (
    <div
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors duration-300 ${isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
    >
      <input
        id="file-upload"
        type="file"
        multiple
        accept={ACCEPTED_FORMATS.join(',')}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={isAnalyzing}
      />
      <div className="flex flex-col items-center gap-4">
        {isAnalyzing ? (
            <>
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <h3 className="text-lg font-medium text-primary">Analyzing...</h3>
                <p className="text-muted-foreground">Please wait while we work our magic.</p>
            </>
        ) : (
            <>
                <UploadCloud className="h-12 w-12 text-primary" />
                <h3 className="text-lg font-medium">Drag & drop images here</h3>
                <p className="text-muted-foreground">or</p>
                <Button asChild variant="outline" disabled={isAnalyzing}>
                    <label htmlFor="file-upload" className="cursor-pointer">
                        Click to select files
                    </label>
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Supports JPEG, PNG, WebP up to 10MB. Max 10 images.
                </p>
            </>
        )}
      </div>
    </div>
  );
}
