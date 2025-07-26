import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ComponentProps } from "react";
import { Control } from "react-hook-form";

type TextAreaFieldProps = {
  control: Control<any, any, any>;
  name: string;
  label: string;
} & ComponentProps<"textarea">;

export function TextAreaField({
  control,
  name,
  className,
  placeholder,
  label,
  ...rest
}: TextAreaFieldProps) {
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
              <Textarea
                {...field}
                {...rest}
                value={field.value || ""}
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
