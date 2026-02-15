export interface Article {
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  author: string;
  relatedSlugs?: string[];
}

export interface CourseReview {
  name: string;
  rating: number;
  comment: string;
  date: string;
}

export interface LessonAudio {
  url?: string;
  duration?: number;
  generatedAt?: string;
}

export interface CourseLesson {
  number: number;
  title: string;
  duration: string;
  isFree: boolean;
  content?: string;
  audio?: LessonAudio;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  price: number;
  totalLessons: number;
  level: "beginner" | "intermediate" | "advanced";
  category: string;
  instructor: string;
  curriculum: CourseLesson[];
  freePreviewContent: string;
  features: string[];
  reviews?: CourseReview[];
  learningPoints?: string[];
  totalDuration?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  price: number;
  period: string;
  features: string[];
  highlighted: boolean;
  buttonLabel: string;
}

export interface Subscription {
  id: number;
  email: string;
  plan: string;
  status: string;
  created_at: string;
  updated_at: string;
}
