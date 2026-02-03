import { LoggedInHeader } from "@/_components/loggedIn.header";
import { Wrap } from "@repo/shared/ui/server";

export default function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <LoggedInHeader />
      <div className="flex-1 overflow-y-auto py-5">{children}</div>
    </div>
  );
}
