"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { UploadCloud, Loader2, Copy, X, PawPrint, Cat } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getEmojiForPet } from './actions';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const ALTERNATIVE_EMOJIS = ['😀', '😂', '😍', '😴', '🤔', '😠', '😮'];

type PetMojiClientProps = {
  initialEmoji: string | null;
};

type HistoryItem = {
  image: string;
  emoji: string;
  comment: string;
  confidence: number;
};

export default function PetMojiClient({ initialEmoji }: PetMojiClientProps) {
  const [image, setImage] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string | null>(initialEmoji);
  const [comment, setComment] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [showResult, setShowResult] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialEmoji) {
      setEmoji(initialEmoji);
    }
  }, [initialEmoji]);

  const handleFileSelect = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file.');
      return;
    }
    setShowResult(false);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);
      setError(null);
      setEmoji(null);
      setComment(null);
      setConfidence(null);

      startTransition(async () => {
        const result = await getEmojiForPet(dataUrl);
        if (result.success && result.emoji && result.comment && result.confidence) {
          const newHistoryItem = {
            image: dataUrl,
            emoji: result.emoji,
            comment: result.comment,
            confidence: result.confidence
          };
          setEmoji(result.emoji);
          setComment(result.comment);
          setConfidence(result.confidence);
          setHistory(prev => [newHistoryItem, ...prev]);
          setShowResult(true);
        } else {
          setError(result.error);
        }
      });
    };
    reader.readAsDataURL(file);
  };

  const handleDragEvents = (e: React.DragEvent<HTMLDivElement>, isOver: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(isOver);
  };
  
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    handleDragEvents(e, false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleReset = () => {
    setImage(null);
    setEmoji(null);
    setComment(null);
    setConfidence(null);
    setError(null);
    setShowResult(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleHistoryClick = (item: HistoryItem) => {
    setImage(item.image);
    setEmoji(item.emoji);
    setComment(item.comment);
    setConfidence(item.confidence);
    setShowResult(true);
  }

  const handleCopyLink = () => {
    const url = new URL(window.location.href);
    if (emoji) {
      url.searchParams.set('emoji', emoji);
    } else {
      url.searchParams.delete('emoji');
    }
    
    navigator.clipboard.writeText(url.toString());
    toast({
      title: 'Link Copied!',
      description: 'You can now share your pet\'s emoji with friends.',
    });
  };

  const currentEmojis = emoji ? [...new Set([emoji, ...ALTERNATIVE_EMOJIS])] : ALTERNATIVE_EMOJIS;

  return (
    <div className="w-full max-w-2xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-headline text-primary transition-transform duration-300 hover:scale-105">PetMoji</h1>
        <p className="mt-3 text-lg text-primary/80">Turn your pet’s mood into emoji magic ✨</p>
      </div>

      <Card className="overflow-hidden transition-all duration-500 shadow-2xl rounded-3xl bg-white/60 backdrop-blur-md border-white/20">
        <CardContent className="p-4 sm:p-6">
          {!image ? (
            <div
              className={cn(
                "flex flex-col items-center justify-center p-10 py-16 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-300 ease-in-out mt-4",
                isDragging ? "border-primary bg-primary/10 scale-105 shadow-2xl shadow-primary/30" : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
              )}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => handleDragEvents(e, true)}
              onDragLeave={(e) => handleDragEvents(e, false)}
              onDrop={handleDrop}
            >
              <div className="text-primary mb-4 transition-transform duration-300 group-hover:scale-110">
                  <Cat className="w-16 h-16" />
              </div>
              <p className="font-semibold text-lg text-center text-primary/90">Drop your pet photo here or click to upload</p>
              <p className="text-primary/70 text-sm mt-1">PNG, JPG, or WEBP</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/png, image/jpeg, image/webp"
                onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
              />
            </div>
          ) : (
            <div className="flex flex-col items-center mt-4">
              <div className="relative w-full aspect-square max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg mb-6 animate-in fade-in duration-500">
                <Image src={image} alt="User's pet" layout="fill" objectFit="cover" data-ai-hint="pet animal" />
                {isPending && (
                  <div className="absolute inset-0 bg-white/50 flex flex-col items-center justify-center text-primary backdrop-blur-sm animate-in fade-in duration-500">
                    <PawPrint className="w-12 h-12 animate-spin text-primary mb-4" />
                    <p className="text-lg font-semibold">Analyzing mood...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {image && !isPending && (
            <div className={cn("text-center w-full", showResult ? "animate-in fade-in-0 zoom-in-95 duration-700" : "opacity-0")}>
              {emoji && (
                <>
                  <p className="text-primary/80">Your pet is feeling...</p>
                  <p className="text-8xl my-4 animate-bounce-in">{emoji}</p>
                  {comment && (
                     <p className="text-lg text-primary/80 mb-6 italic max-w-md mx-auto">"{comment}" ({confidence}% confident)</p>
                  )}
                  
                  <div className="mt-4 bg-primary/10 p-4 rounded-xl">
                    <p className="text-sm text-primary/80 mb-3 font-medium">Not quite right? Pick another!</p>
                    <div className="flex justify-center flex-wrap gap-2">
                      {currentEmojis.map((e) => (
                        <button
                          key={e}
                          onClick={() => setEmoji(e)}
                          className={cn(
                            "text-3xl p-2 rounded-full transition-all duration-200 ease-in-out",
                            e === emoji ? 'bg-primary/20 scale-125 ring-2 ring-primary' : 'hover:bg-primary/10 hover:scale-110'
                          )}
                          aria-label={`Select emoji ${e}`}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
          {error && !isPending && (
              <Alert variant="destructive" className="w-full mt-4 mb-4 animate-in fade-in duration-500 bg-red-100 border-red-400 text-red-800">
                <AlertTitle>Analysis Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        {image && (
          <CardFooter className="bg-white/30 p-4 flex flex-col sm:flex-row gap-2 justify-center">
             <Button onClick={handleReset} variant="outline" size="lg" className="transition-transform hover:scale-105 w-full sm:w-auto rounded-full text-primary border-primary hover:bg-primary hover:text-white">
              <X className="mr-2" /> Start Over
            </Button>
            <Button onClick={handleCopyLink} disabled={!emoji || isPending} size="lg" className="transition-transform hover:scale-105 w-full sm:w-auto rounded-full bg-primary text-white hover:bg-primary/90">
              <Copy className="mr-2" /> Share Result
            </Button>
          </CardFooter>
        )}
      </Card>

      {history.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-4 text-primary">Your PetMoji History</h2>
          <ScrollArea className="w-full whitespace-nowrap rounded-lg">
            <div className="flex w-max space-x-4 p-4">
              {history.map((item, index) => (
                <figure key={index} className="shrink-0 cursor-pointer" onClick={() => handleHistoryClick(item)}>
                  <div className="overflow-hidden rounded-md relative group">
                    <Image
                      src={item.image}
                      alt="A pet from history"
                      className="h-32 w-32 object-cover transition-transform duration-300 group-hover:scale-110"
                      width={128}
                      height={128}
                    />
                     <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-4xl">{item.emoji}</span>
                    </div>
                  </div>
                </figure>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </div>
  );
}
