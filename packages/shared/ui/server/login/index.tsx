interface LoginLayoutComponentProps {
  children: React.ReactNode;
}

export function LoginLayoutComponent({ children }: LoginLayoutComponentProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 items-center">{children}</main>
    </div>
  );
}
