"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useRaid } from '@/app/RaidContext';
import { downloadTemplateAsJson, triggerJsonImport } from '@/lib/templateIO';

interface BurgerMenuProps {
  onExport?: () => void;
  onImport?: () => void;
}

export default function BurgerMenu({ onExport, onImport }: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { exportTemplate, loadTemplate } = useRaid();

  const handleExport = () => {
    const json = exportTemplate();
    downloadTemplateAsJson(json);
    setIsOpen(false);
    if (onExport) onExport();
  };

  const handleImport = () => {
    triggerJsonImport((text) => {
      loadTemplate(text);
      if (onImport) onImport();
    });
    setIsOpen(false);
  };

  const navItems = [
    { href: '/', label: 'Accueil', active: pathname === '/' },
    { href: '/raid-setup', label: 'Raid Setup', active: pathname === '/raid-setup' },
    { href: '/tableau', label: 'Vue Tableau', active: pathname === '/tableau' },
  ];

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Ouvrir le menu"
        className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-yellow-500 bg-yellow-950/80 text-yellow-200 shadow-lg transition hover:border-yellow-400 hover:text-yellow-100"
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-6 rounded bg-current" />
          <span className="block h-0.5 w-6 rounded bg-current" />
          <span className="block h-0.5 w-6 rounded bg-current" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-xl border-2 border-yellow-600 bg-amber-950/95 shadow-2xl backdrop-blur-sm">
          <div className="border-b border-yellow-700 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  item.active ? 'bg-yellow-700 text-white' : 'text-yellow-100 hover:bg-yellow-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="p-2">
            <button
              type="button"
              onClick={handleImport}
              className="mb-2 w-full rounded-lg bg-blue-700 px-3 py-2 text-left text-sm font-bold text-white transition hover:bg-blue-600"
            >
              Import JSON
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="w-full rounded-lg bg-green-700 px-3 py-2 text-left text-sm font-bold text-white transition hover:bg-green-600"
            >
              Export template to JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
