import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { Users, Target, Heart, Globe, Sparkles } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>About Us - SkillSynergy</title>
        <meta name="description" content="Learn about SkillSynergy's mission to connect professionals, foster collaboration, and accelerate skill growth globally." />
      </Helmet>

      {/* Hero Section */}
      <div className="relative bg-white dark:bg-charcoal-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-emerald opacity-5 dark:opacity-10" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-black text-charcoal-900 dark:text-white mb-6">
              Empowering the World to <span className="bg-gradient-emerald bg-clip-text text-transparent">Collaborate</span>
            </h1>
            <p className="text-xl text-charcoal-600 dark:text-mint-200 leading-relaxed">
              SkillSynergy is more than just a platform; it's a movement. We are building the future of professional growth where skills meet opportunity through seamless collaboration.
            </p>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white dark:bg-charcoal-800 p-10 rounded-3xl shadow-lg border border-teal-100 dark:border-charcoal-700">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Target className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-4">Our Mission</h2>
              <p className="text-charcoal-600 dark:text-gray-300 text-lg leading-relaxed">
                To democratize professional growth by breaking down barriers to collaboration. We believe that everyone has a skill to teach and a skill to learn. Our mission is to connect these dots globally, creating a synergy that accelerates careers and innovation.
              </p>
            </div>

            <div className="bg-white dark:bg-charcoal-800 p-10 rounded-3xl shadow-lg border border-teal-100 dark:border-charcoal-700">
              <div className="w-14 h-14 bg-teal-100 dark:bg-teal-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h2 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-4">Our Vision</h2>
              <p className="text-charcoal-600 dark:text-gray-300 text-lg leading-relaxed">
                A world where no project goes unbuilt because of a missing skill. We envision a global ecosystem where finding the right collaborator is as easy as searching for information, fostering a culture of continuous, shared learning.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-20 bg-white dark:bg-charcoal-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-white mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-gradient-emerald mx-auto rounded-full" />
          </div>
          
          <div className="prose dark:prose-invert max-w-none text-lg text-charcoal-600 dark:text-gray-300">
            <p className="mb-6">
              It started in 2024 with a simple observation: <strong>Talent is everywhere, but opportunity is not.</strong>
            </p>
            <p className="mb-6">
              Our founder, Aditya, noticed a recurring pattern in the tech industry. Developers had great ideas but lacked design skills. Designers had beautiful concepts but couldn't code. Marketers wanted to build products but needed technical partners. These professionals were often siloed, struggling to find reliable collaborators outside their immediate circles.
            </p>
            <p className="mb-6">
              Existing platforms were transactional—focused on hiring freelancers for short-term gigs. There was no dedicated space for <strong>long-term, skill-based partnership</strong> where the primary currency was expertise, not just money.
            </p>
            <p>
              SkillSynergy was born to fill this gap. We built a platform that prioritizes <strong>compatibility, shared goals, and mutual growth</strong>. Today, we are a thriving community of thousands of creators, builders, and learners from over 50 countries, all united by the drive to build something greater together.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-mint-50 dark:bg-charcoal-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-charcoal-900 dark:text-white mb-4">Why SkillSynergy?</h2>
            <p className="text-xl text-charcoal-600 dark:text-mint-200">The core values that drive everything we do</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: "Community First",
                desc: "We prioritize the safety, growth, and success of our community above all else. Every feature we build is designed to foster genuine human connection."
              },
              {
                icon: Sparkles,
                title: "Innovation",
                desc: "We constantly push the boundaries of what's possible in ed-tech and social networking, using AI to create smarter, more meaningful matches."
              },
              {
                icon: Globe,
                title: "Inclusivity",
                desc: "SkillSynergy is for everyone. Whether you're a student, a veteran expert, or a hobbyist, you have a place here to teach and to learn."
              }
            ].map((value, idx) => (
              <div key={idx} className="bg-white dark:bg-charcoal-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-charcoal-700 hover:shadow-md transition-shadow">
                <value.icon className="w-10 h-10 text-emerald-500 mb-6" />
                <h3 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3">{value.title}</h3>
                <p className="text-charcoal-600 dark:text-gray-400">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AboutPage;
