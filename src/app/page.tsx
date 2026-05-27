import Link from 'next/link';
import { getGames } from '@/lib/games';
import Image from 'next/image';
// @はsrcの位置のalias

export default async function HomePage() {
  const games = await getGames();

  return (
    <main>
      <h1>ボードゲーム一覧</h1>

      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link href={`/games/${game.id}`}>
              <Image 
                src={game.imageUrl}
                alt={game.title}
                width={240}
                height={240}
              />
              <h2>{game.title}</h2>
            </Link>

            <p>
              {game.minPlayers}〜{game.maxPlayers}人
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
