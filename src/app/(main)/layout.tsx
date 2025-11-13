'use client'

import { useState } from "react";
import PageWrapper from "./PageWrapper";
import HamburgerButton from "../components/HamburgerButton";
import MenuMobile from "../components/MenuMobile";
import Logo from "../../../public/logo.png"
import Image from "next/image";
import useScreen from "../hooks/useScreen";

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleMenu = () => setIsOpen(prev => !prev);
    const isLargeScreen = useScreen(1024, 'min');

    return (
        <>
            {!isLargeScreen && (
                <>
                    <nav className="flex justify-between px-8 w-full pt-10 fixed z-50">
                        <Image src={Logo} alt="Logo" width={50} />
                        <HamburgerButton isOpen={isOpen} toggleMenu={toggleMenu} />
                        <MenuMobile isOpen={isOpen} toggleMenu={toggleMenu} />
                    </nav>
                </>
            )}
            <PageWrapper>
                {children}
            </PageWrapper>
        </>
    );
}
