import React from 'react'
import { motion } from 'framer-motion'
import { 
  UserGroupIcon, 
  FolderIcon, 
  ChatBubbleLeftRightIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  PlusIcon
} from '@heroicons/react/24/outline'

const DashboardPage: React.FC = () => {
  const stats = [
    { name: 'Connections', value: '24', icon: UserGroupIcon, color: 'text-teal-600 dark:text-teal-400' },
    { name: 'Active Projects', value: '8', icon: FolderIcon, color: 'text-emerald-500 dark:text-emerald-400' },
    { name: 'Messages', value: '12', icon: ChatBubbleLeftRightIcon, color: 'text-cyan-500 dark:text-cyan-400' },
    { name: 'Skill Score', value: '95%', icon: StarIcon, color: 'text-amber-500 dark:text-amber-400' },
  ]

  const recentConnections = [
    { name: 'Sarah Chen', role: 'Frontend Developer', skills: ['React', 'TypeScript', 'UI/UX'], avatar: 'SC' },
    { name: 'Mike Rodriguez', role: 'Backend Developer', skills: ['Node.js', 'Python', 'AWS'], avatar: 'MR' },
    { name: 'Emma Wilson', role: 'Designer', skills: ['Figma', 'Adobe XD', 'Prototyping'], avatar: 'EW' },
    { name: 'David Kim', role: 'DevOps Engineer', skills: ['Docker', 'Kubernetes', 'CI/CD'], avatar: 'DK' },
  ]

  const recentProjects = [
    { name: 'E-commerce Platform', status: 'In Progress', members: 4, progress: 75 },
    { name: 'Mobile App Redesign', status: 'Planning', members: 3, progress: 25 },
    { name: 'Data Analytics Dashboard', status: 'Completed', members: 5, progress: 100 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-charcoal-900 dark:text-white mb-2">
          Welcome back, John! 👋
        </h1>
        <p className="text-charcoal-600 dark:text-mint-200">
          Here's what's happening with your collaborations today.
        </p>
      </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
              className="card hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center">
                <div className={`p-3 rounded-xl bg-teal-50 dark:bg-charcoal-800 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-charcoal-700 dark:text-mint-200">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-bold text-charcoal-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Connections */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Connections
              </h2>
              <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {recentConnections.map((connection, index) => (
                <motion.div
                  key={connection.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="flex items-center space-x-4 p-3 rounded-xl hover:bg-teal-50/60 dark:hover:bg-charcoal-800/80 transition-colors border border-teal-100 dark:border-charcoal-700"
                >
                  <div className="w-10 h-10 bg-gradient-emerald rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">{connection.avatar}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {connection.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {connection.role}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {connection.skills.slice(0, 2).map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium bg-teal-100 dark:bg-teal-900/50 text-teal-800 dark:text-teal-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    Connect
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Recent Projects */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Projects
              </h2>
              <button className="flex items-center text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 text-sm font-medium transition-colors">
                <PlusIcon className="h-4 w-4 mr-1" />
                New Project
              </button>
            </div>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.name}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                  className="p-4 rounded-xl border border-teal-100 dark:border-charcoal-700 hover:shadow-emerald/10 hover:shadow-lg transition-all bg-white/50 dark:bg-charcoal-800/50 backdrop-blur-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {project.name}
                    </h3>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        project.status === 'Completed' 
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : project.status === 'In Progress'
                        ? 'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300 border border-teal-200 dark:border-teal-800'
                        : 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}>
                      {project.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>{project.members} members</span>
                    <div className="flex items-center">
                      <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                      {project.progress}%
                    </div>
                  </div>
                  <div className="mt-2 w-full bg-teal-100 dark:bg-charcoal-700 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-teal-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
