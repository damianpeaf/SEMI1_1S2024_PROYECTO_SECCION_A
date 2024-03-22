import {
  SelectItem,
  Select as NextUISelect,
  SelectItemProps,
  SelectProps as NextUISelectProps,
} from "@nextui-org/react";
import { Control, Controller } from "react-hook-form";
interface Option extends Omit<SelectItemProps, "children"> {
  label: string;
}

interface SelectProps extends Omit<NextUISelectProps, "children"> {
  options: Option[];
  control: Control<any>;
  name: string;
}

export const Select = ({ control, name, ...selectProps }: SelectProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <NextUISelect {...field} {...selectProps}>
          {selectProps.options.map(({ label, ...itemProps }, index) => (
            <SelectItem {...itemProps} key={`${itemProps.key}`}>
              {label}
            </SelectItem>
          ))}
        </NextUISelect>
      )}
    />
  );
};
