import { FooterHighlights } from './FooterHighlights';
import { FooterLinks } from './FooterLinks';

export function Footer() {
  return (
    <footer className="bg-surface-card mt-24 hidden overflow-hidden rounded-lg md:block">
      <FooterHighlights />
      <div className="border-border flex justify-between border-b p-8">
        <p className="text-h2 font-bold">KURIO</p>
        <p className="text-body-sm text-text-secondary">
          Feito para colecionadores, criadores e cultura
        </p>
      </div>
      <FooterLinks />
      <p className="text-tiny text-text-secondary pb-6 text-center">
        © 2026 Kurio. Propriedade digital para todos.
      </p>
    </footer>
  );
}
