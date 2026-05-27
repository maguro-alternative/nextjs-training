'use client';

import { useActionState } from 'react';
import type { BoardGame } from '@/lib/games';
import type { State } from '../actions';

type GameFormProps = {
  action: (prevState: State, formData: FormData) => Promise<State>;
  game?: BoardGame; // 新規作成では なし, 編集ではあり で 表示させる
  submitLabel: string;
};

const initialState: State = { ok: true };

export default function GameForm({ action, game, submitLabel }: GameFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <form action={formAction}>
      {state.error && <p>{state.error}</p>}

      <label>
        タイトル
        <input name="title" defaultValue={game?.title ?? ''} required />
      </label>

      <label>
        最小人数
        <input
          name="minPlayers"
          type="number"
          defaultValue={game?.minPlayers ?? 1}
        />
      </label>

      <label>
        最大人数
        <input
          name="maxPlayers"
          type="number"
          defaultValue={game?.maxPlayers ?? 4}
        />
      </label>

      <label>
        所要時間
        <input
          name="playTimeMinutes"
          type="number"
          defaultValue={game?.playTimeMinutes ?? 30}
        />
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
