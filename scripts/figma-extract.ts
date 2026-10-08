import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { loadEnv } from 'vite';

const env = loadEnv('development', process.cwd(), '');
const token = process.env.FIGMA_TOKEN || env.FIGMA_TOKEN;
if (!token)
  throw new Error('Defina FIGMA_TOKEN em .env.local para extrair o Figma.');

const fileId = 'Ff0SksUi7UFtPWUO8kyNtw';
const response = await fetch(`https://api.figma.com/v1/files/${fileId}`, {
  headers: { 'X-Figma-Token': token },
});
if (!response.ok) throw new Error(`Figma respondeu HTTP ${response.status}.`);
const output = path.resolve('docs/figma');
await mkdir(output, { recursive: true });
await writeFile(
  path.join(output, 'file.json'),
  JSON.stringify(await response.json(), null, 2)
);
console.log(
  'Referência Figma salva em docs/figma/file.json. Exportação de assets: tarefa 01.'
);
