// hooks/use-form.ts
import { useState } from "react";

type ValidatorFn = (value: string) => string;

type Validators<T> = {
  [K in keyof T]: ValidatorFn;
};

type UseFormProps<T> = {
  initialValues: T;
  validators?: Validators<T>;
  onSubmit: (values: T) => Promise<void> | void;
};

export const useForm = <T extends Record<string, string>>({
  initialValues,
  validators = {} as Validators<T>,
  onSubmit,
}: UseFormProps<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [formError, setFormError] = useState("");

  const handleChange =
    (field: keyof T) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setValues((prev) => ({ ...prev, [field]: value }));

      if (validators[field]) {
        const error = validators[field](value);
        setErrors((prev) => ({ ...prev, [field]: error }));
      }
    };

  const handleBlur = (field: keyof T) => () => {
    if (validators[field]) {
      const error = validators[field](values[field]);
      setErrors((prev) => ({ ...prev, [field]: error }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const newErrors: Partial<Record<keyof T, string>> = {};
    for (const key in validators) {
      const error = validators[key](values[key]);
      if (error) {
        newErrors[key] = error;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        await onSubmit(values);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "An error occurred");
      }
    }
  };

  return {
    values,
    errors,
    formError,
    handleChange,
    handleBlur,
    handleSubmit,
    setValues,
    setErrors,
    setFormError,
  };
};
