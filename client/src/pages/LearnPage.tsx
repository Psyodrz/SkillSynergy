import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const LearnPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Learn Together - SkillSynergy</title>
        <meta name="description" content="Accelerate your learning through peer mentorship and collaborative study. Master new skills with the help of a global community." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-charcoal-900 overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-emerald-50 dark:from-charcoal-900 dark:to-charcoal-800 opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold text-sm mb-6">
                <BookOpen className="w-4 h-4" />
                <span>Guided Learning</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-charcoal-900 dark:text-white mb-6 leading-tight">
                Master Skills <br />
                <span className="text-blue-600 dark:text-blue-400">With Guided Modules</span>
              </h1>
              <p className="text-xl text-charcoal-600 dark:text-mint-200 mb-8 leading-relaxed">
                Learning in isolation is hard. SkillSynergy provides structured learning paths and practice challenges so you can master skills effectively.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg transition-all">
                  Start Learning Path
                </Link>
              </div>
            </div>
            <div className="relative">
              {/* Abstract Illustration Placeholder */}
              <div className="aspect-square rounded-3xl bg-gradient-to-tr from-blue-100 to-emerald-100 dark:from-charcoal-800 dark:to-charcoal-700 p-8 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-9xl mb-4">🎓</div>
                  <p className="text-charcoal-500 dark:text-gray-400 font-medium">Structured Education</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-white mb-4">Why Learn on SkillSynergy?</h2>
            <p className="text-xl text-charcoal-600 dark:text-gray-400">The most effective way to upskill is by doing it with others.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700">
              <Users className="w-10 h-10 text-blue-500 mb-6" />
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3">Find an Instructor</h3>
              <p className="text-charcoal-600 dark:text-gray-400">
                Learn from experienced instructors who can guide your learning path and review your progress.
              </p>
            </div>
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700">
              <TrendingUp className="w-10 h-10 text-emerald-500 mb-6" />
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3">Skill Practice</h3>
              <p className="text-charcoal-600 dark:text-gray-400">
                Practice what you learn through interactive challenges and task-based learning modules.
              </p>
            </div>
            <div className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700">
              <Award className="w-10 h-10 text-purple-500 mb-6" />
              <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3">Verified Certificates</h3>
              <p className="text-charcoal-600 dark:text-gray-400">
                Track your progress and get endorsements from your peers. Build a reputation that showcases your actual capabilities.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LearnPage;
