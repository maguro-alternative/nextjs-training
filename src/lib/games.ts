// import { cacheLife, cacheTag } from 'next/cache';

export type BoardGame = {
  id: number;
  title: string;
  minPlayers: number;
  maxPlayers: number;
  imageUrl: string;
  playTimeMinutes: number;
  memo: string;
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




export function placeholderImageUrl(title: string) {
    return 'https://placehold.jp/600x400/png?text=' + title
}

const games: BoardGame[] = [
  {
    id: 1,
    title: 'カタン',
    minPlayers: 3,
    maxPlayers: 4,
    imageUrl: 'https://placehold.co/600x400/png?text=Catan',
    playTimeMinutes: 70,
    memo: 'おもしろいがルールを説明するのが大変',
    createdAt: "2026-05-27T13:39:18+0900"
  },
  {
    id: 2,
    title: 'カルカソンヌ',
    minPlayers: 2,
    maxPlayers: 5,
    imageUrl: 'https://placehold.co/600x400/png?text=Carcassone',
    playTimeMinutes: 70,
    memo: 'おもしろいがルールを説明するのが大変',
    createdAt: "2026-05-27T13:39:18+0900"
  },
  {
    id: 3,
    title: '宝石の輝き',
    minPlayers: 2,
    maxPlayers: 4,
    imageUrl: placeholderImageUrl('宝石の輝き'),
    playTimeMinutes: 70,
    memo: 'おもしろいがルールを説明するのが大変',
    createdAt: "2026-05-27T13:39:18+0900"
  },
];

export async function getGames() {
  //'use cache';

  // cacheしたときに、tagと残す時間を設定
  // cacheLife('hours');
  // cacheTag('games');

  return games;
}

export async function getGame(id: number) {
  return games.find((game) => game.id === id);
}


export async function addGame(input: BoardGameInput) {
  const game: BoardGame = {
    id: Date.now(),
    ...input,
    createdAt: new Date().toISOString(),
  };

  games.push(game);

  return game;
}

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
