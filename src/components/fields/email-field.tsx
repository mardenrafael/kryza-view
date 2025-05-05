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

type EmailFieldProps = {
  control: Control<any, any, any>;
  name?: string;
} & ComponentProps<"input">;

export function EmailField({
  control,
  name = "email",
  className,
  ...rest
}: EmailFieldProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel className="block text-sm font-medium text-primary">
              E-mail
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                {...rest}
                value={field.value || ""}
                type="email"
                placeholder="Digite seu e-mail"
                className={cn("mt-1", className)}
              />
            </FormControl>
          </FormItem>
        );
      }}
    />
  );
}
