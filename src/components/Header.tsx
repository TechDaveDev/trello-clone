"use client";

import { useState } from 'react';

import {
  LogOut,
  Info,
  Menu,
  X,
  User
} from 'lucide-react';

import { useAuth } from "@/context/AuthContext";
import ThemeSwitcher from "./ThemeSwitcher";

interface HeaderProps {
  onAboutClick: () => void;
  onLogoutConfirm: () => void;
}

export default function Header({ onAboutClick, onLogoutConfirm }: HeaderProps) {
  const { session } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-4 md:top-6 z-40 w-full border-b border-border rounded-xl bg-header/80 backdrop-blur-md shadow-lg">
      <div className="max-w-screen-2xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        <div className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight">Trello Clone</span>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-card rounded-full border border-border">
            <User size={14} className="text-foreground/50" />
            <span className="text-xs font-medium text-foreground/70">
              {session?.user?.email}
            </span>
          </div>

          <nav className="flex items-center gap-1">
            <ThemeSwitcher />

            <button
              onClick={onAboutClick}
              className="p-2 text-foreground/70 hover:bg-card hover:text-primary rounded-md transition-all"
              title="Acerca de"
            >
              <Info size={20} />
            </button>

            <button
              onClick={onLogoutConfirm}
              className="p-2 text-foreground/70 hover:bg-red-500/10 hover:text-red-500 rounded-md transition-all"
              title="Cerrar sesión"
            >
              <LogOut size={20} />
            </button>
          </nav>
        </div>

        <button
          className="md:hidden p-2 text-foreground"
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* slidebar */}
      {isMenuOpen && (
        <div className="md:hidden top-16 left-0 w-full p-4 space-y-4">
          <div className="flex items-center gap-3 p-3 bg-border rounded-lg">
            <User size={20} className="text-foreground" />
            <span className="text-sm truncate">{session?.user?.email}</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center justify-between p-2 bg-border rounded-lg">
              <span className="text-sm px-2">Tema</span>
              <ThemeSwitcher />
            </div>
            <button
              onClick={() => { onAboutClick(); toggleMenu(); }}
              className="flex items-center justify-center gap-2 p-3 bg-border rounded-lg"
            >
              <Info size={20} /> <span className="text-sm">Info</span>
            </button>
          </div>

          <button
            onClick={() => { onLogoutConfirm(); toggleMenu(); }}
            className="w-full flex items-center justify-center gap-2 p-3 bg-red-500 text-white rounded-lg font-medium"
          >
            <LogOut size={20} /> Cerrar Sesión
          </button>
        </div>
      )}
    </header>
  );
}