import { LoggedInHeader } from "@/_components/loggedIn.header";

export default function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <LoggedInHeader />
      {children}
    </div>
  );
}
