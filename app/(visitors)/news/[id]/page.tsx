'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Calendar,
  User,
  Clock,
  Share2,
  BookmarkPlus,
  Eye,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  useNews,
  type NewsArticle,
} from '@/hooks/use-news';

export type NewsItem = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: string;
  image: string;
  published: boolean;
  date: string;
  createdAt: string;
};

export default function NewsDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getNewsById, news, loading } = useNews();
  const [article, setArticle] =
    useState<NewsArticle | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [readingTime, setReadingTime] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const relatedRef = useRef<HTMLElement>(null);

  // Fetch article by ID
  useEffect(() => {
    const id = params.id as string;
    if (id) {
      getNewsById(id).then(data => {
        if (data && data.id) {
          setArticle(data);
          // Calculate reading time (average 200 words per minute)
          const wordCount = data.content.split(' ').length;
          setReadingTime(Math.ceil(wordCount / 200));
        } else {
          setNotFound(true);
        }
      });
    }
  }, [params.id, getNewsById]);

  // Simple scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;
      const progress = (scrolled / maxScroll) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  console.log('article:', article);

  // Loading state
  if (loading || (!article && !notFound)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="loading-spinner"></div>
          <p className="text-muted-foreground">
            Loading article...
          </p>
        </div>
      </div>
    );
  }

  // Not found state
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold mb-4">
            Article not found
          </h2>
          <Button onClick={() => router.push('/news')}>
            Back to News
          </Button>
        </div>
      </div>
    );
  }

  // From here, article is guaranteed to be non-null
  const shouldTruncate = article!.content.length > 500;
  const displayContent = isExpanded
    ? article!.content
    : article!.content.substring(0, 500);

  const relatedArticles: NewsArticle[] = news
    .filter(
      n =>
        n.id !== article!.id &&
        n.category === article!.category
    )
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white">
      {/* Progress Bar */}
      <div
        className="progress-bar"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Header */}
      <header className="sticky-header">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => router.back()}
              className="flex items-center space-x-2"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon">
                <Share2 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <BookmarkPlus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="relative h-[60vh] overflow-hidden">
          <Image
            src={
              article!.image ||
              '/placeholder.svg?height=600&width=1200&query=news article hero' ||
              '/placeholder.svg' ||
              '/placeholder.svg'
            }
            alt={article!.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="container mx-auto">
              <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">
                {article!.category}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                {article!.title}
              </h1>
              <p className="text-xl text-gray-200 max-w-3xl">
                {article!.excerpt}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Meta */}
          <div className="article-meta">
            <div className="flex items-center space-x-2 text-muted-foreground">
              <User className="h-5 w-5" />
              <span className="font-medium">
                {article!.author}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span>
                {new Date(
                  article!.date || ''
                ).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </span>
            </div>
            <div className="flex items-center space-x-2 text-muted-foreground">
              <Clock className="h-5 w-5" />
              <span>{readingTime} min read</span>
            </div>
            {/* <div className="flex items-center space-x-2 text-muted-foreground">
              <Eye className="h-5 w-5" />
              <span>1.2k views</span>
            </div> */}
          </div>

          {/* Article Body */}
          <article className="article-content">
            <div className="content-card">
              <div className="content-text">
                <p className="whitespace-pre-wrap">
                  {displayContent}
                  {shouldTruncate && !isExpanded && '...'}
                </p>
              </div>

              {shouldTruncate && (
                <div className="read-more-container">
                  <Button
                    onClick={() =>
                      setIsExpanded(!isExpanded)
                    }
                    variant="outline"
                    size="lg"
                    className="read-more-btn"
                  >
                    {isExpanded ? (
                      <>
                        <span>Show Less</span>
                        <ChevronUp className="ml-2 h-4 w-4" />
                      </>
                    ) : (
                      <>
                        <span>Read More</span>
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </article>

          <Separator className="my-12" />

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <section
              ref={relatedRef}
              className="related-section"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">
                Related Articles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {relatedArticles.map(
                  (relatedArticle, index) => (
                    <div
                      key={relatedArticle.id}
                      className="related-card"
                      onClick={() =>
                        router.push(
                          `/news/${relatedArticle.id}`
                        )
                      }
                    >
                      <Card className="card-hover">
                        <div className="card-image-container">
                          <Image
                            src={
                              relatedArticle.image ||
                              '/placeholder.svg?height=200&width=300&query=related article' ||
                              '/placeholder.svg' ||
                              '/placeholder.svg'
                            }
                            alt={relatedArticle.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardContent className="p-6">
                          <Badge
                            variant="outline"
                            className="mb-3"
                          >
                            {relatedArticle.category}
                          </Badge>
                          <h3 className="card-title">
                            {relatedArticle.title}
                          </h3>
                          <p className="card-excerpt">
                            {relatedArticle.excerpt}
                          </p>
                          <div className="card-date">
                            <Calendar className="h-3 w-3 mr-1" />
                            <span>
                              {relatedArticle.date
                                ? new Date(
                                    relatedArticle.date
                                  ).toLocaleDateString()
                                : 'N/A'}
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )
                )}
              </div>
            </section>
          )}

          {/* Back to Top */}
          <div className="back-to-top">
            <Button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth',
                })
              }
              variant="outline"
              size="lg"
              className="back-btn"
            >
              Back to Top
            </Button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .progress-bar {
          position: fixed;
          top: 0;
          left: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            #3b82f6,
            #1d4ed8
          );
          z-index: 50;
          transition: width 0.1s ease-out;
        }

        .sticky-header {
          position: sticky;
          top: 0;
          z-index: 40;
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
        }

        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid #f3f4f6;
          border-top: 4px solid #3b82f6;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }

        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .hero-section {
          opacity: 1;
          animation: fadeIn 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .article-meta {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 1.5rem;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
          animation: slideUp 0.6s ease-out 0.2s both;
        }

        .article-content {
          animation: slideUp 0.6s ease-out 0.4s both;
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .content-card {
          background: white;
          border-radius: 1rem;
          padding: 2rem;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .content-text {
          color: #374151;
          line-height: 1.8;
          font-size: 1.125rem;
        }

        .read-more-container {
          margin-top: 2rem;
          text-align: center;
        }

        .read-more-btn {
          transition: all 0.3s ease;
        }

        .read-more-btn:hover {
          background: #eff6ff;
          border-color: #93c5fd;
          transform: translateY(-2px);
        }

        .related-section {
          margin-top: 4rem;
          animation: slideUp 0.6s ease-out 0.6s both;
        }

        .related-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fit,
            minmax(300px, 1fr)
          );
          gap: 1.5rem;
        }

        .related-card {
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .related-card:hover {
          transform: translateY(-5px);
        }

        .card-hover {
          overflow: hidden;
          transition: all 0.3s ease;
          border: none;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          height: 100%;
        }

        .card-hover:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .card-image-container {
          position: relative;
          height: 12rem;
          overflow: hidden;
        }

        .card-image {
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .card-hover:hover .card-image {
          transform: scale(1.05);
        }

        .card-title {
          font-weight: 600;
          font-size: 1.125rem;
          margin-bottom: 0.5rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .card-excerpt {
          color: #6b7280;
          font-size: 0.875rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 1rem;
        }

        .card-date {
          display: flex;
          align-items: center;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .back-to-top {
          text-align: center;
          margin-top: 4rem;
        }

        .back-btn {
          transition: all 0.3s ease;
        }

        .back-btn:hover {
          background: #eff6ff;
          border-color: #93c5fd;
          transform: translateY(-2px);
        }

        @media (max-width: 768px) {
          .article-meta {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .related-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
