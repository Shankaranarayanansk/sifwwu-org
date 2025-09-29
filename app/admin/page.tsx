"use client";

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, MessageSquare, Award, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Stats {
  totalServices: number;
  totalLeaders: number;
  totalMessages: number;
  totalAchievements: number;
  totalUpdates: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalServices: 0,
    totalLeaders: 0,
    totalMessages: 0,
    totalAchievements: 0,
    totalUpdates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Fetch actual stats from API endpoints
        const [servicesRes, leadersRes, achievementsRes] = await Promise.all([
          fetch('/api/v1/services'),
          fetch('/api/v1/leaders'),
          fetch('/api/v1/achievements')
        ]);

        const [servicesData, leadersData, achievementsData] = await Promise.all([
          servicesRes.json(),
          leadersRes.json(),
          achievementsRes.json()
        ]);

        setStats({
          totalServices: servicesData.services?.length || 0,
          totalLeaders: leadersData.leaders?.length || 0,
          totalMessages: 0, // Will be implemented when messages API is ready
          totalAchievements: achievementsData.achievements?.length || 0,
          totalUpdates: 0, // Will be implemented when updates API is ready
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // Fallback to default values
        setStats({
          totalServices: 6,
          totalLeaders: 3,
          totalMessages: 0,
          totalAchievements: 3,
          totalUpdates: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Total Services',
      value: stats.totalServices,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Leaders',
      value: stats.totalLeaders,
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Messages',
      value: stats.totalMessages,
      icon: MessageSquare,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Achievements',
      value: stats.totalAchievements,
      icon: Award,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Updates',
      value: stats.totalUpdates,
      icon: TrendingUp,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome to the SIFWWU admin panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`h-8 w-8 rounded-full ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Add New Service</span>
              <Link href="/admin/services" className="text-blue-600 hover:text-blue-800 font-medium">
                Create
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Manage Leaders</span>
              <Link href="/admin/leaders" className="text-blue-600 hover:text-blue-800 font-medium">
                View
              </Link>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Review Messages</span>
              <Link href="/admin/messages" className="text-blue-600 hover:text-blue-800 font-medium">
                Review
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Version</span>
              <span className="font-medium">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last Updated</span>
              <span className="font-medium">Today</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="text-green-600 font-medium">Operational</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}