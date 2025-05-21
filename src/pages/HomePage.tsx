import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MessageSquare, Check, ArrowRight, Bot, User } from 'lucide-react';
import Button from '../components/Button';
import TextHumanizerDemo from '../components/TextHumanizerDemo';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <motion.div 
              className="md:w-1/2 mb-10 md:mb-0"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                Make AI-generated text sound <span className="text-blue-600">human</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our advanced AI humanizer tool makes machine-generated content sound natural, 
                authentic, and undetectable by AI detection tools.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/pricing">
                  <Button variant="outline" size="lg">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </motion.div>
            <motion.div 
              className="md:w-1/2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="bg-white p-6 rounded-2xl shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Bot className="h-6 w-6 text-red-500 mr-2" />
                    <span className="font-medium">AI Text</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-6 w-6 text-green-500 mr-2" />
                    <span className="font-medium">Human Text</span>
                  </div>
                </div>
                <TextHumanizerDemo />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose AiTextHuman?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform offers the most advanced AI humanizing technology to help you create content that reads naturally.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: <MessageSquare className="h-12 w-12 text-blue-600" />,
                title: 'Undetectable by AI',
                description: 'Our technology ensures your content passes through AI detection tools unnoticed.'
              },
              {
                icon: <Check className="h-12 w-12 text-blue-600" />,
                title: 'Maintain Context',
                description: 'We preserve your original meaning while making the text sound more human-written.'
              },
              {
                icon: <ArrowRight className="h-12 w-12 text-blue-600" />,
                title: 'Simple to Use',
                description: 'Just paste your AI-generated text, and get human-sounding content in seconds.'
              }
            ].map((feature, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="bg-blue-50 p-3 rounded-full w-fit mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our AI humanizer uses advanced language models to transform machine-generated text into natural-sounding content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Paste Your Text',
                description: 'Input your AI-generated content into our humanizer tool.'
              },
              {
                step: '02',
                title: 'Select Options',
                description: 'Choose how human-like you want your text to be and other preferences.'
              },
              {
                step: '03',
                title: 'Get Results',
                description: 'Receive your humanized text that sounds natural and authentic.'
              }
            ].map((step, index) => (
              <motion.div 
                key={index}
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <div className="bg-white p-8 rounded-xl shadow-md h-full">
                  <div className="text-4xl font-bold text-blue-600 opacity-20 mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2 z-10">
                    <ArrowRight className="h-8 w-8 text-blue-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Users Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of satisfied users who have improved their content with our AI humanizer.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                quote: "This tool has completely transformed my workflow. The AI content now reads like it was written by a professional writer.",
                author: "Sarah Johnson",
                title: "Content Manager"
              },
              {
                quote: "I've tried many AI humanizers, but this one is by far the best. My content now passes all AI detection tools with ease.",
                author: "Michael Chen",
                title: "Digital Marketer"
              },
              {
                quote: "As a student, this tool has been invaluable for my research papers. It maintains academic integrity while improving readability.",
                author: "Emily Rodriguez",
                title: "Graduate Student"
              }
            ].map((testimonial, index) => (
              <motion.div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-gray-600 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">{testimonial.author}</p>
                  <p className="text-gray-500 text-sm">{testimonial.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to make your AI text sound human?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            Start transforming your content today with our powerful AI humanizer tool.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" variant="outline" className="bg-white text-blue-600 hover:bg-blue-50">
                Get Started Free
              </Button>
            </Link>
            <Link to="/pricing">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                View Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;