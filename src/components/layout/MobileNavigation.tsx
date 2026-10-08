import { Link } from '@tanstack/react-router';

export function MobileNavigation() {
  return (
    <nav
      aria-label="Navegação mobile"
      className="mobile-nav border-border bg-ink fixed right-0 bottom-0 left-0 z-20 flex justify-around border-t p-4 md:hidden"
    >
      <a href="#catalogo" aria-label="Início">
        <img src="/icons/iconly-bold-home-15-5519.svg" alt="" />
      </a>
      <Link to="/cart">Carrinho</Link>
      <Link to="/wallets">
        <img src="/icons/iconly-curved-wallet-23-1379.svg" alt="Carteiras" />
      </Link>
      <Link to="/profile">Conta</Link>
    </nav>
  );
}
