"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ColorPickerProps {
  value?: string;
  onChange: (color: string) => void;
  label?: string;
  placeholder?: string;
}

export function ColorPicker({ value = "#000000", onChange, label, placeholder }: ColorPickerProps) {
  const [color, setColor] = useState(value);

  const handleColorChange = (newColor: string) => {
    setColor(newColor);
    onChange(newColor);
  };

  const presetColors = [
    "#000000", "#ffffff", "#3b82f6", "#ef4444", "#10b981", "#f59e0b",
    "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16", "#f97316", "#6366f1"
  ];

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <div className="space-y-2">
        <div className="flex gap-2">
          <Input
            type="color"
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-16 h-10 p-1"
          />
          <Input
            value={color}
            onChange={(e) => handleColorChange(e.target.value)}
            placeholder={placeholder || "#000000"}
            className="flex-1"
          />
        </div>
        <div className="grid grid-cols-6 gap-2">
          {presetColors.map((presetColor) => (
            <button
              key={presetColor}
              type="button"
              className="w-8 h-8 rounded border-2 border-gray-300 hover:border-gray-400 transition-colors"
              style={{ backgroundColor: presetColor }}
              onClick={() => handleColorChange(presetColor)}
            />
          ))}
        </div>
      </div>
    </div>
  );
} 