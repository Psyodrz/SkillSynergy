import { Helmet } from 'react-helmet-async';
import Footer from '../components/Footer';
import { useParams, Navigate, Link } from 'react-router-dom';
import { blogPosts } from '../data/blogPosts';
import { Clock, User, ArrowLeft, Share2 } from 'lucide-react';

const BlogPostPage = () => {
  const { slug } = useParams();
  const post = blogPosts.find(p => p.slug === slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-mint-50 dark:bg-charcoal-950 flex flex-col">
      <Helmet>
        <title>{post.title} - SkillSynergy Blog</title>
        <meta name="description" content={post.excerpt} />
      </Helmet>

      {/* Progress Bar (Optional - could be added later) */}

      <article className="flex-1">
        {/* Header Image */}
        <div className="h-[40vh] md:h-[50vh] relative overflow-hidden">
          <img 
            src={post.image} 
            alt={post.title} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/50 to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
            <div className="max-w-4xl mx-auto">
              <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Link>
              <div className="flex items-center space-x-4 mb-6">
                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
                <span className="text-white/80 text-sm flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {post.readTime}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                {post.title}
              </h1>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white/10 backdrop-blur rounded-full flex items-center justify-center mr-3">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-white font-medium">{post.author}</p>
                  <p className="text-white/60 text-sm">{post.date}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div 
            className="prose prose-lg dark:prose-invert max-w-none prose-emerald prose-headings:font-bold prose-a:text-emerald-600"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Share / Tags */}
          <div className="mt-16 pt-8 border-t border-gray-200 dark:border-charcoal-700 flex justify-between items-center">
            <div className="text-charcoal-600 dark:text-gray-400 font-medium">
              Share this article
            </div>
            <div className="flex space-x-4">
              <button className="p-2 rounded-full bg-gray-100 dark:bg-charcoal-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};

export default BlogPostPage;
