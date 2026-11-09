import { afterEach, describe, expect, it, vi } from 'vitest';
import { searchServerCatalog } from '../muno/services/api';

afterEach(() => vi.unstubAllGlobals());
describe('Search server communication', () => {
  it('encodes search text and forwards cancellation to the request', async () => {
    const fetcher = vi.fn(async () => new Response('[]', { status: 200 }));
    vi.stubGlobal('fetch', fetcher);
    const controller = new AbortController();
    await searchServerCatalog('  breaking bad  ', controller.signal);
    expect(fetcher).toHaveBeenCalledWith('/api/search?q=breaking%20bad', {
      signal: controller.signal, headers: { Accept: 'application/json' },
    });
  });
  it('surfaces service failure rather than reporting no movie matches', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('{"error":"Search unavailable"}', { status: 503 })));
    await expect(searchServerCatalog('florist')).rejects.toThrow('Search unavailable');
  });
  it('accepts a genuine successful empty result', async () => {
    vi.stubGlobal('fetch', vi.fn(async () => new Response('[]', { status: 200 })));
    expect(await searchServerCatalog('no-movie-matches')).toEqual([]);
  });
});