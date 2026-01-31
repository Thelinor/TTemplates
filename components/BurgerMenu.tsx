"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useRaid } from '@/app/RaidContext';
import { downloadTemplateAsJson, triggerJsonImport } from '@/lib/templateFileIO';

interface BurgerMenuProps {
  onExport?: () => void;
  onImport?: () => void;
}

export default function BurgerMenu({ onExport, onImport }: BurgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { template, loadTemplate } = useRaid();

  const handleExport = () => {
    downloadTemplateAsJson(template);
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
    { href: '/', label: 'Home', active: pathname === '/' },
    { href: '/players', label: 'Characters', active: pathname === '/players' },
    { href: '/encounters', label: 'Encounters', active: pathname === '/encounters' },
  ];

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Ouvrir le menu"
        className="flex h-12 w-12 items-center justify-center rounded-lg border-2 border-[#d6b46b] bg-[#101113] text-white shadow-lg transition hover:border-white hover:text-[#d6b46b]"
      >
        <span className="flex flex-col gap-1.5">
          <span className="block h-0.5 w-6 rounded bg-current" />
          <span className="block h-0.5 w-6 rounded bg-current" />
          <span className="block h-0.5 w-6 rounded bg-current" />
        </span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 w-64 overflow-hidden rounded-xl border-2 border-[#d6b46b] bg-[#111111]/95 shadow-2xl backdrop-blur-sm">
          <div className="border-b border-[#d6b46b]/70 p-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  item.active ? 'bg-[#d6b46b] text-black' : 'text-white hover:bg-[#242424]'
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
              className="mb-2 w-full rounded-lg bg-[#1d1d20] px-3 py-2 text-left text-sm font-bold text-white transition hover:bg-[#333333] border border-white/20"
            >
              Import JSON
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="w-full rounded-lg bg-[#141414] px-3 py-2 text-left text-sm font-bold text-white transition hover:bg-[#333333] border border-[#d6b46b]"
            >
              Export template to JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
