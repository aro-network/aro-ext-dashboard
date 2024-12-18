import { Button, ButtonProps, cn } from "@nextui-org/react";
import { HelpTip } from "./tips";
import { ReactNode } from "react";

export function Btn({ children, isDisabled, className, ...props }: ButtonProps) {
  return (
    <Button isDisabled={isDisabled} color="primary" className={cn("flip_item h-[2.125rem] text-xs font-medium rounded-full hover:bg-default", props.color == "default" ? "hover:bg-l1" : "", className)} {...props}>
      {children}
    </Button>
  );
}
export function TransBtn({ children, className, ...props }: ButtonProps) {
  return (
    <Button color="primary" className={cn("flip_item h-[2.625rem] bg-l1 shadow-1 backdrop-blur-lg hover:bg-primary", className)} {...props}>
      {children}
    </Button>
  );
}

export function IconBtn({ children, className, tip, ...props }: ButtonProps & { tip: ReactNode }) {
  return (
    <HelpTip content={tip}>
      <Button color="primary" className={cn("flip_item h-8 w-8 min-w-8 max-w-8 rounded-full p-0 hover:bg-default", className)} {...props}>
        {children}
      </Button>
    </HelpTip>
  );
}
