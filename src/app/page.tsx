import PetMojiClient from './petmoji-client';
import { cn } from '@/lib/utils';

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const emoji = typeof searchParams?.emoji === 'string' ? searchParams.emoji : null;

  return (
    <main className="bg-gradient-to-br from-[#FFD3B6] to-[#FFAAA5] dark:from-gray-900 dark:to-black">
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <PetMojiClient initialEmoji={emoji} />
      </div>
    </main>
  );
}
