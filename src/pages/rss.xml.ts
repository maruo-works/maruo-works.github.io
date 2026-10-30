import rss, { type RSSFeedItem } from '@astrojs/rss';
import type { APIContext } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { render } from 'astro:content';
import { SITE_TITLE, SITE_DESCRIPTION } from '../consts';
import { getPosts } from '../lib/posts';
import { getLogs, logSummary } from '../lib/logs';
import Compare from '../components/article/Compare.astro';
import Side from '../components/article/Side.astro';
import Steps from '../components/article/Steps.astro';
import Sample from '../components/article/Sample.astro';
import Cards from '../components/article/Cards.astro';
import Card from '../components/article/Card.astro';

/**
 * RSS（全文）。記事と短いログの両方を、新しい順に出す。
 * 本文は Astro のコンテナ API でページと同じ HTML にして content に入れる（RSS リーダーで全文が読める）。
 */
export async function GET(context: APIContext) {
  const container = await AstroContainer.create();
  const components = { Compare, Side, Steps, Sample, Cards, Card };

  const posts: RSSFeedItem[] = [];
  for (const post of await getPosts()) {
    const { Content } = await render(post);
    posts.push({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: `/posts/${post.id}/`,
      content: await container.renderToString(Content, { props: { components } }),
      categories: ['記事'],
    });
  }

  const logs: RSSFeedItem[] = [];
  for (const log of await getLogs()) {
    const { Content } = await render(log);
    logs.push({
      title: log.data.title,
      pubDate: log.data.date,
      description: logSummary(log) || log.data.title,
      link: `/logs/${log.id}/`,
      content: await container.renderToString(Content),
      categories: ['短いログ'],
    });
  }

  const items = [...posts, ...logs].sort((a, b) => b.pubDate!.valueOf() - a.pubDate!.valueOf());

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site!,
    items,
    customData: `<language>ja</language><managingEditor>${SITE_TITLE}</managingEditor>`,
  });
}
