import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";
import { Control } from "react-hook-form";
import {
  Select as CNSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type RootProps = {
  control: Control<any, any, any>;
  name: string;
  label: string;
  placeholder: string;
  className?: string;
  required?: boolean;
} & PropsWithChildren;

function Root({
  control,
  name,
  className,
  placeholder,
  label,
  children,
  required,
}: RootProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="block text-sm font-medium text-primary">
            {label}
          </FormLabel>
          <CNSelect
            value={field.value || ""}
            onValueChange={field.onChange}
            required={required}
          >
            <FormControl>
              <SelectTrigger className={cn("mt-1 w-full ", className)}>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            {children}
          </CNSelect>
        </FormItem>
      )}
    />
  );
}

type ItemsProps = PropsWithChildren;

function Items({ children }: ItemsProps) {
  return <SelectContent>{children}</SelectContent>;
}

type ItemProps = {
  value: string;
  label: string;
};

function Item({ value, label }: ItemProps) {
  return <SelectItem value={value}>{label}</SelectItem>;
}

export const Select = {
  Root,
  Items,
  Item,
};
