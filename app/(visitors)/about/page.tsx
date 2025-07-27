'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Target,
  Eye,
  Award,
  Calendar,
  Users,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { useAbout } from '@/hooks/use-about';
import { useSettings } from '@/contexts/settings-context';

export default function AboutPage() {
  const { aboutData, loading } = useAbout();
  const { settings } = useSettings();
 

  // Get sections by key
  const heroSection = aboutData.sections.find(
    s => s.section === 'hero'
  );
  const visionSection = aboutData.sections.find(
    s => s.section === 'vision'
  );
  const missionSection = aboutData.sections.find(
    s => s.section === 'mission'
  );
  const overviewSection = aboutData.sections.find(
    s => s.section === 'overview'
  );
  const featuresSection = aboutData.sections.find(
    s => s.section === 'features'
  );
  const timelineSection = aboutData.sections.find(
    s => s.section === 'timeline'
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading about page...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <main>
        {/* Hero Section */}
        <section className="relative h-96 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: heroSection?.image
                ? `url('${heroSection.image}')`
                : "url('/placeholder.svg?height=400&width=1200')",
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
          </div>
          <div className="relative z-10 flex h-full items-center justify-center text-center text-white">
            <div className="max-w-4xl px-4">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
                {heroSection?.title || 'About Our School'}
              </h1>
              <p className="text-xl md:text-2xl animate-slide-up">
                {heroSection?.content ||
                  'Excellence in Education Since 1985'}
              </p>
            </div>
          </div>
        </section>

        {/* About Content */}
        <section className="py-16 container mx-auto">
          <div className="container">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              {/* Vision & Mission */}
              <div className="space-y-8">
                <Card className="animate-fade-in">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Eye className="h-6 w-6 text-primary" />
                      <h3 className="text-2xl font-bold">
                        {visionSection?.title ||
                          'Our Vision'}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {visionSection?.content ||
                        'To be a leading educational institution that nurtures innovative thinkers, compassionate leaders, and responsible global citizens who contribute meaningfully to society and drive positive change in the world.'}
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className="animate-fade-in"
                  style={{ animationDelay: '0.2s' }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Target className="h-6 w-6 text-primary" />
                      <h3 className="text-2xl font-bold">
                        {missionSection?.title ||
                          'Our Mission'}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed">
                      {missionSection?.content ||
                        'We provide a comprehensive, student-centered education that combines academic excellence with character development, critical thinking, and practical skills preparation for higher education and life success.'}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* School Overview */}
              <div
                className="animate-fade-in"
                style={{ animationDelay: '0.4s' }}
              >
                <h3 className="text-2xl font-bold mb-6">
                  {overviewSection?.title ||
                    'School Overview'}
                </h3>
                <div className="space-y-4 text-muted-foreground leading-relaxed">
                  {overviewSection?.content ? (
                    overviewSection.content
                      .split('\n\n')
                      .map((paragraph, index) => (
                        <p key={index}>{paragraph}</p>
                      ))
                  ) : (
                    <>
                      <p>
                        Royal Academy has been a cornerstone
                        of educational excellence for nearly
                        four decades. Founded in 1985, we
                        have consistently evolved to meet
                        the changing needs of our students
                        and the demands of a rapidly
                        advancing world.
                      </p>
                      <p>
                        Our comprehensive curriculum spans
                        Science, Commerce, and General
                        streams, ensuring that every student
                        finds their path to success. With
                        state-of-the-art facilities,
                        experienced faculty, and a
                        commitment to holistic development,
                        we prepare students not just for
                        examinations, but for life.
                      </p>
                      <p>
                        We believe in fostering an
                        environment where curiosity thrives,
                        creativity flourishes, and character
                        is built. Our students graduate as
                        confident, capable individuals ready
                        to make their mark in higher
                        education and beyond.
                      </p>
                    </>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold">Founded</p>
                    <p className="text-2xl font-bold text-primary">
                      {settings.establishedYear || '1985'}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-muted/50 rounded-lg">
                    <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                    <p className="font-semibold">
                      Students
                    </p>
                    <p className="text-2xl font-bold text-primary">
                      {settings.statistics[0].value +
                        settings.statistics[0].suffix ||
                        '1250+'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="mb-16">
              <h3 className="text-3xl font-bold text-center mb-12 animate-fade-in">
                {featuresSection?.title || 'Key Features'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: BookOpen,
                    title: 'Comprehensive Curriculum',
                    description:
                      'Science, Commerce, and General streams with modern teaching methods',
                  },
                  {
                    icon: Users,
                    title: 'Expert Faculty',
                    description:
                      'Highly qualified and experienced teachers dedicated to student success',
                  },
                  {
                    icon: Award,
                    title: 'Excellence Recognition',
                    description:
                      'Multiple awards for academic achievement and educational innovation',
                  },
                ].map((feature, index) => (
                  <Card
                    key={index}
                    className="text-center animate-fade-in"
                    style={{
                      animationDelay: `${index * 0.2}s`,
                    }}
                  >
                    <CardContent className="p-6">
                      <feature.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                      <h4 className="text-xl font-semibold mb-3">
                        {feature.title}
                      </h4>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Timeline */}
            <div>
              <h3 className="text-3xl font-bold text-center mb-12 animate-fade-in">
                {timelineSection?.title || 'Our Journey'}
              </h3>
              <div className="max-w-4xl mx-auto">
                <div className="space-y-8">
                  {aboutData.achievements.map(
                    (achievement, index) => (
                      <div
                        key={achievement.id || index}
                        className="flex items-start space-x-4 animate-slide-up"
                        style={{
                          animationDelay: `${index * 0.1}s`,
                        }}
                      >
                        <Badge
                          variant="outline"
                          className="text-primary border-primary px-3 py-1 font-semibold"
                        >
                          {achievement.year}
                        </Badge>
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold mb-2">
                            {achievement.title}
                          </h4>
                          <p className="text-muted-foreground">
                            {achievement.description}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
