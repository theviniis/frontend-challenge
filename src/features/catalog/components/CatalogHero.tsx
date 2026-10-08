export function CatalogHero() {
  return (
    <section
      className="catalog-hero bg-surface-card relative flex overflow-hidden rounded-lg md:mt-8"
      aria-label="Destaque"
    >
      <div className="hero-copy relative z-10 flex flex-col justify-center">
        <p className="hero-welcome tracking-widest">Bem-vindo à Kurio</p>
        <h2 className="hero-title font-bold">
          <span className="hidden md:inline">
            SEJA DONO DO FUTURO
            <br />
            DA ARTE DIGITAL
          </span>
          <span className="md:hidden">
            SEJA DONO DA
            <br />
            CULTURA DIGITAL
          </span>
        </h2>
        <p className="hero-description text-text-secondary">
          <span className="hidden md:inline">
            Descubra NFTs selecionados de criadores emergentes e consagrados.
            Colecione arte digital rara, apoie artistas e tenha uma parte da
            cultura da internet.
          </span>
          <span className="md:hidden">
            Descubra NFTs selecionados de criadores do mundo todo.
          </span>
        </p>
        <a
          href="#catalogo"
          className="hero-cta bg-primary text-body-sm text-ink mt-6 w-fit rounded px-6 py-3 font-bold"
        >
          EXPLORAR →
        </a>
      </div>
      <img
        src="/assets/nft/golden-signal-160.png"
        alt="Golden Signal, arte digital em destaque"
        className="hero-art object-cover"
        width={1254}
        height={1254}
        fetchPriority="high"
      />
      <img
        src="/assets/nft/sage-nomad-009.png"
        alt="Sage Nomad"
        className="hero-art-small absolute rounded-md md:hidden"
        width={1254}
        height={1254}
      />
    </section>
  );
}
