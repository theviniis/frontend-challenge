// tests/contract/setup.ts
// Setup mínimo para ambiente de testes de contrato
import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from '../../src/mocks/server';
import { onUnhandledRequest } from '../../src/mocks/on-unhandled-request';

beforeAll(() => server.listen({ onUnhandledRequest }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
