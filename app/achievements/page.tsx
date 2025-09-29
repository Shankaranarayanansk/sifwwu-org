"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Award, Users, Shield, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Achievement {
  _id: string;
  title: string;
  description: string;
  date: string;
  image?: string;
  order: number;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await fetch('/api/v1/achievements');
        const data = await response.json();
        setAchievements(data.achievements || []);
      } catch (error) {
        console.error('Failed to fetch achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAchievements();
  }, []);

  // Default achievements if API fails
  const defaultAchievements = [
    {
      _id: '1',
      title: 'Industry Recognition',
      description: 'Received recognition from major film industry bodies for our welfare initiatives and contribution to the South Indian cinema community.',
      date: new Date('2024-01-15').toISOString(),
      order: 1,
    },
    {
      _id: '2',
      title: 'Member Support',
      description: 'Successfully provided support and assistance to over 1000+ film industry workers, helping them with various welfare programs and opportunities.',
      date: new Date('2024-06-10').toISOString(),
      order: 2,
    },
    {
      _id: '3',
      title: 'Worker Protection',
      description: 'Implemented comprehensive worker protection measures across multiple film sets, ensuring safety and fair treatment for all professionals.',
      date: new Date('2024-09-20').toISOString(),
      order: 3,
    },
  ];

  const displayAchievements = achievements.length > 0 ? achievements : defaultAchievements;

  const stats = [
    {
      icon: Users,
      value: '1000+',
      label: 'Members Supported',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      icon: Award,
      value: '25+',
      label: 'Awards & Recognition',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      icon: Shield,
      value: '100+',
      label: 'Workers Protected',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      icon: TrendingUp,
      value: '50+',
      label: 'Projects Supported',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Achievements</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Celebrating our milestones and the positive impact we've made in the South Indian film industry
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Stats Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardContent className="p-6">
                  <div className={`mx-auto ${stat.bgColor} w-16 h-16 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 mb-4`}>
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <p className="text-gray-600 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Achievements Timeline */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Major Milestones</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Key achievements that mark our journey in supporting the South Indian film industry
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center min-h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {displayAchievements.map((achievement, index) => (
                <Card key={achievement._id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                  <div className="flex flex-col lg:flex-row">
                    {achievement.image ? (
                      <div className="lg:w-1/3">
                        <img
                          src={achievement.image}
                          alt={achievement.title}
                          className="w-full h-64 lg:h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="lg:w-1/3 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300">
                        <Award className="h-24 w-24 text-blue-600" />
                      </div>
                    )}
                    
                    <div className="lg:w-2/3 p-8">
                      <div className="flex items-center mb-4">
                        <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-4">
                          Achievement #{index + 1}
                        </div>
                        <div className="flex items-center text-gray-500">
                          <Calendar className="h-4 w-4 mr-2" />
                          {format(new Date(achievement.date), 'MMMM dd, yyyy')}
                        </div>
                      </div>
                      
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-blue-600 transition-colors">
                        {achievement.title}
                      </h3>
                      
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Impact Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Impact</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                The positive changes we've brought to the South Indian film industry
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Building</h3>
                  <p className="text-gray-600">
                    Created a strong network of film industry professionals supporting each other
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Worker Rights</h3>
                  <p className="text-gray-600">
                    Established better working conditions and fair treatment standards
                  </p>
                </div>
              </div>
              
              <div className="text-center">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Industry Growth</h3>
                  <p className="text-gray-600">
                    Contributed to the overall growth and development of South Indian cinema
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Future Goals */}
        <section className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-6">Looking Ahead</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            We're committed to achieving even greater milestones and creating more opportunities 
            for film industry professionals
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-2">2025 Goal</div>
              <p className="text-blue-100">Support 2000+ Members</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-2">2025 Goal</div>
              <p className="text-blue-100">Launch 10+ New Programs</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-400 mb-2">2025 Goal</div>
              <p className="text-blue-100">Expand to 5+ States</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}