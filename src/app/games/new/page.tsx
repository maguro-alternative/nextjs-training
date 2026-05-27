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
