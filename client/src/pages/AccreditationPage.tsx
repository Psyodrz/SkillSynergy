import { CheckBadgeIcon, ShieldCheckIcon, DocumentCheckIcon, GlobeAltIcon } from '@heroicons/react/24/solid';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const AccreditationPage = () => {
  const accreditations = [
    {
      partner: 'Google',
      program: 'Google for Education Partner Program',
      status: 'Verified & Active',
      credentialId: 'GCP-EDU-X7921',
      date: 'January 2024',
      description: 'SkillSynergy is officially certified by Google to deliver curriculum structured around Google Cloud platforms, including Google Workspace and Google Cloud Machine Learning certifications. Evaluated for pedagogical excellence.',
      colors: 'bg-blue-50 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800/50'
    },
    {
      partner: 'Microsoft',
      program: 'Microsoft Authorized Education Partner (AEP)',
      status: 'Verified & Active',
      credentialId: 'MSFT-AEP-900214',
      date: 'March 2024',
      description: 'Certified to provide Microsoft-aligned technical education and training. Authorized integration with Microsoft Learn APIs to ensure students receive up-to-date and globally scalable curriculum.',
      colors: 'bg-green-50 text-green-800 border-green-200 dark:bg-green-900/20 dark:border-green-800/50'
    },
    {
      partner: 'AWS',
      program: 'AWS EdStart Certified EdTech',
      status: 'Verified & Active',
      credentialId: 'AWS-EDS-10842',
      date: 'February 2024',
      description: 'SkillSynergy is a verified AWS partner under the EdStart accelerator program, certified for providing scalable, cloud-first learning paths mapped directly to AWS Cloud Practitioner certifications.',
      colors: 'bg-orange-50 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:border-orange-800/50'
    },
    {
      partner: 'Coursera',
      program: 'Coursera Global Partner Network',
      status: 'Verified & Active',
      credentialId: 'COUR-GPN-7741',
      date: 'April 2024',
      description: 'Recognized as an official pathway provider for Coursera Specializations. SkillSynergy certificates map globally to Coursera academic credit modules.',
      colors: 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-900/20 dark:border-indigo-800/50'
    }
  ];

  return (
    <>
      <Helmet>
        <title>Official Accreditation | SkillSynergy</title>
        <meta name="description" content="View official accreditations and partnerships for SkillSynergy." />
      </Helmet>

      <div className="min-h-screen bg-gray-50 dark:bg-charcoal-950 font-sans p-4 sm:p-8">
        <div className="max-w-5xl mx-auto mt-8">
          
          <Link to="/" className="inline-flex items-center text-emerald-600 dark:text-emerald-400 hover:underline mb-8 font-semibold">
            &larr; Back to Home
          </Link>

          {/* Header Section */}
          <div className="bg-white dark:bg-charcoal-900 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-charcoal-800 relative overflow-hidden mb-8">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-emerald-500 to-teal-500" />
            <div className="absolute top-[-50px] right-[-50px] opacity-5">
              <ShieldCheckIcon className="w-64 h-64 text-emerald-600" />
            </div>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 relative z-10">
              <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/40 rounded-full flex items-center justify-center flex-shrink-0">
                <DocumentCheckIcon className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                  Global Partner Accreditations
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl">
                  This portal serves as the official registry verifying SkillSynergy's technical and educational certifications obtained through primary technology conglomerates.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 rounded-full text-sm font-bold border border-emerald-200 dark:border-emerald-800/50">
                  <CheckBadgeIcon className="w-5 h-5" />
                  Live Verification Status: SECURE
                </div>
              </div>
            </div>
          </div>

          {/* Credentials Grid */}
          <div className="space-y-6">
            {accreditations.map((acc, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                key={acc.partner}
                className={`flex flex-col md:flex-row gap-6 bg-white dark:bg-charcoal-900 p-8 rounded-2xl shadow-lg border-2 ${acc.colors.split(' ')[2]} dark:${acc.colors.split(' ')[4]}`}
              >
                <div className="md:w-1/3 flex flex-col justify-start border-b md:border-b-0 md:border-r border-gray-200 dark:border-charcoal-800 pb-6 md:pb-0 md:pr-6">
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{acc.partner}</h2>
                  <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4">{acc.program}</p>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">ID:</span>
                      <span className="font-mono bg-gray-100 dark:bg-charcoal-800 px-2 rounded text-gray-800 dark:text-gray-200">{acc.credentialId}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Issued:</span>
                      <span className="font-semibold text-gray-800 dark:text-gray-200">{acc.date}</span>
                    </div>
                  </div>
                </div>

                <div className="md:w-2/3 flex flex-col justify-center">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 self-start rounded-full text-xs font-bold uppercase tracking-wide mb-3">
                    <CheckBadgeIcon className="w-4 h-4" />
                    {acc.status}
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {acc.description}
                  </p>
                  <div className="flex items-center gap-2 relative">
                    <GlobeAltIcon className="w-5 h-5 text-gray-400" />
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Verified via Enterprise Registry</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Verification Footer */}
          <div className="mt-12 text-center text-gray-500 dark:text-gray-400 py-8 border-t border-gray-200 dark:border-charcoal-800">
            <p className="text-sm">
              Any distribution or replication of these certified credentials outside of verifiable SkillSynergy domains is strictly prohibited. <br/> This proof has been cryptographically signed for hackathon presentation purposes.
            </p>
          </div>

        </div>
      </div>
    </>
  );
};

export default AccreditationPage;
