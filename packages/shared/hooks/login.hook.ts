import { useForm } from "react-hook-form";

interface LoginFormData {
  email: string;
}

export function useLogin() {
  const form = useForm<LoginFormData>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const validateEmail = (email: string) => {
    if (!email) {
      return "이메일을 입력해 주세요.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "올바른 이메일 형식을 입력해 주세요.";
    }
    return true;
  };

  const handleOnSubmit = (onSubmitFn: (data: LoginFormData) => void) =>
    form.handleSubmit((data) => {
      onSubmitFn(data);
    });

  return {
    form,
    handleOnSubmit,
    validateEmail,
  };
}
