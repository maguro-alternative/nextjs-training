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
