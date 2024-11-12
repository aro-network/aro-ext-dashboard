import { validateEmail, validateReferralCode } from "@/lib/validates";
import { Input, InputSlots, SlotsToClasses } from "@nextui-org/react";
import { RiEyeCloseLine, RiEyeLine } from "react-icons/ri";
import { useToggle } from "react-use";

const inputClassNames: SlotsToClasses<InputSlots> = {
  inputWrapper: "h-[45px]",
};

export function InputPassword({ setPassword, label, error }: { setPassword: (pass: string) => void; label?: string; error?: string }) {
  const [showPassword, toggleShowPassword] = useToggle(false);
  return (
    <Input
      isRequired
      classNames={inputClassNames}
      type={showPassword ? "text" : "password"}
      label={label || "Password"}
      // placeholder={label || "Password"}
      labelPlacement="inside"
      variant="bordered"
      endContent={
        <button className="focus:outline-none" type="button" onClick={() => toggleShowPassword()} aria-label="toggle password visibility">
          {showPassword ? <RiEyeLine className="text-2xl text-default-400 pointer-events-none" /> : <RiEyeCloseLine className="text-2xl text-default-400 pointer-events-none" />}
        </button>
      }
      errorMessage={error}
      onChange={(e) => setPassword(e.target.value)}
    />
  );
}

export function InputEmail({ setEmail }: { setEmail: (email: string) => void }) {
  return (
    <Input
      classNames={inputClassNames}
      type="email"
      label="Email"
      // placeholder="Email"
      labelPlacement="inside"
      variant="bordered"
      isRequired
      validate={validateEmail}
      onChange={(e) => setEmail(e.target.value)}
    />
  );
}

export function InputReferralCode({ setReferalCode }: { setReferalCode: (code: string) => void }) {
  return (
    <Input
      classNames={inputClassNames}
      type="text"
      label="Referral code"
      // placeholder="Referral code"
      labelPlacement="inside"
      variant="bordered"
      isRequired
      validate={validateReferralCode}
      onChange={(e) => setReferalCode(e.target.value)}
    />
  );
}
