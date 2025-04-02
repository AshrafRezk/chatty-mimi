
import { useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { useChat } from "@/context/ChatContext";

interface PropertyImage {
  url: string;
  title: string;
  description?: string;
}

interface RealEstateGalleryProps {
  images: PropertyImage[];
}

const RealEstateGallery = ({ images }: RealEstateGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { state } = useChat();
  const { language } = state;

  return (
    <Card className="border rounded-lg overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <Carousel className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="relative">
                    <img 
                      src={image.url} 
                      alt={image.title} 
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-3 text-white backdrop-blur-sm">
                      <h3 className="font-medium">{image.title}</h3>
                      {image.description && (
                        <p className="text-xs opacity-90 line-clamp-2 mt-1">{image.description}</p>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2" />
            <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2" />
          </Carousel>
          
          <div className="p-3 text-center text-sm text-muted-foreground">
            {language === 'ar' 
              ? `صورة ${currentIndex + 1} من ${images.length}` 
              : `Image ${currentIndex + 1} of ${images.length}`}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RealEstateGallery;
