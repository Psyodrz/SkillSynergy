import { Link } from 'react-router-dom';
import { Shield, Facebook, Linkedin, Globe } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { Icon: Facebook, href: 'https://www.facebook.com/PsycoDrz' },
    { Icon: Linkedin, href: 'https://www.linkedin.com/in/adisrivastav23/' },
    { Icon: Globe, href: 'https://psyodrz.github.io/psyodrz/' }
  ];

  return (
    <footer className="bg-white dark:bg-charcoal-900 border-t border-gray-200 dark:border-charcoal-800 pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shadow-emerald-500/20">
                S
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-charcoal-900 to-charcoal-700 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                SkillSynergy
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              The premier platform for skill mastery. Access structured modules, practice on challenges, and accelerate your learning through guided paths.
            </p>
            <div className="flex gap-4">
              {socialLinks.map(({ Icon, href }, i) => (
                <a 
                  key={i} 
                  href={href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full bg-gray-50 dark:bg-charcoal-800 flex items-center justify-center text-gray-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Product</h3>
            <ul className="space-y-4">
              <li><Link to="/connect" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Study</Link></li>
              <li><Link to="/learn" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Learn</Link></li>
              <li><Link to="/projects" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Challenges</Link></li>
              <li><Link to="/chat" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Discussions</Link></li>
              <li><Link id="watch-demo-footer-link" to="/demo" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Watch Demo</Link></li>

            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Company</h3>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">About Us</Link></li>
              <li><Link to="/blog" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Blog</Link></li>
              <li><Link to="/contact" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-wider mb-6">Legal</h3>
            <ul className="space-y-4">
              <li><Link to="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Terms of Service</Link></li>
              <li><Link to="/refund" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Refund Policy</Link></li>
              <li><Link to="/cookies" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Cookie Policy</Link></li>
              <li><Link to="/disclaimer" className="text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 text-sm transition-colors">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-200 dark:border-charcoal-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-gray-500 dark:text-gray-500 text-center md:text-left">
              © {currentYear} SkillSynergy. All rights reserved.
            </div>
            
            <div className="flex flex-wrap justify-center gap-4">
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500 bg-gray-50 dark:bg-charcoal-800 px-4 py-2 rounded-full border border-gray-100 dark:border-charcoal-700">
                <Shield className="w-3 h-3 text-emerald-500" />
                <span>Data Encrypted</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8 text-xs text-gray-400 dark:text-gray-600 text-center max-w-4xl mx-auto leading-relaxed">
            <p className="mb-2">
              SkillSynergy is an educational learning platform focused on skills, study materials, and learning activities. It does not provide networking, matchmaking, hiring, or job-related services. 
              All transactions are for digital services only.
            </p>
            <p>
              Registered Address: Lucknow, Uttar Pradesh, India. Contact: aditya.s70222@gmail.com
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
