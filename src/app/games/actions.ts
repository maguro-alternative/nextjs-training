'use server';

import { redirect } from 'next/navigation';
import { addGame, placeholderImageUrl, updateGame as updateGameData } from '@/lib/games';


// 前回の状態を維持してformを更新したりする。
export type State = {
  ok: boolean;
  error?: string;
};

export async function createGame(
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const parsed = parseGameInput(formData);

  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }

  await addGame(parsed.input);

  redirect('/');
}

export async function updateGame(
  id: number,
  _prevState: State,
  formData: FormData,
): Promise<State> {
  const parsed = parseGameInput(formData);

  if (!parsed.ok) {
    return { ok: false, error: parsed.error };
  }

  const updated = await updateGameData(id, parsed.input);

  if (!updated) {
    return { ok: false, error: 'ボードゲームが見つかりません' };
  }

  redirect(`/games/${id}`);
}


function parseGameInput(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim();
  const minPlayers = Number(formData.get('minPlayers'));
  const maxPlayers = Number(formData.get('maxPlayers'));
  const playTimeMinutes = Number(formData.get('playTimeMinutes'));
  const memo = String(formData.get('memo') ?? '').trim();
  const imageUrlTmp = String(formData.get('imageUrl') ?? '').trim();
  const imageUrl = imageUrlTmp.length > 0 ? imageUrlTmp : placeholderImageUrl(title);

  if (title.length === 0) {
    return { ok: false as const, error: 'タイトルは必須です' };
  }

  if (
    !Number.isFinite(minPlayers) ||
    !Number.isFinite(maxPlayers) ||
    !Number.isFinite(playTimeMinutes)
  ) {
    return { ok: false as const, error: '人数、所要時間は数値で入力してください' };
  }

  return {
    ok: true as const,
    input: {
      title,
      minPlayers,
      maxPlayers,
      playTimeMinutes,
      memo,
      imageUrl,
    },
  };
}
