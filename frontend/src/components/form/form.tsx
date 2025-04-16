import "./form.css";
import { DOMAttributes, FC, PropsWithChildren } from "react";

interface FromProps {
  onSubmit: DOMAttributes<HTMLFormElement>["onSubmit"];
  error?: string;
}

export const Form: FC<PropsWithChildren<FromProps>> = ({
  children,
  onSubmit,
  error,
}) => {
  return (
    <div>
      <form className="form" onSubmit={onSubmit}>
        {error && <div className="error-message">{error}</div>}
        {children}
      </form>
    </div>
  );
};
