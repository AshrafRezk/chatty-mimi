
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }
    
    // Mock implementation for demonstration
    // In production, this would call an actual music recognition API like AudD or ACRCloud
    
    // For demonstration, we'll return a mock result after a short delay
    // to simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Randomly return one of several predefined tracks
    const mockTracks = [
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
      }
    ];
    
    // Randomly select a track
    const mockTrack = mockTracks[Math.floor(Math.random() * mockTracks.length)];
    
    return new Response(
      JSON.stringify(mockTrack),
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
