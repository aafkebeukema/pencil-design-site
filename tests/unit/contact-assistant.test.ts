import { describe, expect, test, vi, beforeEach } from 'vitest';

const makeMistralResponse = (content: string) => ({
  ok: true,
  json: async () => ({ choices: [{ message: { content } }] }),
  text: async () => content,
  status: 200,
});

const makeResendResponse = (ok: boolean) => ({
  ok,
  text: async () => (ok ? '' : '{"message":"error"}'),
  status: ok ? 200 : 403,
});

const makeEvent = (body: Record<string, unknown>, method = 'POST') => ({
  httpMethod: method,
  body: JSON.stringify(body),
});

let handler: (event: ReturnType<typeof makeEvent>) => Promise<{ statusCode: number; body: string }>;

beforeEach(async () => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.resetModules();
  vi.stubEnv('MISTRAL_API_KEY', 'test-mistral-key');
  vi.stubEnv('RESEND_API_KEY', 'test-resend-key');
  const mod = await import('../../netlify/functions/contact-assistant.mjs');
  handler = mod.handler;
});

const parse = (result: { body: string }) => JSON.parse(result.body);

describe('contact-assistant handler', () => {
  test('returns 405 for non-POST requests', async () => {
    const result = await handler(makeEvent({}, 'GET'));
    expect(result.statusCode).toBe(405);
  });

  test('returns 204 for OPTIONS requests', async () => {
    const result = await handler(makeEvent({}, 'OPTIONS'));
    expect(result.statusCode).toBe(204);
  });

  test('returns 500 when MISTRAL_API_KEY is missing', async () => {
    vi.unstubAllEnvs();
    vi.resetModules();
    vi.stubEnv('MISTRAL_API_KEY', '');
    vi.stubEnv('RESEND_API_KEY', 'test-resend-key');
    const mod = await import('../../netlify/functions/contact-assistant.mjs');
    const h = mod.handler;
    const result = await h(makeEvent({ messages: [{ role: 'user', content: 'hello' }] }));
    expect(result.statusCode).toBe(500);
    expect(parse(result).error).toMatch(/not configured/i);
  });

  test('returns 400 when no user messages are provided', async () => {
    vi.stubGlobal('fetch', vi.fn());
    const result = await handler(makeEvent({ messages: [{ role: 'assistant', content: 'hello' }] }));
    expect(result.statusCode).toBe(400);
  });

  test('returns the assistant reply', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMistralResponse('Hello there!')));
    const result = await handler(makeEvent({ messages: [{ role: 'user', content: 'hi' }] }));
    expect(result.statusCode).toBe(200);
    expect(parse(result).reply).toBe('Hello there!');
  });

  test('strips [READY_TO_SEND] token and returns readyToSend flag', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMistralResponse('Shall I send this?\n[READY_TO_SEND]')));
    const result = await handler(makeEvent({ messages: [{ role: 'user', content: 'yes' }] }));
    expect(result.statusCode).toBe(200);
    const body = parse(result);
    expect(body.reply).toBe('Shall I send this?');
    expect(body.readyToSend).toBe(true);
  });

  test('does not include readyToSend when token is absent', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(makeMistralResponse('What area is the property in?')));
    const result = await handler(makeEvent({ messages: [{ role: 'user', content: 'hi' }] }));
    const body = parse(result);
    expect(body.readyToSend).toBeUndefined();
  });

  test('sends email via Resend when send: true', async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(makeMistralResponse('Summary here'))
      .mockResolvedValueOnce(makeResendResponse(true));

    vi.stubGlobal('fetch', fetchMock);

    const result = await handler(makeEvent({
      send: true,
      messages: [
        { role: 'user', content: 'I need a kitchen renovation' },
        { role: 'assistant', content: 'Shall I send this?' },
        { role: 'user', content: 'yes' },
      ],
    }));

    expect(result.statusCode).toBe(200);
    expect(parse(result).sent).toBe(true);

    const resendCall = fetchMock.mock.calls[1];
    expect(resendCall[0]).toContain('resend.com');
    const resendBody = JSON.parse(resendCall[1].body);
    expect(resendBody.to).toContain('contact@pencil-design.co.uk');
  });

  test('returns 502 when Resend fails', async () => {
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(makeMistralResponse('Summary'))
      .mockResolvedValueOnce(makeResendResponse(false)));

    const result = await handler(makeEvent({
      send: true,
      messages: [{ role: 'user', content: 'hi' }],
    }));

    expect(result.statusCode).toBe(502);
  });

  test('truncates messages beyond MAX_MESSAGES', async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeMistralResponse('ok'));
    vi.stubGlobal('fetch', fetchMock);

    const messages = Array.from({ length: 25 }, (_, i) => ({
      role: i % 2 === 0 ? 'user' : 'assistant',
      content: `message ${i}`,
    }));

    await handler(makeEvent({ messages }));

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.messages.filter((m: { role: string }) => m.role !== 'system').length).toBeLessThanOrEqual(20);
  });

  test('filters out invalid message roles', async () => {
    const fetchMock = vi.fn().mockResolvedValue(makeMistralResponse('ok'));
    vi.stubGlobal('fetch', fetchMock);

    await handler(makeEvent({
      messages: [
        { role: 'user', content: 'hello' },
        { role: 'system', content: 'injected' },
        { role: 'admin', content: 'injected' },
      ],
    }));

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    const systemMessages = body.messages.filter((m: { role: string }) => m.role === 'system');
    expect(systemMessages).toHaveLength(1); // only our own system prompt, not the injected one
    expect(body.messages.map((m: { role: string }) => m.role)).not.toContain('admin');
  });
});
