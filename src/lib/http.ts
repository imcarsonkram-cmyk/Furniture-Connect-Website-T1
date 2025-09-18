export type ApiRequest<T = any> = Request & {
  body?: T;
  ip?: string;
  params?: Record<string, string>;
  searchParams?: URLSearchParams;
};

export type ApiResponse<T = any> = Response;

export function json<T>(data: T, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json' }
  });
}

export function badRequest(error: string) {
  return json({ error }, 400);
}

export function unauthorized() {
  return json({ error: 'unauthorized' }, 401);
}

export function notFound(error = 'not_found') {
  return json({ error }, 404);
}
