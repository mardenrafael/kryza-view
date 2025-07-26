"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { api } from "@/lib/api";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Image {
  id: string;
  url: string;
  description?: string;
}

interface ImageGalleryWithRemoveProps {
  images: Image[];
  orderId: string;
  canRemove?: boolean;
  onImageRemoved?: (imageId: string) => void;
  trigger?: React.ReactNode;
}

export function ImageGalleryWithRemove({
  images,
  orderId,
  canRemove = false,
  onImageRemoved,
  trigger,
}: ImageGalleryWithRemoveProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [removingImage, setRemovingImage] = useState<string | null>(null);

  const handleRemoveImage = async (imageId: string) => {
    if (!canRemove) return;

    setRemovingImage(imageId);
    try {
      const response = await api.delete(`/api/pedido/${orderId}/image/${imageId}`);
      
      if (response.status === 200) {
        toast.success("Imagem removida com sucesso");
        onImageRemoved?.(imageId);
        
        // Se a imagem removida era a atual, vai para a próxima ou fecha o modal
        const removedIndex = images.findIndex(img => img.id === imageId);
        if (removedIndex === currentImageIndex) {
          if (images.length === 1) {
            setIsOpen(false);
          } else if (currentImageIndex === images.length - 1) {
            setCurrentImageIndex(currentImageIndex - 1);
          }
        }
      }
    } catch (error) {
      console.error("Erro ao remover imagem:", error);
      toast.error("Erro ao remover imagem");
    }
    setRemovingImage(null);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const previousImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      {trigger ? (
        <div onClick={() => setIsOpen(true)}>{trigger}</div>
      ) : (
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Visualizar {images.length} Imagem(ns)
        </Button>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>
                Imagem {currentImageIndex + 1} de {images.length}
              </span>
              {canRemove && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveImage(images[currentImageIndex].id)}
                  disabled={removingImage === images[currentImageIndex].id}
                >
                  {removingImage === images[currentImageIndex].id ? (
                    "Removendo..."
                  ) : (
                    <>
                      <X className="h-4 w-4 mr-2" />
                      Remover
                    </>
                  )}
                </Button>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="relative flex items-center justify-center min-h-[400px]">
            {images.length > 1 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute left-4 z-10"
                  onClick={previousImage}
                >
                  ‹
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute right-4 z-10"
                  onClick={nextImage}
                >
                  ›
                </Button>
              </>
            )}

            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={images[currentImageIndex].url}
                alt={images[currentImageIndex].description || "Imagem do imóvel"}
                className="max-w-full max-h-full object-contain rounded-lg"
              />
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex
                      ? "bg-primary"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 