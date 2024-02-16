import { Input, InputProps } from "@nextui-org/react"
import { forwardRef, useState } from "react"
import { EyeFilledIcon, EyeSlashFilledIcon } from "../svgs"

// eslint-disable-next-line react/display-name
export const PasswordInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    const [revealPassword, setRevealPassword] = useState(false)
    const toogle = () => setRevealPassword(!revealPassword)
    return (
        <Input
            {...props}
            ref={ref}
            endContent={
                <button className="focus:outline-none" type="button" onClick={toogle}>
                    {revealPassword ? (
                        <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    ) : (
                        <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                    )}
                </button>
            }
            type={revealPassword ? "text" : "password"}
        />
    )
})