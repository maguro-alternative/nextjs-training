# Board Game Manager Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** ボードゲームを登録し、一覧・詳細・編集で見返せる MVP を作る。

**Architecture:** 既存の `posts` 実装に寄せて、App Router の Server Component と Server Actions で実装する。データは `src/lib/games.ts` のメモリ配列に閉じ込め、画面側は `getGames`, `getGame`, `addGame`, `updateGame` だけを使う。

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS, ESLint, Vitest.

---

## PR 分割案

### PR 1: データ層と一覧表示

目的: `/` でボードゲーム一覧を表示できる状態にする。

含める変更:

- `src/lib/games.ts` を追加する
- `BoardGame` と `BoardGameInput` を定義する
- メモリ配列の初期データを用意する
- `getGames()` と `getGame(id)` を実装する
- `src/app/page.tsx` をボードゲーム一覧に置き換える

確認観点:

- `/` にボードゲーム一覧が表示される
- 画像、タイトル、プレイ人数、所要時間が表示される
- 各ゲームから詳細 URL `/games/[id]` へ遷移するリンクがある

### PR 2: 詳細画面

目的: 一覧から詳細画面へ移動し、登録内容を確認できる状態にする。

含める変更:

- `src/app/games/[id]/page.tsx` を追加する
- `params` から `id` を受け取る
- `getGame(Number(id))` で対象データを取得する
- 存在しない場合は `notFound()` を呼ぶ
- 編集ページへのリンクを表示する

確認観点:

- `/games/[id]` にタイトル、画像、プレイ人数、所要時間、説明メモが表示される
- 存在しない ID では Not Found になる
- 詳細画面から `/games/[id]/edit` へ移動できる

### PR 3: 新規作成フォーム

目的: `/games/new` からボードゲームを追加し、一覧へ戻れる状態にする。

含める変更:

- `src/app/games/actions.ts` を追加する
- `createGame` Server Action を実装する
- `src/app/games/components/GameForm.tsx` を追加する
- `src/app/games/new/page.tsx` を追加する
- `addGame(input)` を `src/lib/games.ts` に追加する
- 作成後に `/` へ `redirect()` する
- `updateTag('games')` で一覧・詳細の再表示に備える

確認観点:

- `/games/new` に入力フォームが表示される
- `title`, `minPlayers`, `maxPlayers`, `playTimeMinutes`, `memo`, `imageUrl` を入力できる
- `title` 未入力時にエラーが表示される
- 保存後 `/` に戻る
- 一覧に追加したゲームが表示される

### PR 4: 編集フォーム

目的: 詳細画面から登録済みボードゲームを編集できる状態にする。

含める変更:

- `src/app/games/[id]/edit/page.tsx` を追加する
- `GameForm` を編集でも使える形に調整する
- `updateGame(id, input)` を `src/lib/games.ts` に追加する
- `updateGame` Server Action を `src/app/games/actions.ts` に追加する
- 更新後に `/games/[id]` へ `redirect()` する
- `updateTag('games')` で一覧・詳細の再表示に備える

確認観点:

- `/games/[id]/edit` に既存値入りのフォームが表示される
- 値を変更して保存できる
- 保存後 `/games/[id]` に戻る
- 詳細画面で変更後の値が表示される
- 存在しない ID では Not Found になる

### PR 5: 最小デザイン調整

目的: MVP の動作を変えずに、一覧・詳細・フォームを使いやすく見える状態に整える。

含める変更:

- `src/app/page.tsx` の一覧をカード風のグリッドにする
- `src/app/games/[id]/page.tsx` の詳細を画像と情報が読みやすいレイアウトにする
- `src/app/games/components/GameForm.tsx` の入力欄、ラベル、ボタン、エラー表示を整える
- `src/app/globals.css` にページ共通の余白、リンク、ボタン、フォームの最小スタイルを追加する
- 画像が空のときや URL が壊れているときの見た目を大きく崩さないようにする

確認観点:

- 一覧で画像、タイトル、プレイ人数、所要時間をひと目で確認できる
- 詳細画面でメモが読みやすい
- 新規作成・編集フォームで入力項目の対応関係が分かりやすい
- モバイル幅でも文字やボタンが重ならない
- `npm run lint` が通る

## 全体のファイル責務

### 作成するファイル

- `src/lib/games.ts`
  - `BoardGame`, `BoardGameInput`
  - メモリ配列
  - `getGames`, `getGame`, `addGame`, `updateGame`
- `src/app/games/actions.ts`
  - `createGame`
  - `updateGame`
  - フォーム入力のパースと最小バリデーション
- `src/app/games/components/GameForm.tsx`
  - 新規作成・編集の共通フォーム
  - `useActionState` によるエラー表示
- `src/app/games/new/page.tsx`
  - 新規作成ページ
- `src/app/games/[id]/page.tsx`
  - 詳細ページ
- `src/app/games/[id]/edit/page.tsx`
  - 編集ページ

### 変更するファイル

- `src/app/page.tsx`
  - 既存ホームをボードゲーム一覧に置き換える

## 実装タスク

### Task 1: データ層を作る

**Files:**

- Create: `src/lib/games.ts`

- [ ] **Step 1: 型を定義する**

```ts
export type BoardGame = {
  id: number;
  title: string;
  minPlayers: number;
  maxPlayers: number;
  playTimeMinutes: number;
  memo: string;
  imageUrl: string;
  createdAt: string;
};

export type BoardGameInput = {
  title: string;
  minPlayers: number;
  maxPlayers: number;
  playTimeMinutes: number;
  memo: string;
  imageUrl: string;
};
```

- [ ] **Step 2: 初期データを用意する**

```ts
const games: BoardGame[] = [
  {
    id: 1,
    title: 'カタン',
    minPlayers: 3,
    maxPlayers: 4,
    playTimeMinutes: 60,
    memo: '交渉と資源管理が楽しい定番ゲーム。',
    imageUrl: 'https://placehold.co/600x400?text=Catan',
    createdAt: '2026-05-26T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'カルカソンヌ',
    minPlayers: 2,
    maxPlayers: 5,
    playTimeMinutes: 45,
    memo: 'タイル配置で街や道を広げていく。',
    imageUrl: 'https://placehold.co/600x400?text=Carcassonne',
    createdAt: '2026-05-26T00:00:00.000Z',
  },
];
```

- [ ] **Step 3: 取得関数を実装する**

```ts
import { cacheLife, cacheTag } from 'next/cache';

export async function getGames() {
  'use cache';
  cacheLife('hours');
  cacheTag('games');

  return games;
}

export async function getGame(id: number) {
  'use cache';
  cacheLife('hours');
  cacheTag('games');

  return games.find((game) => game.id === id);
}
```

- [ ] **Step 4: lint を実行する**

```bash
npm run lint
```

Expected: ESLint エラーがない。

### Task 2: 一覧画面を作る

**Files:**

- Modify: `src/app/page.tsx`
- Read: `src/lib/games.ts`

- [ ] **Step 1: `/` で `getGames()` を呼ぶ**

```tsx
import Link from 'next/link';
import { getGames } from '@/lib/games';

export default async function HomePage() {
  const games = await getGames();

  return (
    <main>
      <h1>ボードゲーム一覧</h1>
      <Link href="/games/new">新しいボードゲームを追加</Link>
      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={`/games/${game.id}`}>{game.title}</Link>
            <p>
              プレイ人数: {game.minPlayers}〜{game.maxPlayers}人
            </p>
            <p>所要時間: {game.playTimeMinutes}分</p>
            <img src={game.imageUrl} alt={game.title} width={240} />
          </li>
        ))}
      </ul>
    </main>
  );
}
```

- [ ] **Step 2: lint を実行する**

```bash
npm run lint
```

Expected: ESLint エラーがない。

- [ ] **Step 3: ブラウザで確認する**

```bash
npm run dev
```

Expected: `http://localhost:3000/` に一覧が表示される。

### Task 3: 詳細画面を作る

**Files:**

- Create: `src/app/games/[id]/page.tsx`

- [ ] **Step 1: 詳細ページを実装する**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGame } from '@/lib/games';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function GameDetailPage({ params }: Props) {
  const { id } = await params;
  const game = await getGame(Number(id));

  if (!game) {
    notFound();
  }

  return (
    <main>
      <Link href="/">一覧へ戻る</Link>
      <h1>{game.title}</h1>
      <img src={game.imageUrl} alt={game.title} width={480} />
      <p>
        プレイ人数: {game.minPlayers}〜{game.maxPlayers}人
      </p>
      <p>所要時間: {game.playTimeMinutes}分</p>
      <p>{game.memo}</p>
      <Link href={`/games/${game.id}/edit`}>編集</Link>
    </main>
  );
}
```

- [ ] **Step 2: lint を実行する**

```bash
npm run lint
```

Expected: ESLint エラーがない。

- [ ] **Step 3: ブラウザで確認する**

Expected: 一覧から詳細へ移動できる。存在しない ID は Not Found になる。

### Task 4: 新規作成の Server Action を作る

**Files:**

- Create: `src/app/games/actions.ts`
- Modify: `src/lib/games.ts`

- [ ] **Step 1: `addGame` を追加する**

```ts
export async function addGame(input: BoardGameInput) {
  const game: BoardGame = {
    id: Date.now(),
    ...input,
    createdAt: new Date().toISOString(),
  };

  games.push(game);
  return game;
}
```

- [ ] **Step 2: Server Action の状態型を定義する**

```ts
export type State = {
  ok: boolean;
  error?: string;
};
```

- [ ] **Step 3: フォーム値のパース関数を作る**

```ts
function parseGameInput(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const minPlayers = Number(formData.get('minPlayers'));
  const maxPlayers = Number(formData.get('maxPlayers'));
  const playTimeMinutes = Number(formData.get('playTimeMinutes'));
  const memo = String(formData.get('memo') ?? '').trim();
  const imageUrl = String(formData.get('imageUrl') ?? '').trim();

  if (title.length === 0) {
    return { ok: false as const, error: 'タイトルは必須です' };
  }

  if (
    !Number.isFinite(minPlayers) ||
    !Number.isFinite(maxPlayers) ||
    !Number.isFinite(playTimeMinutes)
  ) {
    return { ok: false as const, error: '人数と所要時間は数値で入力してください' };
  }

  return {
    ok: true as const,
    input: { title, minPlayers, maxPlayers, playTimeMinutes, memo, imageUrl },
  };
}
```

- [ ] **Step 4: `createGame` を実装する**

```ts
'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { addGame } from '@/lib/games';

export async function createGame(prevState: State, formData: FormData): Promise<State> {
  const parsed = parseGameInput(formData);

  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }

  await addGame(parsed.input);
  updateTag('games');
  redirect('/');
}
```

- [ ] **Step 5: lint を実行する**

```bash
npm run lint
```

Expected: ESLint エラーがない。

### Task 5: 共通フォームと新規作成ページを作る

**Files:**

- Create: `src/app/games/components/GameForm.tsx`
- Create: `src/app/games/new/page.tsx`

- [ ] **Step 1: `GameForm` を作る**

```tsx
'use client';

import { useActionState } from 'react';
import type { BoardGame } from '@/lib/games';
import type { State } from '../actions';

type Props = {
  action: (prevState: State, formData: FormData) => Promise<State>;
  game?: BoardGame;
  submitLabel: string;
};

const initialState: State = { ok: true };

export default function GameForm({ action, game, submitLabel }: Props) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      {state.error && <p style={{ color: 'red' }}>{state.error}</p>}
      <label>
        タイトル
        <input name="title" defaultValue={game?.title ?? ''} required />
      </label>
      <label>
        最小人数
        <input name="minPlayers" type="number" defaultValue={game?.minPlayers ?? 1} />
      </label>
      <label>
        最大人数
        <input name="maxPlayers" type="number" defaultValue={game?.maxPlayers ?? 4} />
      </label>
      <label>
        所要時間
        <input name="playTimeMinutes" type="number" defaultValue={game?.playTimeMinutes ?? 30} />
      </label>
      <label>
        メモ
        <textarea name="memo" defaultValue={game?.memo ?? ''} />
      </label>
      <label>
        画像URL
        <input name="imageUrl" defaultValue={game?.imageUrl ?? ''} />
      </label>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
```

- [ ] **Step 2: 新規作成ページを作る**

```tsx
import Link from 'next/link';
import { createGame } from '../actions';
import GameForm from '../components/GameForm';

export default function NewGamePage() {
  return (
    <main>
      <Link href="/">一覧へ戻る</Link>
      <h1>新しいボードゲームを追加</h1>
      <GameForm action={createGame} submitLabel="保存" />
    </main>
  );
}
```

- [ ] **Step 3: lint を実行する**

```bash
npm run lint
```

Expected: ESLint エラーがない。

- [ ] **Step 4: ブラウザで確認する**

Expected: `/games/new` から登録でき、保存後 `/` に戻る。

### Task 6: 編集機能を作る

**Files:**

- Modify: `src/lib/games.ts`
- Modify: `src/app/games/actions.ts`
- Create: `src/app/games/[id]/edit/page.tsx`

- [ ] **Step 1: `updateGame` を追加する**

```ts
export async function updateGame(id: number, input: BoardGameInput) {
  const index = games.findIndex((game) => game.id === id);

  if (index === -1) {
    return;
  }

  const updated: BoardGame = {
    ...games[index],
    ...input,
  };

  games[index] = updated;
  return updated;
}
```

- [ ] **Step 2: `updateGame` Server Action を追加する**

```ts
import { updateGame as updateGameData } from '@/lib/games';

export async function updateGame(id: number, prevState: State, formData: FormData): Promise<State> {
  const parsed = parseGameInput(formData);

  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }

  const updated = await updateGameData(id, parsed.input);

  if (!updated) {
    return { ok: false, error: 'ボードゲームが見つかりません' };
  }

  updateTag('games');
  redirect(`/games/${id}`);
}
```

- [ ] **Step 3: 編集ページを作る**

```tsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGame } from '@/lib/games';
import { updateGame } from '../../actions';
import GameForm from '../../components/GameForm';

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditGamePage({ params }: Props) {
  const { id } = await params;
  const game = await getGame(Number(id));

  if (!game) {
    notFound();
  }

  const action = updateGame.bind(null, game.id);

  return (
    <main>
      <Link href={`/games/${game.id}`}>詳細へ戻る</Link>
      <h1>{game.title} を編集</h1>
      <GameForm action={action} game={game} submitLabel="更新" />
    </main>
  );
}
```

- [ ] **Step 4: lint と test を実行する**

```bash
npm run lint
npm run test
```

Expected: ESLint と Vitest が通る。

- [ ] **Step 5: ブラウザで一連のフローを確認する**

Expected:

- `/` に一覧が表示される
- `/games/new` で登録できる
- 保存後 `/` に戻る
- 一覧から詳細へ移動できる
- 詳細から編集へ移動できる
- 編集後、詳細に戻って変更内容が見える

## 実装時に確認するドキュメント

Next.js 固有の API に触る前に、以下を確認する。

- `docs/nextjs-docs-cheatsheet.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
- `node_modules/next/dist/docs/01-app/02-guides/forms.md`
- `node_modules/next/dist/docs/01-app/01-getting-started/09-revalidating.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/04-functions/updateTag.md`

## 完了条件

- PR 1 から PR 4 まで、それぞれ単独でレビューできる粒度になっている
- 最終的に MVP の登録、一覧、詳細、編集フローが動く
- `npm run lint` が通る
- `npm run test` が通る
- ブラウザで主要フローを確認できる
