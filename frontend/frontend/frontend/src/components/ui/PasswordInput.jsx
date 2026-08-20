import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Input from "@/components/ui/Input";

export default function PasswordInput({ className = "", ...props }) {
  const [visible, setVisible] = useState(false);
  const id = useId();

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className={`pr-11 ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
        aria-pressed={visible}
        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-ink-700 transition-colors hover:text-ink-300"
      >
        {visible ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
