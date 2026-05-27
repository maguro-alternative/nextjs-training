# ボードゲーム管理アプリ MVP 設計

## 目的

自分が持っているボードゲームを登録し、一覧・詳細で見返せるようにする。
人数と所要時間も保存し、「今日は何を遊ぶか」を選びやすくする。

## スコープ

### 作るもの

- `/` でボードゲーム一覧を表示する
- `/games/new` でボードゲームを新規登録する
- `/games/[id]` でボードゲーム詳細を表示する
- `/games/[id]/edit` で登録済みボードゲームを編集する
- 新規作成と編集では共通フォームを使う
- データはメモリ上の配列で保存する

### 作らないもの

- DB 永続化
- 削除機能
- 検索・絞り込み
- 画像アップロード
- 認証
- 複雑な入力バリデーション

## ルーティング

Next.js App Router のファイルベースルーティングを使う。
`app` 配下のフォルダを URL セグメントにし、動的ルートは `[id]` を使う。

```text
src/app/page.tsx
src/app/games/new/page.tsx
src/app/games/[id]/page.tsx
src/app/games/[id]/edit/page.tsx
```

各ページの役割は以下とする。

- `/`
  - ボードゲーム一覧
  - 画像、タイトル、プレイ人数、所要時間を表示する
  - 各ゲームの詳細ページへ移動できる
  - 新規作成ページへ移動できる
- `/games/new`
  - 新しいボードゲームを追加するフォームを表示する
  - 保存後は `/` に戻る
- `/games/[id]`
  - ボードゲーム詳細を表示する
  - タイトル、画像、プレイ人数、所要時間、説明メモを表示する
  - 編集ページへ移動できる
  - 対象が存在しない場合は `notFound()` を使う
- `/games/[id]/edit`
  - 登録済みボードゲームを編集するフォームを表示する
  - 保存後は詳細ページへ戻る
  - 対象が存在しない場合は `notFound()` を使う

## ファイル構成

既存の `posts` 実装に寄せた最小構成にする。

```text
src/lib/games.ts
src/app/page.tsx
src/app/games/actions.ts
src/app/games/new/page.tsx
src/app/games/[id]/page.tsx
src/app/games/[id]/edit/page.tsx
src/app/games/components/GameForm.tsx
```

### `src/lib/games.ts`

メモリ上の配列と操作関数を持つ。
画面や Server Action は配列を直接触らず、このファイルの関数だけを使う。

これにより、後で DB に変える場合も、主にこのファイルの中身を差し替えればよい構成にする。

### `src/app/games/actions.ts`

Server Actions を置く。

- `createGame`
- `updateGame`

フォームから受け取った `FormData` をパースし、最小限のバリデーションを行い、`src/lib/games.ts` の関数を呼ぶ。

### `src/app/games/components/GameForm.tsx`

新規作成と編集で共通利用するフォームコンポーネント。
Client Component にして `useActionState` を使い、Server Action のバリデーションエラーを表示する。

## データモデル

画面に表示するデータと、フォームから受け取る入力データを分ける。

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

`BoardGame` は保存済みデータを表す。
`BoardGameInput` は新規作成・編集時の入力値を表す。

`id` は MVP では `Date.now()` で作る。
`createdAt` は `new Date().toISOString()` で作る。

## データ操作関数

`src/lib/games.ts` には以下の関数を置く。

```ts
getGames()
getGame(id)
addGame(input)
updateGame(id, input)
```

戻り値と役割は以下とする。

- `getGames()`
  - 一覧表示用に全件を返す
- `getGame(id)`
  - ID に一致する 1 件を返す
  - 見つからない場合は `undefined` を返す
- `addGame(input)`
  - `BoardGameInput` を受け取り、`id` と `createdAt` を付けて配列に追加する
  - 作成した `BoardGame` を返す
- `updateGame(id, input)`
  - ID に一致するゲームを更新する
  - 見つからない場合は `undefined` を返す
  - 更新した `BoardGame` を返す

## 入力項目

新規作成・編集フォームでは以下を入力する。

- `title`
- `minPlayers`
- `maxPlayers`
- `playTimeMinutes`
- `memo`
- `imageUrl`

フォーム UI は最小構成にする。
`minPlayers`, `maxPlayers`, `playTimeMinutes` は `type="number"` を使う。
`memo` は `textarea` を使う。

## バリデーション

MVP では Server Action 側で最小限だけチェックする。

- `title` は必須
- `minPlayers` は数値
- `maxPlayers` は数値
- `playTimeMinutes` は数値

`minPlayers <= maxPlayers`、URL形式、メモ文字数上限などは後回しにする。

## データフロー

### 一覧表示

1. `/` の Server Component で `getGames()` を呼ぶ
2. 返ってきた配列を表示する
3. 各ゲームのタイトルやカードから `/games/[id]` に移動する

### 新規作成

1. `/games/new` で `GameForm` を表示する
2. フォーム送信で `createGame` を呼ぶ
3. `createGame` が `FormData` をパースする
4. バリデーションに失敗したらエラーを返す
5. 成功したら `addGame(input)` を呼ぶ
6. 保存後に `/` へ `redirect()` する

### 詳細表示

1. `/games/[id]` で `params` から `id` を受け取る
2. `getGame(Number(id))` を呼ぶ
3. 見つからなければ `notFound()` を呼ぶ
4. 見つかれば詳細を表示する

### 編集

1. `/games/[id]/edit` で `params` から `id` を受け取る
2. `getGame(Number(id))` を呼ぶ
3. 見つからなければ `notFound()` を呼ぶ
4. 見つかれば `GameForm` に初期値を渡す
5. フォーム送信で `updateGame` を呼ぶ
6. 成功したら `/games/[id]` へ `redirect()` する

## キャッシュと再表示

既存の `posts` 実装に寄せて、一覧・詳細データにはキャッシュタグを付ける。
作成・更新後は Server Action でタグを更新し、表示が古いままにならないようにする。

- キャッシュタグ: `games`
- 作成後: `updateTag('games')`
- 更新後: `updateTag('games')`

実装時は Next.js 16 のキャッシュ API に合わせて、既存の `posts` 実装とローカルドキュメントを再確認する。

## エラー処理

- 存在しない ID の詳細・編集ページは `notFound()` を使う
- フォームの入力エラーは `useActionState` でフォーム上に表示する
- 予期しない DB エラーなどは MVP では扱わない

## テスト方針

最低限、以下を確認する。

- `npm run lint`
- `npm run test`
- 必要に応じて画面をブラウザで確認する

手動確認では以下を見る。

- `/` に一覧が表示される
- `/games/new` で登録できる
- 保存後 `/` に戻る
- 一覧から詳細へ移動できる
- 詳細から編集へ移動できる
- 編集後、詳細に戻って変更内容が見える

## 参照した既存実装

- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/src/lib/posts.ts`
- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/src/app/posts/page.tsx`
- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/src/app/posts/actions.ts`
- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/src/app/posts/new/PostForm.tsx`
- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/src/app/posts/[id]/page.tsx`

## 参照した Next.js ドキュメント

- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/docs/nextjs-docs-cheatsheet.md`
- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md`
- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md`
- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md`
- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/node_modules/next/dist/docs/01-app/01-getting-started/07-mutating-data.md`
- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/node_modules/next/dist/docs/01-app/02-guides/forms.md`
- `/Users/takeharu.suzuki/ws/github.com/wapust/nextjs-training/node_modules/next/dist/docs/01-app/01-getting-started/12-images.md`
