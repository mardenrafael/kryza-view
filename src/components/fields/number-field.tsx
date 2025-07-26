import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Control } from "react-hook-form";

type NumberProps = {
  control: Control<any, any, any>;
  name: string;
  label: string;
} & ComponentProps<"input">;

export function NumberField({
  control,
  name,
  className,
  placeholder,
  label,
  ...rest
}: NumberProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="block text-sm font-medium text-primary">
              {label}
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                {...rest}
                value={field.value || ""}
                type="number"
                placeholder={placeholder}
                className={cn("mt-1", className)}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
