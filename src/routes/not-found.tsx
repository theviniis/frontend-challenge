import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/not-found')({
  component: NotFoundPage,
});

function NotFoundPage() {
  return (
    <div className="rounded-md border border-border bg-surface-card p-8 text-center font-mono space-y-4">
      <h1 className="text-display font-bold text-coral">404</h1>
      <p className="text-body text-text-secondary">Página não encontrada</p>
      <div>
        <Link
          to="/"
          className="inline-block rounded border border-primary bg-primary/20 px-4 py-2 text-tiny text-primary hover:bg-primary/30"
        >
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  );
}
