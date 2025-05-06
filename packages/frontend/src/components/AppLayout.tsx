import { ReactNode } from "@tanstack/react-router";

interface Props {
  children: ReactNode;
}

export const AppLayout = ({ children }: Props) => {
  return (
    <div className="text-center flex flex-col items-center justify-center h-screen w-[500px]">
      {children}
    </div>
  );
};
