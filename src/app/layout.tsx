import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ReactNode } from "react";
import "@radix-ui/themes/styles.css";
import { Flex, Theme } from "@radix-ui/themes";
import { ClientToaster } from "@/app/toast";

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"]
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"]
});

export const metadata: Metadata = {
    title: "NoEmoji",
    description: "An emoji app."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode; }>) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Theme appearance="dark">
            <Flex minHeight="100vh" justify="center" align="center">
                {children}
            </Flex>
            <ClientToaster/>
        </Theme>
        </body>
        </html>
    );
}
