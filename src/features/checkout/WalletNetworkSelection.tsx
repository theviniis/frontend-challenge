import { useId } from 'react';
import { useFormContext } from 'react-hook-form';
import { RadioGroup as Radio } from 'radix-ui';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import type { CollectorFormValues } from './form-schema';
export function WalletNetworkSelection() {
  const id = useId();
  const form = useFormContext<CollectorFormValues>();
  return (
    <FormField
      control={form.control}
      name="provider"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Carteira e rede</FormLabel>
          <FormControl>
            <Radio.Root
              orientation="vertical"
              name={field.name}
              required
              value={field.value}
              onValueChange={field.onChange}
              aria-label="Carteira e rede"
              className="grid"
              disabled={form.formState.isSubmitting}
            >
              {(
                [
                  ['walletconnect', 'METAMASK · WALLETCONNECT · COINBASE'],
                  ['metamask', 'MetaMask'],
                  ['coinbase', 'Coinbase Wallet'],
                ] as const
              ).map(([value, label]) => (
                <div key={value} className="flex items-center">
                  <Radio.Item
                    id={`${id}-${value}`}
                    value={value}
                    aria-label={label}
                    onBlur={field.onBlur}
                  >
                    <span aria-hidden="true">
                      {field.value === value ? '◉' : '○'}
                    </span>
                  </Radio.Item>
                  <label htmlFor={`${id}-${value}`}>{label}</label>
                </div>
              ))}
            </Radio.Root>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
