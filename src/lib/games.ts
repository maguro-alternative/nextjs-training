// import { cacheLife, cacheTag } from 'next/cache';

export type BoardGame = {
  id: number;
  title: string;
  minPlayers: number;
  maxPlayers: number;
  imageUrl: string;
};

function placeholderImageUrl(title: string) {
    return 'https://placehold.jp/600x400/png?text=' + title
}

const games: BoardGame[] = [
  {
    id: 1,
    title: 'カタン',
    minPlayers: 3,
    maxPlayers: 4,
    imageUrl: 'https://placehold.co/600x400/png?text=Catan'
  },
  {
    id: 2,
    title: 'カルカソンヌ',
    minPlayers: 2,
    maxPlayers: 5,
    imageUrl: 'https://placehold.co/600x400/png?text=Carcassone'
  },
  {
    id: 3,
    title: '宝石の輝き',
    minPlayers: 2,
    maxPlayers: 4,
    imageUrl: placeholderImageUrl('宝石の輝き')
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
