"use client";

import { useState, useRef, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { UploadCloud, Loader2, Copy, X, PawPrint, Cat, History, Video } from 'lucide-react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { getEmojiForPet } from './actions';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const ALTERNATIVE_EMOJIS = ['😀', '😂', '😍', '😴', '🤔', '😠', '😮'];

type PetMojiClientProps = {
  initialEmoji: string | null;
};

type HistoryItem = {
  image: string;
  emoji: string;
  comment: string;
};

export default function PetMojiClient({ initialEmoji }: PetMojiClientProps) {
  const [image, setImage] = useState<string | null>(null);
  const [emoji, setEmoji] = useState<string | null>(initialEmoji);
  const [comment, setComment] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDragging, setIsDragging] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (initialEmoji) {
      setEmoji(initialEmoji);
    }
  }, [initialEmoji]);

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video: true});
        setHasCameraPermission(true);

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
      }
    };

    getCameraPermission();
  }, []);

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

      startTransition(async () => {
        const result = await getEmojiForPet(dataUrl);
        if (result.success && result.emoji && result.comment) {
          setEmoji(result.emoji);
          setComment(result.comment);
          setShowResult(true);
          setHistory(prev => [{ image: dataUrl, emoji: result.emoji!, comment: result.comment! }, ...prev]);
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
    setError(null);
    setShowResult(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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

  const handleHistoryClick = (item: HistoryItem) => {
    setImage(item.image);
    setEmoji(item.emoji);
    setComment(item.comment);
    setShowResult(true);
  };

  const currentEmojis = emoji ? [...new Set([emoji, ...ALTERNATIVE_EMOJIS])] : ALTERNATIVE_EMOJIS;

  return (
    <div className="w-full max-w-2xl py-8 px-4 sm:px-6 lg:px-8">
      <div className="flex flex-col items-center text-center mb-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight font-headline text-primary transition-transform duration-300 hover:scale-105">PetMoji</h1>
        <p className="mt-3 text-lg text-muted-foreground">Turn your pet’s mood into emoji magic ✨</p>
      </div>

      <Card className="overflow-hidden transition-all duration-500 shadow-2xl rounded-3xl bg-card/60 backdrop-blur-sm border-white/10">
        <CardContent className="p-4 sm:p-6">
          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload"><UploadCloud className="mr-2"/>Upload Photo</TabsTrigger>
              <TabsTrigger value="camera"><Video className="mr-2"/>Live Camera</TabsTrigger>
            </TabsList>
            <TabsContent value="upload">
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
                  <p className="font-semibold text-lg text-center">Drop your pet photo here or click to upload</p>
                  <p className="text-muted-foreground text-sm mt-1">PNG, JPG, or WEBP</p>
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
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm animate-in fade-in duration-500">
                        <PawPrint className="w-12 h-12 animate-spin text-primary mb-4" />
                        <p className="text-lg font-semibold">Analyzing mood...</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="camera">
                <div className="flex flex-col items-center mt-4">
                    <div className="relative w-full aspect-video max-w-sm mx-auto rounded-2xl overflow-hidden shadow-lg mb-6 animate-in fade-in duration-500">
                        <video ref={videoRef} className="w-full aspect-video rounded-md" autoPlay muted playsInline />
                        {hasCameraPermission === false && (
                          <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-4">
                            <Alert variant="destructive">
                                <AlertTitle>Camera Access Denied</AlertTitle>
                                <AlertDescription>
                                Please enable camera permissions in your browser settings.
                                </AlertDescription>
                            </Alert>
                          </div>
                        )}
                        {hasCameraPermission === null && (
                          <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                            <p className="text-lg font-semibold">Accessing camera...</p>
                          </div>
                        )}
                    </div>
                     <div className="text-center w-full animate-in fade-in-0 zoom-in-95 duration-700">
                        <p className="text-muted-foreground">Detected Emotion</p>
                        <p className="text-8xl my-4">🤔</p>
                        <p className="text-lg text-foreground/80 mb-6 italic max-w-md mx-auto">"Curious"</p>
                        <div className="w-full bg-muted rounded-full h-2.5 mb-4">
                            <div className="bg-primary h-2.5 rounded-full" style={{width: "75%"}}></div>
                        </div>
                        <p className="text-sm text-muted-foreground">Confidence: 75%</p>
                    </div>
                </div>
            </TabsContent>
          </Tabs>

          {image && !isPending && (
            <div className={cn("text-center w-full", showResult ? "animate-in fade-in-0 zoom-in-95 duration-700" : "opacity-0")}>
              {emoji && (
                <>
                  <p className="text-muted-foreground">Your pet is feeling...</p>
                  <p className="text-8xl my-4 animate-bounce-in">{emoji}</p>
                  {comment && (
                    <p className="text-lg text-foreground/80 mb-6 italic max-w-md mx-auto">"{comment}"</p>
                  )}
                  
                  <div className="mt-4 bg-muted/50 p-4 rounded-xl">
                    <p className="text-sm text-muted-foreground mb-3 font-medium">Not quite right? Pick another!</p>
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
              <Alert variant="destructive" className="w-full mt-4 mb-4 animate-in fade-in duration-500">
              <AlertTitle>Analysis Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>

        {image && (
          <CardFooter className="bg-muted/30 p-4 flex flex-col sm:flex-row gap-2 justify-center">
             <Button onClick={handleReset} variant="outline" size="lg" className="transition-transform hover:scale-105 w-full sm:w-auto rounded-full">
              <X className="mr-2" /> Start Over
            </Button>
            <Button onClick={handleCopyLink} disabled={!emoji || isPending} size="lg" className="transition-transform hover:scale-105 w-full sm:w-auto rounded-full">
              <Copy className="mr-2" /> Share Result
            </Button>
          </CardFooter>
        )}
      </Card>
      
      {history.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-4 flex items-center justify-center gap-2">
            <History className="w-6 h-6" />
            Your PetMoji History
          </h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {history.map((item, index) => (
              <div key={index} className="flex-shrink-0" onClick={() => handleHistoryClick(item)}>
                <Card className="w-40 h-40 overflow-hidden cursor-pointer group relative transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105">
                  <Image src={item.image} alt="Historic pet" layout="fill" objectFit="cover" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
                  <div className="absolute bottom-1 right-1 text-4xl p-1 bg-black/30 rounded-lg backdrop-blur-sm">
                    {item.emoji}
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
