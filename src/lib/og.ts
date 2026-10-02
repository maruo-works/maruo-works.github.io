import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { loadDefaultJapaneseParser } from 'budoux';
import satori from 'satori';
import sharp from 'sharp';

const phrases = loadDefaultJapaneseParser();

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const BLUE = '#2b6fe0';
const BLACK = '#0b0d14';
const GRAY = '#6b7079';

/**
 * 画像に使う文字だけを Google Fonts から TrueType で取る（日本語の書体は1ファイル15MBあるため）。
 * 取れないときは公開の作業を止める（前の版のサイトはそのまま残る）。
 */
async function loadFont(family: string, weight: number, text: string): Promise<ArrayBuffer> {
  const query = `family=${family.replace(/ /g, '+')}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await fetch(`https://fonts.googleapis.com/css2?${query}`).then((r) => r.text());
  const url = css.match(/src: url\((.+?)\) format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error(`共有画像の文字データ（${family}）を Google Fonts から取れませんでした`);
  return fetch(url).then((r) => r.arrayBuffer());
}

let photo: Promise<string> | undefined;
function jacketPhoto(): Promise<string> {
  photo ??= readFile(path.join(process.cwd(), 'src/assets/beach-night.jpg'))
    .then((buf) => sharp(buf).resize(OG_HEIGHT, OG_HEIGHT).jpeg({ quality: 82 }).toBuffer())
    .then((buf) => `data:image/jpeg;base64,${buf.toString('base64')}`);
  return photo;
}

type El = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): El => ({
  type,
  props: { style, children, ...extra },
});

export type OgInput = {
  /** 左上の小さな文字（例：「記事」） */
  kicker: string;
  title: string;
  /** 下の行（例：日付）。数字は等幅の書体で出す */
  foot: string;
};

export async function renderOg({ kicker, title, foot }: OgInput): Promise<Buffer> {
  const name = 'まるお';
  const [mincho, courier, src] = await Promise.all([
    loadFont('Shippori Mincho B1', 500, `${kicker}${title}${name}`),
    loadFont('Courier Prime', 400, foot),
    jacketPhoto(),
  ]);
  const titleSize = title.length > 30 ? 44 : title.length > 18 ? 52 : 60;

  const tree = el('div', { width: OG_WIDTH, height: OG_HEIGHT, display: 'flex', background: '#fff' }, [
    el('div', { width: OG_WIDTH - OG_HEIGHT, height: OG_HEIGHT, display: 'flex', flexDirection: 'column', padding: '64px 56px 56px 64px' }, [
      el('div', { display: 'flex', fontFamily: 'Mincho', fontSize: 24, color: BLUE, letterSpacing: '0.3em' }, `${name}　${kicker}`),
      el('div', { display: 'flex', flexGrow: 1, alignItems: 'center' }, [
        el(
          'div',
          { display: 'flex', flexWrap: 'wrap', fontFamily: 'Mincho', fontSize: titleSize, lineHeight: 1.5, color: BLACK, letterSpacing: '0.06em' },
          phrases.parse(title).map((p) => el('span', { whiteSpace: 'nowrap' }, p)),
        ),
      ]),
      el('div', { display: 'flex', alignItems: 'center' }, [
        el('div', { width: 48, height: 2, background: BLUE, marginRight: 20 }),
        el('div', { fontFamily: 'Courier', fontSize: 26, color: GRAY, letterSpacing: '0.08em' }, foot),
      ]),
    ]),
    el('img', { width: OG_HEIGHT, height: OG_HEIGHT }, undefined, { src, width: OG_HEIGHT, height: OG_HEIGHT }),
  ]);

  const svg = await satori(tree as never, {
    width: OG_WIDTH,
    height: OG_HEIGHT,
    fonts: [
      { name: 'Mincho', data: mincho, weight: 500, style: 'normal' },
      { name: 'Courier', data: courier, weight: 400, style: 'normal' },
    ],
  });
  return sharp(Buffer.from(svg)).png().toBuffer();
}
