'use client';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, User, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { useNews } from '@/hooks/use-news';
import { useState } from 'react';
import Link from 'next/link';

export default function NewsPage() {
  const { news, loading } = useNews();
  const [page, setPage] = useState(1);
  const pageSize = 6;

  // Sort news by date descending (if date exists)
  const sortedNews = [...news]
    .filter(item => item.published) // ✅ only show published
    .sort((a, b) => {
      if (a.date && b.date) {
        return (
          new Date(b.date).getTime() -
          new Date(a.date).getTime()
        );
      }
      return 0;
    });

  // Pagination logic
  const totalPages = Math.ceil(
    sortedNews.length / pageSize
  );
  const paginatedNews = sortedNews.slice(
    (page - 1) * pageSize,
    page * pageSize
  );
  const latestNews = sortedNews.slice(0, 3);

  // Empty state
  const isEmpty = !loading && sortedNews.length === 0;

  return (
    <div className="min-h-screen">
      <main>
        {/* Latest News Section */}
        {!isEmpty && (
          <section className="py-16 bg-muted/30 container mx-auto">
            <div className="container">
              <div className="text-center mb-12 animate-fade-in">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                  Latest News
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Stay updated with the latest happenings.
                  {/* and achievements at Royal Academy */}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {latestNews.map((news, index) => (
                  <Card
                    key={news.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-fade-in"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    <div className="relative h-48">
                      <Image
                        src={
                          news.image || '/placeholder.svg'
                        }
                        alt={news.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 left-4">
                        {news.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {news.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{news.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(
                              news.date || ''
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        asChild
                      >
                        <Link href={`/news/${news.id}`}>
                          Read More{' '}
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* All News Section */}
        {!isEmpty && (
          <section className="py-16 container mx-auto">
            <div className="container">
              <h2 className="text-3xl font-bold mb-12 animate-fade-in">
                All News
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {paginatedNews.map((news, index) => (
                  <Card
                    key={news.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 animate-slide-up"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="relative h-48">
                      <Image
                        src={
                          news.image || '/placeholder.svg'
                        }
                        alt={news.title}
                        fill
                        className="object-cover"
                      />
                      <Badge className="absolute top-4 left-4">
                        {news.category}
                      </Badge>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-3 line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {news.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4" />
                          <span>{news.author}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4" />
                          <span>
                            {new Date(
                              news.date || ''
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                      >
                        Read More{' '}
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-12">
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    {Array.from(
                      { length: totalPages },
                      (_, i) => (
                        <Button
                          key={i + 1}
                          size="sm"
                          variant={
                            page === i + 1
                              ? undefined
                              : 'outline'
                          }
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </Button>
                      )
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Empty State */}
        {isEmpty && !loading && (
          <section className="py-32 flex flex-col items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">
                No news articles found
              </h2>
              <p className="text-muted-foreground mb-8">
                Please check back later for updates.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
