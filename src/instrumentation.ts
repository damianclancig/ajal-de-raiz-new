export async function onRequestError(
  err: unknown,
  request: {
    path: string;
    method: string;
    headers: Headers;
  },
  context: {
    routerKind: 'pages' | 'app';
    routeType: 'layout' | 'page' | 'route' | 'action';
  }
) {
  const { logger } = await import('./utils/server-logger');
  logger.error(
    {
      err,
      path: request.path,
      method: request.method,
      routeType: context.routeType,
      routerKind: context.routerKind,
    },
    "Server Exception"
  );
}
