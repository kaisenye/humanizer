import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { PlusCircle, Trash2, Clock, FileText } from 'lucide-react';
import Button from '../components/Button';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';
import { formatDistanceToNow } from 'date-fns';

const DashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const { projects, loading, fetchProjects, deleteProject } = useProjectStore();
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleDeleteProject = async (id: string) => {
    setIsDeleting(id);
    await deleteProject(id);
    setIsDeleting(null);
  };

  const calculateCreditsLeft = () => {
    if (!user) return 0;
    return Math.max(0, user.maxCredits - user.creditsUsed);
  };

  const creditsPercentage = user ? Math.min(100, (user.creditsUsed / user.maxCredits) * 100) : 0;

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.username || 'User'}!
          </h1>
          <p className="text-gray-600">
            Manage your projects and track your usage.
          </p>
        </motion.div>

        {/* Credits and Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {/* Credits Card */}
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Credits Usage</h2>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Used: {user?.creditsUsed || 0}</span>
                <span className="text-gray-600">Total: {user?.maxCredits || 0}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full" 
                  style={{ width: `${creditsPercentage}%` }}
                ></div>
              </div>
              <p className="mt-4 text-sm text-gray-600">
                You have <span className="font-semibold">{calculateCreditsLeft()}</span> credits left this month
              </p>
              <Link to="/pricing" className="mt-4 inline-block text-blue-600 text-sm font-medium">
                Upgrade for more credits →
              </Link>
            </div>
          </motion.div>

          {/* Subscription Card */}
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Subscription</h2>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xl font-bold text-blue-600 capitalize">
                    {user?.subscriptionTier || 'Free'} Plan
                  </span>
                </div>
                <Link to="/payment">
                  <Button variant="outline" size="sm">
                    Change Plan
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-gray-600">
                Next billing date: {new Date().getDate() + 30} {new Date().toLocaleString('default', { month: 'long' })}
              </p>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/humanizer">
                  <Button fullWidth>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    New Project
                  </Button>
                </Link>
                <Link to="/payment">
                  <Button variant="outline" fullWidth>
                    Purchase Credits
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Projects */}
        <motion.div 
          className="bg-white rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Recent Projects</h2>
              <Link to="/humanizer">
                <Button>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
          
          {loading ? (
            <div className="p-6 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-gray-600">Loading your projects...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
              <p className="text-gray-600 mb-4">
                Create your first project to start humanizing AI text.
              </p>
              <Link to="/humanizer">
                <Button>
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create Project
                </Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Project
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Credits Used
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {projects.map((project) => (
                    <tr key={project.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/humanizer?id=${project.id}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {project.title || 'Untitled Project'}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-gray-400 mr-1" />
                          {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {project.creditsUsed}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-800"
                          disabled={isDeleting === project.id}
                        >
                          {isDeleting === project.id ? (
                            <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-red-600 border-r-transparent"></span>
                          ) : (
                            <Trash2 className="h-5 w-5" />
                          )}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;