import { Input as NextUIInput, InputProps } from "@nextui-org/react"
import { Controller, Control } from "react-hook-form"

type InputRHFProps = {
    control: Control<any>
    name: string
} & InputProps

export const Input = ({ control, name, ...inputProps }: InputRHFProps) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <NextUIInput {...field} {...inputProps} />
            )}
        />
    )
}