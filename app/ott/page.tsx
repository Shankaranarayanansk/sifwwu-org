import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Users, 
  BookOpen, 
  Briefcase, 
  Compass, 
  GraduationCap, 
  Eye, 
  UserPlus,
  ArrowRight,
  Star
} from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function OTTPage() {
  const features = [
    {
      icon: Users,
      title: 'Support Small-Scale Producers',
      description: 'Providing a platform for independent filmmakers and small-scale producers to showcase their content and reach wider audiences.',
    },
    {
      icon: BookOpen,
      title: 'Skill Development',
      description: 'Comprehensive training programs and workshops to enhance technical and creative skills in filmmaking.',
    },
    {
      icon: Briefcase,
      title: 'Job Opportunities',
      description: 'Connecting talented professionals with production houses and creating employment opportunities in the industry.',
    },
    {
      icon: Compass,
      title: 'Career Guidance',
      description: 'Expert mentorship and career counseling to help individuals navigate their path in the film industry.',
    },
    {
      icon: GraduationCap,
      title: 'Scholarships',
      description: 'Financial assistance and scholarship programs for deserving students pursuing film education.',
    },
    {
      icon: Eye,
      title: 'Exposure',
      description: 'Providing visibility and recognition to emerging talent through our platform and industry connections.',
    },
    {
      icon: UserPlus,
      title: 'Internships',
      description: 'Hands-on learning experiences with established production houses and industry professionals.',
    },
  ];

  const benefits = [
    {
      title: 'Content Creation Support',
      description: 'End-to-end support for content creators from concept to distribution.',
    },
    {
      title: 'Industry Networking',
      description: 'Connect with industry professionals, producers, and fellow creators.',
    },
    {
      title: 'Technical Resources',
      description: 'Access to professional equipment and technical expertise.',
    },
    {
      title: 'Marketing & Promotion',
      description: 'Comprehensive marketing support to reach your target audience.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-900 via-blue-900 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-2xl">
                <Play className="h-16 w-16 text-yellow-400" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              A2S <span className="text-yellow-400">OTT Platform</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto mb-8">
              Empowering South Indian film industry professionals with comprehensive support, 
              opportunities, and a platform to showcase their talent
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                Join the Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Platform Overview */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What is A2S OTT Platform?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A2S OTT Platform is a comprehensive ecosystem designed to support, nurture, and 
              promote talent in the South Indian film industry. We provide the tools, resources, 
              and opportunities needed to succeed in today's digital entertainment landscape.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">500+</div>
                    <p className="text-gray-600">Content Creators</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">100+</div>
                    <p className="text-gray-600">Projects Supported</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">50+</div>
                    <p className="text-gray-600">Industry Partners</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">24/7</div>
                    <p className="text-gray-600">Platform Access</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
              <p className="text-lg text-gray-600 mb-6">
                To democratize content creation and distribution in the South Indian film industry, 
                providing equal opportunities for all professionals regardless of their background 
                or experience level.
              </p>
              <div className="flex items-center text-blue-600 font-medium">
                <Star className="h-5 w-5 mr-2" />
                Recognized by leading industry bodies
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive support system designed to help you succeed at every stage of your career
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto bg-gradient-to-br from-purple-100 to-blue-100 w-16 h-16 rounded-full flex items-center justify-center group-hover:from-purple-600 group-hover:to-blue-600 transition-all duration-300 mb-4">
                    <feature.icon className="h-8 w-8 text-purple-600 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-purple-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="mb-20">
          <div className="bg-gray-50 rounded-2xl p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose A2S?</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                We provide comprehensive support to help you achieve your goals in the film industry
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="bg-purple-100 p-2 rounded-lg flex-shrink-0">
                    <ArrowRight className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get started on your journey with A2S OTT Platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-purple-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Register & Apply</h3>
              <p className="text-gray-600">
                Create your profile and submit your application with your portfolio and requirements
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Matched</h3>
              <p className="text-gray-600">
                Our team reviews your application and matches you with suitable opportunities and resources
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Start Creating</h3>
              <p className="text-gray-600">
                Begin your journey with full support, resources, and guidance from our platform
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-purple-900 via-blue-900 to-blue-800 text-white rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join A2S?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Take the first step towards advancing your career in the South Indian film industry
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
              Apply Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900">
              Contact Us
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}