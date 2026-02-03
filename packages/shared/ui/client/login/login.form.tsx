"use client";

import { useLogin } from "@repo/shared/hooks";
import { Input } from "../form/input";
import { FormLabel } from "../form/label";
import { SwitchOneLogo } from "../../server";

interface LoginFormProps {
  title: string;
  onSubmitFn: (data: { email: string }) => void;
}

export function LoginForm({ title, onSubmitFn }: LoginFormProps) {
  const { form, handleOnSubmit, validateEmail } = useLogin();
  const { errors } = form.formState;
  const emailValue = form.watch("email");

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8">
      <SwitchOneLogo size="3xl" className="md:mr-4" />

      <h2 className="mb-6 text-center text-2xl font-bold md:mb-8 md:text-3xl">
        {title}
      </h2>
      <form
        onSubmit={handleOnSubmit(onSubmitFn)}
        className="flex flex-col gap-4 md:gap-6"
      >
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            id="email"
            placeholder="아이디(이메일)를 입력해 주세요."
            {...form.register("email", {
              validate: validateEmail,
            })}
            error={!!errors.email}
            showClearButton
            hasValue={!!emailValue}
            onClear={() => form.setValue("email", "")}
          />
          {errors.email && (
            <p className="text-xs text-[#EF4444]">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          className="mt-2 w-full rounded-md bg-[#f7931a] py-2 text-sm font-medium text-white md:mt-4 md:py-3 md:text-base"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
