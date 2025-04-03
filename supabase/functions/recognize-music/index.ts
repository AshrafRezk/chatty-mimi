
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Process audio data for recognition
const processAudioForRecognition = (audioBase64: string) => {
  try {
    // This would be where we'd pre-process the audio for better recognition
    // For now, just return the audio data as-is
    return audioBase64;
  } catch (error) {
    console.error('Error processing audio:', error);
    throw error;
  }
};

// Mock database of songs for recognition
const songDatabase = [
  { 
    title: "Bohemian Rhapsody", 
    artist: "Queen", 
    album: "A Night at the Opera", 
    releaseYear: 1975,
    coverArt: "https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png"
  },
  { 
    title: "Billie Jean", 
    artist: "Michael Jackson", 
    album: "Thriller", 
    releaseYear: 1982,
    coverArt: "https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png"
  },
  { 
    title: "Shape of You", 
    artist: "Ed Sheeran", 
    album: "÷", 
    releaseYear: 2017,
    coverArt: "https://upload.wikimedia.org/wikipedia/en/4/45/Divide_cover.png"
  },
  { 
    title: "Blinding Lights", 
    artist: "The Weeknd", 
    album: "After Hours", 
    releaseYear: 2020,
    coverArt: "https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png"
  },
  { 
    title: "Bad Guy", 
    artist: "Billie Eilish", 
    album: "When We All Fall Asleep, Where Do We Go?", 
    releaseYear: 2019,
    coverArt: "https://upload.wikimedia.org/wikipedia/en/3/38/When_We_All_Fall_Asleep%2C_Where_Do_We_Go%3F.png"
  },
  { 
    title: "Dance Monkey", 
    artist: "Tones and I", 
    album: "The Kids Are Coming", 
    releaseYear: 2019,
    coverArt: "https://upload.wikimedia.org/wikipedia/en/1/1f/Dance_Monkey_by_Tones_and_I.jpg"
  },
  { 
    title: "Uptown Funk", 
    artist: "Mark Ronson ft. Bruno Mars", 
    album: "Uptown Special", 
    releaseYear: 2014,
    coverArt: "https://upload.wikimedia.org/wikipedia/en/7/72/Mark_Ronson_-_Uptown_Funk_%28feat._Bruno_Mars%29_%28Official_Single_Cover%29.png"
  },
  { 
    title: "Despacito", 
    artist: "Luis Fonsi ft. Daddy Yankee", 
    album: "VIDA", 
    releaseYear: 2017,
    coverArt: "https://upload.wikimedia.org/wikipedia/en/c/c8/Luis_Fonsi_Feat._Daddy_Yankee_-_Despacito_%28Official_Single_Cover%29.png"
  }
];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get audio data from request
    const requestData = await req.json();
    const { audio, format, sampleRate } = requestData;
    
    if (!audio) {
      throw new Error('No audio data provided');
    }
    
    console.log(`Received audio data (${audio.length} bytes), format: ${format || 'unknown'}, sample rate: ${sampleRate || 'unknown'}`);
    
    // Process audio data for recognition
    const processedAudio = processAudioForRecognition(audio);
    
    // In a real implementation, we'd call an actual music recognition API here
    // For now, we'll simulate API processing time and return a mock result
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Randomly select a track with a preference for more recent songs (more common)
    // We'll weight the selection based on release year to favor newer songs
    const weightedSelection = () => {
      // Sort songs by release year (descending)
      const sortedSongs = [...songDatabase].sort((a, b) => b.releaseYear - a.releaseYear);
      
      // Calculate weight based on position (more recent songs get higher weight)
      const weights = sortedSongs.map((_, index) => 1 / (index + 1));
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
      
      // Normalize weights
      const normalizedWeights = weights.map(weight => weight / totalWeight);
      
      // Select a song based on normalized weights
      const randomValue = Math.random();
      let cumulativeWeight = 0;
      
      for (let i = 0; i < normalizedWeights.length; i++) {
        cumulativeWeight += normalizedWeights[i];
        if (randomValue <= cumulativeWeight) {
          return sortedSongs[i];
        }
      }
      
      // Fallback to the most recent song
      return sortedSongs[0];
    };
    
    const selectedTrack = weightedSelection();
    
    console.log(`Identified track: ${selectedTrack.title} by ${selectedTrack.artist}`);
    
    return new Response(
      JSON.stringify(selectedTrack),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    console.error('Error in music recognition:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    );
  }
});
