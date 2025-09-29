"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Mail, Phone, User } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

interface Leader {
  _id: string;
  name: string;
  position: string;
  bio?: string;
  image?: string;
  email?: string;
  phone?: string;
  order: number;
}

export default function LeadershipPage() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const response = await fetch('/api/v1/leaders');
        const data = await response.json();
        setLeaders(data.leaders || []);
      } catch (error) {
        console.error('Failed to fetch leaders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaders();
  }, []);

  // Default leaders if API fails
  const defaultLeaders = [
    {
      _id: '1',
      name: 'DhanaSaker',
      position: 'Founder & President',
      bio: 'Visionary leader dedicated to the welfare of South Indian film industry workers.',
      order: 1,
    },
    {
      _id: '2',
      name: 'Mr. K. Thirugnanam',
      position: 'State President',
      bio: 'Experienced leader with deep knowledge of the film industry landscape.',
      order: 2,
    },
    {
      _id: '3',
      name: 'Dr. MF Ramesh',
      position: 'General Secretary',
      bio: 'Committed to organizing and coordinating union activities for maximum impact.',
      order: 3,
    },
  ];

  const displayLeaders = leaders.length > 0 ? leaders : defaultLeaders;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Leadership</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Meet the dedicated leaders working tirelessly for the welfare of film industry professionals
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Leadership Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayLeaders.map((leader) => (
              <Card key={leader._id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="relative">
                  {leader.image ? (
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center group-hover:from-blue-200 group-hover:to-blue-300 transition-colors duration-300">
                      <User className="h-24 w-24 text-blue-600" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{leader.name}</h3>
                    <p className="text-blue-600 font-semibold mb-4">{leader.position}</p>
                  </div>
                  
                  {leader.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {leader.bio}
                    </p>
                  )}
                  
                  <div className="space-y-2">
                    {leader.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2 text-blue-600" />
                        <a href={`mailto:${leader.email}`} className="hover:text-blue-600 transition-colors">
                          {leader.email}
                        </a>
                      </div>
                    )}
                    {leader.phone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-blue-600" />
                        <a href={`tel:${leader.phone}`} className="hover:text-blue-600 transition-colors">
                          {leader.phone}
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Important Members Section */}
        <section className="mt-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Important Members</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our organization is strengthened by the dedication and expertise of our important members
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-2xl p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Advisory Board</h3>
                <p className="text-sm text-gray-600">
                  Experienced industry veterans providing strategic guidance
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Regional Representatives</h3>
                <p className="text-sm text-gray-600">
                  Local leaders representing different regions across South India
                </p>
              </div>
              
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Technical Committee</h3>
                <p className="text-sm text-gray-600">
                  Technical experts ensuring quality and innovation in our services
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Join Leadership CTA */}
        <section className="mt-20 bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Are you passionate about improving the film industry? Consider joining our leadership team
          </p>
          <a
            href="/contact"
            className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-8 py-3 rounded-lg transition-colors inline-flex items-center"
          >
            Get Involved
          </a>
        </section>
      </div>

      <Footer />
    </div>
  );
}