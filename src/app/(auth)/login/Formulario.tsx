"use client";

import Image from "next/image";
import Logo from "../../../../public/logo.png";
import Link from "next/link";
import Github from "@/app/components/icons/Github";
import Linkedin from "@/app/components/icons/Linkedin";
import { useState } from "react";
import useScreen from "@/app/hooks/useScreen";


const socialLinks = [
  { name: "Github", icon: <Github />, href: "#" },
  { name: "Linkedin", icon: <Linkedin />, href: "#" },
];


export default function Formulario() {
  const [isSignUp, setIsSignUp] = useState(false);
  const isLargeScreen = useScreen(1024, 'min');
  const styleSing = `w-full sm:w-[85%] mx-auto h-full top-0 lg:w-1/2 flex items-center justify-center transition-all duration-700 ease-in-out z-20 `
  const styleOverlay = `absolute top-0 left-0 h-full w-full flex items-center justify-center transition-opacity duration-300 ease-in-out`

  return (
    <div className="relative h-screen w-full bg-white overflow-hidden">
      <Image src={Logo} alt="Logo" width={50} className="absolute top-0 left-0 m-6" />
      <div
        className={`
          ${styleSing} lg:absolute  left-1/2 
          ${isSignUp ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}`}
      >
        <SignUpForm />
      </div>
      <div
        className={`
           ${styleSing} absolute left-0 right-0 lg:right-auto
          ${isSignUp ? "-translate-x-full opacity-0" : "translate-x-0 opacity-100"} `}
      >
        <SignInForm />
      </div>

      {isLargeScreen && (
        <div
          className={`
          absolute top-0 left-1/2 w-1/2 h-full
          transition-all duration-700 ease-in-out z-30
          pointer-events-none
          ${isSignUp ? "-translate-x-full" : "translate-x-0"}
        `}
          style={{
            borderRadius: isSignUp ? "0 250px 200px 0" : "250px 0 0 200px",
            backgroundImage:
              "linear-gradient(to bottom, #4274CC, #6A8DFF, #4274CC)",
          }}
        >
          <div
            className={` ${styleOverlay} ${isSignUp ? "opacity-0" : "opacity-100"}`}
          >
            <OverlayContent
              title="Hello, Friend"
              description="Register with your personal details to use all of site features"
              buttonText="Sign Up"
              onClick={() => setIsSignUp(true)}
            />
          </div>
          <div
            className={` ${styleOverlay} ${isSignUp ? "opacity-100" : "opacity-0"}`}
          >
            <OverlayContent
              title="Bem vindo de volta!"
              description="Que bom te ver de novo! Faça login com seus dados para continuar conectado com a gente."
              buttonText="Sign In"
              onClick={() => setIsSignUp(false)}
            />

          </div>
        </div>
      )}
    </div>
  );
}

const SignInForm = () => (
  <form
    className="w-[80%] lg:w-[60%] mx-auto text-center relative"
    onSubmit={(e) => e.preventDefault()}
  >
    <h1 className="text-5xl font-semibold mb-5">Criar conta</h1>
    <SocialIcons />
    <p className="text-zinc-500 my-4">Preencha seus dados para criar sua conta e acessar o painel</p>
    <div className="w-full flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Email"
        className="block w-full border border-slate-300/70 rounded-md bg-[#EDEDED] px-4 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        className="block w-full border border-slate-300/70 rounded-md bg-[#EDEDED] px-4 py-2"
      />
      {/* <Link href="#" className="text-zinc-500"> Forgot Your Password?</Link> */}
      <Link href="#" className="bg-secondary-500 text-white px-12 py-2 rounded-md text-center w-full uppercase font-semibold">
        Sign Up
      </Link>
    </div>
    <SocialLoginOptions />
  </form>
);

const SignUpForm = () => (
  <form
    className="w-[80%] lg:w-[60%] mx-auto text-center"
    onSubmit={(e) => e.preventDefault()}
  >
    <h1 className="text-5xl font-semibold mb-5">Fazer Login</h1>
    <SocialIcons />
    <p className="text-zinc-500 my-4">Use o nome da sua empresa/email para entrar</p>
    <div className="w-full flex flex-col items-center gap-4">
      <input
        type="text"
        placeholder="Name"
        className="block w-full border border-slate-300/70 rounded-md bg-[#EDEDED] px-4 py-2"
      />
      <input
        type="text"
        placeholder="Email"
        className="block w-full border border-slate-300/70 rounded-md bg-[#EDEDED] px-4 py-2"
      />
      <input
        type="password"
        placeholder="Password"
        className="block w-full border border-slate-300/70 rounded-md bg-[#EDEDED] px-4 py-2"
      />
      <Link href="#" className="bg-secondary-500 text-white px-12 py-2 rounded-md text-center w-full uppercase font-semibold"
      >
        Sign Up
      </Link>
    </div>
    <SocialLoginOptions />
  </form>
);

interface OverlayContentProps {
  title: string;
  description: string;
  buttonText: string;
  onClick: () => void;
}

const OverlayContent = ({ title, description, buttonText, onClick }: OverlayContentProps) => (
  <div className="w-[70%] mx-auto text-center text-white pointer-events-auto z-40 "> {/* z-40 (Acima do Overlay z-30) */}
    <h1 className="text-6xl font-semibold">{title}</h1>
    <p className="mt-6 mb-8 text-2xl">{description}</p>
    <button
      onClick={onClick}
      className="border px-16 py-2 rounded-md block w-fit mx-auto font-semibold uppercase hover:bg-white hover:text-secondary-500 transition-all ease-in-out duration-500 cursor-pointer"
    >
      {buttonText}
    </button>
  </div>
);

const SocialIcons = () => (
  <ul className="flex items-center justify-center gap-4">
    {socialLinks.map(({ name, icon, href }) => (
      <li key={name} className="border border-zinc-300 px-3 py-2 rounded-md">
        <Link href={href}>{icon}</Link>
      </li>
    ))}
  </ul>
);

const SocialLoginOptions = () => (
  <>
    <div className="flex items-center justify-center w-full gap-4 my-6">
      <div className="bg-zinc-300 h-px grow"></div>
      <div className="text-zinc-500 font-semibold">
        ou
      </div>
      <div className="bg-zinc-300 h-px grow"></div>
    </div>
    <div className="flex w-full mb-6">
      <Link
        href="/"
        className="text-black border-2 rounded-md w-full text-center py-2 border-slate-200"
      >
        Entrar como visitante
      </Link>
    </div>
    <p className="text-zinc-500">
      Ao continuar você concorda com os termos de serviço
    </p>
  </>
);