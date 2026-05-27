import Link from 'next/link';
import Image from 'next/image';
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

      <Image
        src={game.imageUrl}
        alt={game.title}
        width={480}
        height={320}
      />

      <p> プレイ人数: {game.minPlayers}〜{game.maxPlayers}人</p>
      <p> 所要時間: {game.playTimeMinutes}分</p>
      <p> {game.memo}</p>
      <Link href={`/games/${game.id}/edit`}>編集</Link>
    </main>
  );
}
