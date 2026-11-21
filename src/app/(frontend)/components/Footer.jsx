"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer
      id="contact"
      className="w-full bg-[#010736] text-white pt-14 pb-10 px-6 md:px-24 border-t border-white/10"
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between gap-12">
        {/* Columna Marca */}
        <div className="space-y-4 max-w-xs">
          {/* AQUÍ ESTÁ EL LINK AL INICIO EN EL TÍTULO Y LOGO */}
          <Link
            href="/landingpage"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-block space-y-4 group cursor-pointer"
          >
            <h2 className="font-electrolize text-5xl font-normal tracking-wide group-hover:text-[#9FA1FF] transition-colors">
              Racoode
            </h2>
            <Image
              src="/images/racoode-logo.webp"
              alt="Racoode Mascot"
              width={180}
              height={120}
              className="w-44 h-auto object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          <p className="text-lg text-white/90 leading-snug">
            Sociedad de Alumnos de Ing en Desarrollo de Software
          </p>
        </div>

        {/* Columnas de Enlaces */}
        <div className="flex flex-wrap gap-12 md:gap-16">
          {/* Contact Us */}
          <div className="space-y-5">
            <h3 className="text-xl font-normal">Contact Us</h3>
            <ul className="space-y-4 text-[17px]">
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 hover:text-[#9FA1FF] transition-colors"
                >
                  <span className="w-8 h-8 rounded border border-white bg-white/5 flex items-center justify-center">
                    IG
                  </span>
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href="mailto:sads@iteso.mx"
                  className="flex items-center gap-3 hover:text-[#9FA1FF] transition-colors"
                >
                  <span className="w-8 h-8 rounded border border-white bg-white/5 flex items-center justify-center">
                    ✉
                  </span>
                  Outlook
                </a>
              </li>
            </ul>
          </div>

          {/* In this website */}
          <div className="space-y-5">
            <h3 className="text-xl font-normal">In this website</h3>
            <ul className="space-y-3 text-[17px]">
              <li>
                <Link
                  href="/landingpage"
                  onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                  className="hover:text-[#9FA1FF]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-[#9FA1FF]">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/calendar" className="hover:text-[#9FA1FF]">
                  Calendar
                </Link>
              </li>
              <li>
                <Link href="/forum" className="hover:text-[#9FA1FF]">
                  Forum
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#9FA1FF]">
                  About us
                </Link>
              </li>
            </ul>
          </div>

          {/* Other Website */}
          <div className="space-y-5">
            <h3 className="text-xl font-normal">Other Website</h3>
            <ul className="space-y-3 text-[17px]">
              <li>
                <a
                  href="#"
                  className="hover:text-[#9FA1FF] transition-colors"
                >
                  Synergy Lab
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Línea divisoria, Copyright y Logo ITESO */}
      <div className="max-w-6xl mx-auto mt-14 pt-8 border-t border-white/10 flex flex-col items-center gap-6">
        <p className="text-sm font-bold text-center">
          Copyright © 2026 racoode.com
        </p>
        <Image
          src="/images/iteso-logo.webp"
          alt="ITESO, Universidad Jesuita de Guadalajara"
          width={160}
          height={40}
          className="h-10 w-auto object-contain"
        />
      </div>
    </footer>
  );
}