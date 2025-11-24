import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { Play, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DemoPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Watch Demo - SkillSynergy</title>
        <meta name="description" content="See SkillSynergy in action. Watch our demo video and learn how to get started with the platform." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-charcoal-900 overflow-hidden pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-charcoal-900 dark:text-white mb-6">
            See SkillSynergy in <span className="bg-gradient-emerald bg-clip-text text-transparent">Action</span>
          </h1>
          <p className="text-xl text-charcoal-600 dark:text-mint-200 mb-10 max-w-2xl mx-auto">
            Discover how easy it is to find collaborators, manage projects, and grow your skills.
          </p>
        </div>
      </div>

      {/* Video Placeholder Section */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="relative aspect-video bg-charcoal-900 rounded-3xl shadow-2xl overflow-hidden group cursor-pointer">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center pl-1 shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white fill-current" />
            </div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-white font-bold text-lg">Platform Walkthrough (2:30)</p>
          </div>
          {/* In a real app, this would be an iframe or video tag */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
        </div>
      </div>

      {/* Onboarding Steps */}
      <div className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-charcoal-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-12 text-center">Getting Started is Simple</h2>
          
          <div className="space-y-12">
            {[
              {
                title: "1. Create Your Profile",
                desc: "Sign up in seconds. Add your skills, interests, and what you're looking for (e.g., 'Looking for a React Mentor' or 'Building a Fintech App').",
                color: "bg-teal-100 dark:bg-teal-900/30 text-teal-600"
              },
              {
                title: "2. Browse & Match",
                desc: "Use the Discover page to find users. Our algorithm highlights people with high compatibility scores based on your complementary skills.",
                color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"
              },
              {
                title: "3. Connect & Chat",
                desc: "Send a connection request. Once accepted, you can chat, video call, and start planning your collaboration immediately.",
                color: "bg-cyan-100 dark:bg-cyan-900/30 text-cyan-600"
              },
              {
                title: "4. Launch Projects",
                desc: "Create a project workspace. Manage tasks, share files, and track progress as you build your portfolio together.",
                color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600"
              }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-6 md:gap-10 items-start">
                <div className={`w-12 h-12 ${step.color} rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xl`}>
                  {idx + 1}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-2">{step.title}</h3>
                  <p className="text-charcoal-600 dark:text-gray-400 text-lg leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-8">Ready to start your journey?</h2>
          <Link to="/login" className="inline-flex items-center px-8 py-4 bg-gradient-emerald text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
            Join SkillSynergy Now <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default DemoPage;
