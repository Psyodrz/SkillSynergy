import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { Briefcase, Layers, Rocket, Code } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProjectFeaturePage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Build Projects - SkillSynergy</title>
        <meta name="description" content="Collaborate on real-world projects. Build your portfolio, gain practical experience, and launch ideas with a team." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-charcoal-900 overflow-hidden pt-20 pb-24">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-charcoal-900 dark:to-charcoal-800 opacity-50" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-semibold text-sm mb-6">
              <Briefcase className="w-4 h-4" />
              <span>Real-World Experience</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-charcoal-900 dark:text-white mb-8 leading-tight">
              Don't Just Learn. <br />
              <span className="text-purple-600 dark:text-purple-400">Build Something Real.</span>
            </h1>
            <p className="text-xl text-charcoal-600 dark:text-mint-200 mb-10 max-w-2xl mx-auto">
              Theory is not enough. Join a project team, contribute code, design interfaces, and ship products. Build a portfolio that gets you hired.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/login" className="px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg transition-all">
                Find a Project
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Project Types */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Rocket className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">Startup Ideas</h3>
                  <p className="text-charcoal-600 dark:text-gray-400">
                    Have a billion-dollar idea? Find co-founders and early contributors to help you build the MVP.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">Open Source</h3>
                  <p className="text-charcoal-600 dark:text-gray-400">
                    Contribute to open-source projects. Fix bugs, add features, and improve documentation while learning from senior maintainers.
                  </p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Layers className="w-6 h-6 text-pink-600 dark:text-pink-400" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">Portfolio Projects</h3>
                  <p className="text-charcoal-600 dark:text-gray-400">
                    Team up with peers to build impressive portfolio pieces—clones, utilities, or creative showcases—to demonstrate your skills.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-100 dark:bg-charcoal-800 rounded-3xl p-8 aspect-video flex items-center justify-center">
              <div className="text-center">
                <p className="text-charcoal-500 dark:text-gray-500">Project Dashboard Preview</p>
                {/* Placeholder for UI Screenshot */}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ProjectFeaturePage;
