import BlogGrid from "@/components/blog/blog-grid";

export default function Letters() {
  return (
    <div className="min-h-screen bg-brand-cream py-16 lg:py-24">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16" data-testid="letters-header">
          <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-brand-brown mb-6">
            Travel Letters
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Authentic stories from the road - the struggles, discoveries, and unexpected connections that make solo travel transformative. Each letter captures a moment, a lesson, or an encounter that shaped this incredible journey.
          </p>
        </div>

        {/* Blog Grid with Search and Filters */}
        <BlogGrid />
        
        {/* Bottom spacer to prevent navigation overlap */}
        <div className="h-24"></div>
      </div>
    </div>
  );
}
