import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Target, Heart, Shield } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function AboutPage() {
  const values = [
    {
      icon: Users,
      title: 'Unity',
      description: 'Bringing together all film industry professionals under one umbrella for collective growth and support.',
    },
    {
      icon: Target,
      title: 'Progress',
      description: 'Driving positive change and innovation in the South Indian film industry through collaborative efforts.',
    },
    {
      icon: Heart,
      title: 'Welfare',
      description: 'Prioritizing the well-being and rights of every individual working in the film industry.',
    },
    {
      icon: Shield,
      title: 'Protection',
      description: 'Providing legal assistance and protection for workers against exploitation and unfair practices.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About SIFWWU</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Learn about our mission, vision, and commitment to the South Indian film industry
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Who We Are Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Who We Are?</h2>
              <p className="text-lg text-gray-600 mb-6">
                The South Indian Film Workers Welfare Union is an organization dedicated to supporting 
                professionals in the film industry. We work tirelessly to ensure the welfare, rights, 
                and development of all film industry workers across South India.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                Our union represents a diverse community of talented individuals including producers, 
                directors, actors, technicians, and support staff who contribute to the vibrant 
                South Indian cinema landscape.
              </p>
              <p className="text-lg text-gray-600">
                We believe in creating a sustainable and supportive ecosystem where every professional 
                can thrive and contribute to the growth of our beloved film industry.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-2xl">
              <div className="text-center">
                <div className="bg-blue-600 text-white p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                  <Users className="h-10 w-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Community</h3>
                <p className="text-gray-600">
                  A growing network of film industry professionals working together 
                  for mutual support and industry advancement.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why We Started Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 rounded-2xl">
                <div className="text-center">
                  <div className="bg-yellow-600 text-white p-4 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                    <Target className="h-10 w-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                  <p className="text-gray-600">
                    To create positive change and provide comprehensive support 
                    to all South Indian film industry professionals.
                  </p>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Why We Started?</h2>
              <p className="text-lg text-gray-600 mb-6">
                Our union was formed not as a competition or opposition to anyone, but to bring 
                positive change to the film industry. We recognized the need for a unified platform 
                that could address the challenges faced by film industry professionals.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We believe in unity, progress, and creating opportunities for everyone involved 
                in filmmaking. Our goal is to bridge gaps, provide support, and ensure that 
                every professional in our industry has access to the resources they need to succeed.
              </p>
              <p className="text-lg text-gray-600">
                Through collective action and mutual support, we aim to elevate the standards 
                of the South Indian film industry and create a more inclusive and prosperous 
                environment for all.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values Section */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work and define our commitment to the film industry
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center group-hover:bg-blue-600 transition-colors duration-300">
                    <value.icon className="h-8 w-8 text-blue-600 group-hover:text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Vision Section */}
        <section className="bg-gray-50 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-16 rounded-2xl">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Vision</h2>
            <p className="text-xl text-gray-600 mb-8">
              To be the leading welfare organization for South Indian film industry professionals, 
              fostering a thriving ecosystem where creativity, innovation, and collaboration flourish.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                <p className="text-gray-600">Members Supported</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                <p className="text-gray-600">Projects Assisted</p>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
                <p className="text-gray-600">Support Available</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}