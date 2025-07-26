"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Upload, X } from "lucide-react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface UploadedImage {
  id: string;
  url: string;
  originalName: string;
  size: number;
  type: string;
}

interface ImageUploadProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  maxFiles?: number;
  className?: string;
}

export function ImageUpload({ onImagesUploaded, maxFiles = 5, className }: ImageUploadProps) {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log("📁 Arquivos aceitos:", acceptedFiles);
    console.log("📊 Imagens já carregadas:", uploadedImages.length);
    console.log("📈 Máximo permitido:", maxFiles);
    
    if (uploadedImages.length + acceptedFiles.length > maxFiles) {
      toast.error(`Máximo de ${maxFiles} imagens permitido`);
      return;
    }

    setUploading(true);
    const formData = new FormData();
    
    acceptedFiles.forEach((file) => {
      formData.append("files", file);
      console.log("📎 Adicionando arquivo ao FormData:", file.name);
    });

    try {
      console.log("🚀 Iniciando upload para /api/upload");
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro no upload");
      }

      const data = await response.json();
      console.log("✅ Resposta do upload:", data);
      
      const newImages = [...uploadedImages, ...data.images];
      console.log("🖼️ Novas imagens após upload:", newImages);
      
      setUploadedImages(newImages);
      onImagesUploaded(newImages);
      toast.success(`${acceptedFiles.length} imagem(ns) enviada(s) com sucesso!`);
    } catch (error) {
      console.error("❌ Erro no upload:", error);
      toast.error("Erro ao enviar imagens");
    } finally {
      setUploading(false);
    }
  }, [uploadedImages, maxFiles, onImagesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp"],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
  });

  const removeImage = (imageId: string) => {
    const newImages = uploadedImages.filter((img) => img.id !== imageId);
    setUploadedImages(newImages);
    onImagesUploaded(newImages);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p className="text-primary font-medium">Solte as imagens aqui...</p>
        ) : (
          <div>
            <p className="text-muted-foreground mb-2">
              Arraste e solte imagens aqui, ou clique para selecionar
            </p>
            <p className="text-sm text-muted-foreground">
              Máximo {maxFiles} imagens, 5MB cada
            </p>
          </div>
        )}
      </div>

      {uploading && (
        <div className="text-center py-4">
          <p className="text-muted-foreground">Enviando imagens...</p>
        </div>
      )}

      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image) => (
            <Card key={image.id} className="relative group overflow-hidden">
              <div className="aspect-square relative">
                <img
                  src={image.url}
                  alt={image.originalName}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => removeImage(image.id)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs text-muted-foreground truncate">
                  {image.originalName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(image.size)}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
} 