import Link from 'next/link';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react';

function classes(variant: 'primary' | 'ghost' = 'primary') {
  return `inline-flex items-center justify-center rounded-md px-5 py-3 text-sm font-semibold transition ${
    variant === 'primary'
      ? 'bg-brand-600 text-white hover:bg-brand-700 focus-visible:outline-brand-600'
      : 'border border-slate-300 bg-white text-slate-900 hover:bg-slate-100 focus-visible:outline-slate-400'
  }`;
}

export function Button(props: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' }) {
  const { className = '', variant = 'primary', ...rest } = props;
  return <button className={`${classes(variant)} ${className}`} {...rest} />;
}

export function ButtonLink(props: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; variant?: 'primary' | 'ghost' }) {
  const { className = '', variant = 'primary', href, ...rest } = props;
  return <Link href={href} className={`${classes(variant)} ${className}`} {...rest} />;
}
