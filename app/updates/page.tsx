"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Briefcase, Newspaper, Megaphone } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Update {
  _id: string;
  title: string;
  content: string;
  type: 'news' | 'job' | 'announcement';
  isFeatured: boolean;
  publishDate: string;
}

const typeConfig = {
  news: { icon: Newspaper, color: 'bg-blue-100 text-blue-800', label: 'News' },
  job: { icon: Briefcase, color: 'bg-green-100 text-green-800', label: 'Job' },
  announcement: { icon: Megaphone, color: 'bg-purple-100 text-purple-800', label: 'Announcement' },
};

export default function UpdatesPage() {
  const [updates, setUpdates] = useState<Update[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'news' | 'job' | 'announcement'>('all');

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const response = await fetch('/api/v1/updates');
        const data = await response.json();
        setUpdates(data.updates || []);
      } catch (error) {
        console.error('Failed to fetch updates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdates();
  }, []);

  // Default updates if API fails
  const defaultUpdates = [
    {
      _id: '1',
      title: 'New Government Scheme for Film Workers',
      content: 'The Tamil Nadu government has announced a new welfare scheme providing financial assistance and healthcare benefits for film industry workers. This initiative aims to support the livelihoods of thousands of professionals in the industry.',
      type: 'news' as const,
      isFeatured: true,
      publishDate: new Date().toISOString(),
    },
    {
      _id: '2',
      title: 'Assistant Director Positions Available',
      content: 'Multiple production houses are looking for talented assistant directors for upcoming projects. This is a great opportunity for aspiring filmmakers to gain valuable experience in the industry.',
      type: 'job' as const,
      isFeatured: false,
      publishDate: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      _id: '3',
      title: 'Annual General Meeting Announcement',
      content: 'SIFWWU will be conducting its Annual General Meeting next month. All members are invited to participate and contribute to important decisions regarding the union\'s future initiatives.',
      type: 'announcement' as const,
      isFeatured: true,
      publishDate: new Date(Date.now() - 172800000).toISOString(),
    },
  ];

  const displayUpdates = updates.length > 0 ? updates : defaultUpdates;
  const filteredUpdates = filter === 'all' 
    ? displayUpdates 
    : displayUpdates.filter(update => update.type === filter);

  const featuredUpdates = filteredUpdates.filter(update => update.isFeatured);
  const regularUpdates = filteredUpdates.filter(update => !update.isFeatured);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Latest Updates</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Stay informed with the latest news, job opportunities, and announcements
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Updates
          </button>
          <button
            onClick={() => setFilter('news')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'news'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            News
          </button>
          <button
            onClick={() => setFilter('job')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'job'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Jobs
          </button>
          <button
            onClick={() => setFilter('announcement')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === 'announcement'
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Announcements
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Featured Updates */}
            {featuredUpdates.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Updates</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {featuredUpdates.map((update) => {
                    const config = typeConfig[update.type];
                    const IconComponent = config.icon;
                    
                    return (
                      <Card key={update._id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                        <CardHeader>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={config.color}>
                              <IconComponent className="h-3 w-3 mr-1" />
                              {config.label}
                            </Badge>
                            <div className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {format(new Date(update.publishDate), 'MMM dd, yyyy')}
                            </div>
                          </div>
                          <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            {update.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-600 leading-relaxed">
                            {update.content}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Regular Updates */}
            {regularUpdates.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">All Updates</h2>
                <div className="space-y-6">
                  {regularUpdates.map((update) => {
                    const config = typeConfig[update.type];
                    const IconComponent = config.icon;
                    
                    return (
                      <Card key={update._id} className="group hover:shadow-lg transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Badge className={config.color}>
                                <IconComponent className="h-3 w-3 mr-1" />
                                {config.label}
                              </Badge>
                              <div className="flex items-center text-sm text-gray-500">
                                <Clock className="h-4 w-4 mr-1" />
                                {format(new Date(update.publishDate), 'MMM dd, yyyy')}
                              </div>
                            </div>
                          </div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                            {update.title}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {update.content}
                          </p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </section>
            )}

            {filteredUpdates.length === 0 && (
              <div className="text-center py-12">
                <div className="bg-gray-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Newspaper className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Updates Found</h3>
                <p className="text-gray-600">
                  {filter === 'all' 
                    ? 'No updates are available at the moment.' 
                    : `No ${filter} updates are available at the moment.`}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Newsletter Signup */}
        <section className="mt-20 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Never miss important updates, job opportunities, and industry news
          </p>
          <a
            href="/contact"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors inline-flex items-center"
          >
            Subscribe to Updates
          </a>
        </section>
      </div>

      <Footer />
    </div>
  );
}