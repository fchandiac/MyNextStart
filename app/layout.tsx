// app/layout.tsx
import MuiProvider from "../MUI/MuiProvider";
import { AlertProvider } from "@/context/AlertContext";
import RootWrapper from "./RootWrapper"; // 👈 Nuevo archivo que usará el hook y envolverá el resto
import { ReceptionDataProvider } from "@/context/ReceptionDataContext";
import { SessionProvider } from 'next-auth/react';
import '@/app/globals.css';

export const metadata = {
  title: "Paddy AyG",
  description: "Arrocera Aparicio y García Ltda.",
  icons: {
    icon: "/logo.ico",
    shortcut: "/logo.ico",
    apple: "/logo.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
        <MuiProvider>
          <AlertProvider>
            <RootWrapper>
              <ReceptionDataProvider>{children}</ReceptionDataProvider>
            </RootWrapper>
          </AlertProvider>
        </MuiProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
