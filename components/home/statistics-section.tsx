'use client';


import { useEffect, useRef, useState } from 'react';
import {
  Users,
  GraduationCap,
  Building,
  BookOpen,
  Monitor,
} from 'lucide-react';

type Stat = {
  key: string;
  label: string;
  value: number;
  suffix: string;
};

const iconMap: Record<string, any> = {
  students: Users,
  teachers: GraduationCap,
  classrooms: Building,
  books: BookOpen,
  computers: Monitor,
};

function CountUpAnimation({
  end,
  duration = 2000,
  suffix = '',
}: {
  end: number;
  duration?: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }
    return () => observer.disconnect();
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;
    let startTime: number;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );
      setCount(Math.floor(progress * end));
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    requestAnimationFrame(animate);
  }, [isVisible, end, duration]);

  return (
    <span ref={ref}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

export function StatisticsSection() {
  const [statistics, setStatistics] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/statistics')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStatistics(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 bg-primary text-primary-foreground">
      <div className="container">
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Our School in Numbers
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Discover the scale and impact of our educational
            community
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="text-center animate-pulse opacity-60"
                >
                  <div className="flex justify-center mb-4">
                    <div className="p-4 bg-accent rounded-full h-16 w-16" />
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2 h-8 bg-accent rounded w-1/2 mx-auto" />
                  <div className="h-4 bg-accent rounded w-2/3 mx-auto mt-2" />
                </div>
              ))
            : statistics.map((stat, index) => {
                const Icon = iconMap[stat.key] || Users;
                return (
                  <div
                    key={stat.key}
                    className="text-center animate-slide-up"
                    style={{
                      animationDelay: `${index * 0.1}s`,
                    }}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="p-4 bg-accent rounded-full">
                        <Icon className="h-8 w-8 text-accent-foreground" />
                      </div>
                    </div>
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      <CountUpAnimation
                        end={stat.value}
                        suffix={stat.suffix}
                      />
                    </div>
                    <p className="text-sm md:text-base opacity-90">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
        </div>
      </div>
    </section>
  );
}
export default StatisticsSection;
