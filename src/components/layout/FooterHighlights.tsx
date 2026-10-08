import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function FooterHighlights() {
  return (
    <div className="bg-surface-dark grid grid-cols-4 gap-6 p-8">
      {[
        [
          'W',
          'Segurança da carteira',
          'Proteja sua carteira e colecione arte digital verificada com confiança.',
        ],
        [
          'C',
          'Criadores em destaque',
          'Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.',
        ],
        [
          'D',
          'Alertas de lançamentos',
          'Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.',
        ],
      ].map(([icon, title, description]) => (
        <div key={title} className="border-border space-y-5 border-r pr-6">
          <span className="border-primary text-title text-primary inline-flex size-12 items-center justify-center rounded-full border">
            {icon}
          </span>
          <h2 className="text-body-lg font-bold">{title}</h2>
          <p className="text-tiny text-text-secondary leading-5">
            {description}
          </p>
        </div>
      ))}
      <div className="space-y-4">
        <h2 className="text-body-lg font-bold">
          Antecipe-se ao próximo lançamento
        </h2>
        <label className="sr-only" htmlFor="newsletter">
          E-mail para novidades
        </label>
        <div className="flex">
          <Input
            id="newsletter"
            type="email"
            placeholder="digite seu e-mail..."
            disabled
          />
          <Button disabled>Enviar</Button>
        </div>
        <p className="text-tiny text-text-secondary leading-5">
          Receba lançamentos selecionados, histórias de criadores e novidades do
          mercado.
        </p>
      </div>
    </div>
  );
}
