import PetMojiClient from './petmoji-client';

export default function Home({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const emoji = typeof searchParams?.emoji === 'string' ? searchParams.emoji : null;

  return (
    <main>
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <PetMojiClient initialEmoji={emoji} />
      </div>
    </main>
  );
}
