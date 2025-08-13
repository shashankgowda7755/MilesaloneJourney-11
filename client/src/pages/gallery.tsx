import GalleryGrid from "@/components/gallery/gallery-grid";

export default function Gallery() {
  return (
    <div className="min-h-screen bg-brand-cream py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-testid="gallery-header">
          <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-6">
            Visual Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every photograph tells a story of discovery, challenge, and the incredible diversity of landscapes, cultures, and moments that define authentic India travel. These collections capture the essence of each destination and the emotions of the journey.
          </p>
        </div>

        {/* Gallery Collections */}
        <GalleryGrid />
        
        {/* Bottom spacer to prevent navigation overlap */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
