import { Link } from '@tanstack/react-router';

export function FooterLinks() {
  return (
    <div className="text-tiny text-text-secondary grid grid-cols-5 gap-8 p-8">
      <div className="space-y-4">
        <p>contato@email.com</p>
        <p>+55 11 4002 8922</p>
        <Link to="/teste" search={{ sort: 'relevance', page: 1 }}>
          Área de testes
        </Link>
      </div>
      <div className="space-y-4">
        <h2 className="text-foreground font-bold">Meu perfil</h2>
        <Link to="/profile">Meu perfil</Link>
        {[
          'Minha coleção',
          'Atividade',
          'Estúdio do criador',
          'Lista de interesse',
        ].map((label) => (
          <span key={label} className="block" aria-disabled="true">
            {label}
          </span>
        ))}
      </div>
      <div className="space-y-4">
        <h2 className="text-foreground font-bold">Central de ajuda</h2>
        {[
          'Central de ajuda',
          'Como comprar NFTs',
          'Carteira e segurança',
          'Política do mercado',
          'Denunciar item',
        ].map((label) => (
          <span key={label} className="block" aria-disabled="true">
            {label}
          </span>
        ))}
      </div>
      <div className="space-y-4">
        <h2 className="text-foreground font-bold">Coleções</h2>
        {['Arte digital', 'Fotografia', 'Música', 'Arte 3D', 'Utilidade'].map(
          (category) => (
            <Link
              key={category}
              className="block"
              to="/"
              search={{ categories: [category], sort: 'relevance', page: 1 }}
            >
              {category}
            </Link>
          )
        )}
      </div>
      <div className="space-y-6">
        <h2 className="text-foreground font-bold">Redes sociais</h2>
        <h2 className="text-foreground font-bold">Carteiras compatíveis</h2>
        <p>METAMASK • WALLETCONNECT • COINBASE</p>
        <Link to="/wallets">Carteiras</Link>
      </div>
    </div>
  );
}
