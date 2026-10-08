import { FooterHighlights } from './FooterHighlights';
import { FooterKurio } from './FooterKurio';
import { FooterLinks } from './FooterLinks';

export function Footer() {
  return (
    <footer className="bg-surface-card mt-24 hidden overflow-hidden rounded-lg md:block">
      <FooterHighlights />
      <FooterKurio />
      <FooterLinks />
      <p className="text-tiny text-text-secondary pb-6 text-center">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  );
}
