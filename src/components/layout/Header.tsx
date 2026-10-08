import { Link } from '@tanstack/react-router';

interface HeaderProps {
  marketHref?: string;
  learnHref?: string;
}
export function Header({
  marketHref = '/#catalogo',
  learnHref = '/#diario',
}: HeaderProps) {
  return (
    <header className="catalog-header border-border hidden h-[45px] items-center justify-between border-b md:flex">
      <Link
        to="/"
        search={{ sort: 'relevance', page: 1 }}
        className="text-body-sm w-[160px] font-bold tracking-[1.4px]"
      >
        KURIO
      </Link>
      <nav aria-label="Navegação principal" className="text-body-sm flex gap-8">
        <Link
          to="/"
          search={{ sort: 'relevance', page: 1 }}
          className="text-primary"
        >
          Início
        </Link>
        <a href={marketHref}>Mercado</a>
        <span aria-disabled="true">Criadores</span>
        <a href={learnHref}>Aprenda</a>
      </nav>
      <div className="flex items-center gap-4">
        <Link to="/cart">Carrinho</Link>
        <Link
          to="/login"
          className="border-primary text-primary rounded border px-4 py-2"
        >
          Entrar
        </Link>
      </div>
    </header>
  );
}
