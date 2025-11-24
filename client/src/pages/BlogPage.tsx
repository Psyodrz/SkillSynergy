import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { blogPosts } from '../data/blogPosts';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User } from 'lucide-react';

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>Blog - SkillSynergy</title>
        <meta name="description" content="Insights, tips, and trends on professional collaboration, skill development, and the future of work." />
      </Helmet>

      {/* Header */}
      <div className="bg-white dark:bg-charcoal-900 border-b border-gray-200 dark:border-charcoal-800 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-charcoal-900 dark:text-white mb-6">
            The <span className="bg-gradient-emerald bg-clip-text text-transparent">Synergy</span> Blog
          </h1>
          <p className="text-xl text-charcoal-600 dark:text-mint-200 max-w-2xl mx-auto">
            Stories, strategies, and insights for the modern professional.
          </p>
        </div>
      </div>

      {/* Blog Grid */}
      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className="group bg-white dark:bg-charcoal-800 rounded-2xl overflow-hidden shadow-sm border border-gray-100 dark:border-charcoal-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-charcoal-900/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                  {post.category}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-4 space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-3 h-3 mr-1" />
                    {post.date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {post.readTime}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-charcoal-900 dark:text-white mb-3 group-hover:text-emerald-500 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-charcoal-600 dark:text-gray-400 text-sm mb-6 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center mt-auto pt-4 border-t border-gray-100 dark:border-charcoal-700">
                  <div className="w-8 h-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mr-3">
                    <User className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <span className="text-sm font-medium text-charcoal-900 dark:text-white">
                    {post.author}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BlogPage;
