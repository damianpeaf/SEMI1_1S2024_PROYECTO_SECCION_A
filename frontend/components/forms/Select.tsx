import {
  SelectItem,
  Select as NextUISelect,
  SelectItemProps,
  SelectProps as NextUISelectProps,
} from "@nextui-org/react";
interface Option extends Omit<SelectItemProps, "children"> {
  label: string;
}

interface SelectProps extends Omit<NextUISelectProps, "children"> {
  options: Option[];
}

export const Select = ({ options, ...props }: SelectProps) => {
  return (
    <NextUISelect {...props}>
      {options.map(({ label, ...itemProps }, index) => (
        <SelectItem {...itemProps} key={`${itemProps.key}-${index}`}>
          {label}
        </SelectItem>
      ))}
    </NextUISelect>
  );
};
