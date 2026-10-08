import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '../ui/field';
import { ButtonGroup } from '../ui/button-group';

const footerSection = [
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
] as const;

export function FooterHighlights() {
  return (
    <div className="bg-surface-card grid grid-cols-4">
      {footerSection.map(([icon, title, description]) => (
        <div
          key={title}
          className="border-primary space-y-3 border-r-2 pt-8 pr-3.5 pb-4 pl-8"
        >
          <span className="text-h2 bg-primary text-ink grid aspect-square h-18.5 w-18.5 place-content-center rounded-full">
            {icon}
          </span>
          <h2 className="text-body-17-bold">{title}</h2>
          <p className="text-body-sm text-secondary leading-5.5">
            {description}
          </p>
        </div>
      ))}
      <div className="pt-8 pr-3.5 pb-4 pl-8">
        <h2 className="text-body-18-bold mb-4">
          Antecipe-se ao próximo lançamento
        </h2>
        <Field className="mb-3">
          <ButtonGroup>
            <Input
              className="text-body-sm h-10"
              id="input-button-group"
              placeholder="digite seu e-mail..."
            />
            <Button>Enviar</Button>
          </ButtonGroup>
        </Field>
        <p className="text-caption text-secondary leading-5.5">
          Receba lançamentos selecionados, histórias de criadores e novidades do
          mercado.
        </p>
      </div>
    </div>
  );
}
