import type { APIRoute, GetStaticPaths } from 'astro';
import { formatDate } from '../../../lib/date';
import { renderOg } from '../../../lib/og';
import { getLogs, type Log } from '../../../lib/logs';

/** 短いログの共有画像（1ログに1枚。/og/logs/<ファイル名>.png） */
export const getStaticPaths = (async () => {
  const logs = await getLogs();
  return logs.map((log) => ({ params: { slug: log.id }, props: { log } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute<{ log: Log }> = async ({ props }) => {
  const png = await renderOg({ kicker: '短いログ', title: props.log.data.title, foot: formatDate(props.log.data.date) });
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
