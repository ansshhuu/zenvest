import React from 'react';
import Logo from '../components/layout/Logo';

export default function Footer({ navigate }) {
  const links = {
    product: [
      { label: "Features", href: "#features" },
      { label: "Plans", href: "#plans" },
      { label: "Claims", href: "#" },
      { label: "How it works", href: "#how-it-works" },
    ],
    company: [
      { label: "About Us", href: "#" },
      { label: "Partner Program", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Contact", href: "#" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "IRDAI Disclosure", href: "#" },
      { label: "Security", href: "#" },
    ]
  };

  return (
    <footer className="relative overflow-hidden bg-slate-950 pt-24 pb-10 text-white">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/12" />
      <div className="pointer-events-none absolute -top-24 right-[-8rem] h-72 w-72 rounded-full bg-cyan-400/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 left-[-6rem] h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="container relative z-10">
        <div className="grid grid-cols-1 gap-10 border-t border-white/10 pt-12 md:grid-cols-2 lg:grid-cols-[1.7fr_repeat(3,minmax(0,1fr))]">
          <div className="footer-brand">
            <Logo onClick={() => navigate("home")} />
            <p className="mt-6 max-w-md text-[15px] leading-7 text-slate-400">
              The first AI-powered parametric micro-insurance platform built for the gig economy, bringing instant protection and automatic payouts into one calm, simple flow.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {["AI Risk Intelligence", "Instant Claims", "24x7 Protection"].map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[12px] font-semibold text-slate-200"
                >
                  {pill}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-5 text-[13px] font-bold uppercase tracking-[0.22em] text-slate-200">Product</h4>
            <ul className="space-y-4">
              {links.product.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[14px] font-medium text-slate-400 transition hover:text-cyan-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[13px] font-bold uppercase tracking-[0.22em] text-slate-200">Company</h4>
            <ul className="space-y-4">
              {links.company.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[14px] font-medium text-slate-400 transition hover:text-cyan-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-5 text-[13px] font-bold uppercase tracking-[0.22em] text-slate-200">Legal</h4>
            <ul className="space-y-4">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-[14px] font-medium text-slate-400 transition hover:text-cyan-300">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-8 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <p className="leading-6">
            © 2026 Zenvest. All rights reserved.
            <span className="mx-2 hidden md:inline text-slate-600">|</span>
            IRDAI Reg No: 8832-ZV.
          </p>
          <div className="flex items-center gap-3">
            <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.75)]" />
            <span className="font-semibold text-slate-300">Protection systems online</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
