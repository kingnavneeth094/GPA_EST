import dynamic from 'next/dynamic';
import Chatbot from '@/components/Chatbot';
const CGPAPlanner = dynamic(() => import('@/components/CGPAPlanner'), {
  ssr: false
});

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-gray-100">
          Semester Grade Planner
        </h1>
        <CGPAPlanner />
        <Chatbot/>
      </main>
    </div>
  );
}