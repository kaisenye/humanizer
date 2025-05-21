import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Mail, Phone } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import Textarea from '../components/Textarea';

const ContactPage: React.FC = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, we would handle form submission to a backend
    alert('Message sent! We will get back to you soon.');
  };

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about our product or need help with your account? We're here to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
            {/* Contact Information */}
            <motion.div 
              className="lg:col-span-2 bg-blue-600 text-white rounded-xl p-8"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-blue-100 mb-8">
                Fill out the form and our team will get back to you within 24 hours.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Phone className="h-6 w-6 text-blue-300 mr-4 mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-blue-100">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Mail className="h-6 w-6 text-blue-300 mr-4 mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-blue-100">support@aitexthuman.com</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 text-blue-300 mr-4 mt-1" />
                  <div>
                    <h3 className="font-medium">Office</h3>
                    <p className="text-blue-100">
                      123 Innovation Drive<br />
                      San Francisco, CA 94103<br />
                      United States
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h3 className="font-medium mb-4">Connect with us</h3>
                <div className="flex space-x-4">
                  {['twitter', 'facebook', 'instagram', 'linkedin'].map((platform) => (
                    <a 
                      key={platform}
                      href="#"
                      className="bg-blue-700 hover:bg-blue-800 h-10 w-10 rounded-full flex items-center justify-center transition-colors"
                    >
                      <span className="sr-only">{platform}</span>
                      <div className="h-5 w-5 text-white"></div>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
            
            {/* Contact Form */}
            <motion.div 
              className="lg:col-span-3 bg-white rounded-xl shadow-md p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Input
                    label="First Name"
                    type="text"
                    id="firstName"
                    required
                    placeholder="John"
                  />
                  <Input
                    label="Last Name"
                    type="text"
                    id="lastName"
                    required
                    placeholder="Doe"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <Input
                    label="Email"
                    type="email"
                    id="email"
                    required
                    placeholder="johndoe@example.com"
                  />
                  <Input
                    label="Phone Number"
                    type="tel"
                    id="phone"
                    placeholder="(555) 123-4567"
                  />
                </div>
                
                <div className="mb-6">
                  <Input
                    label="Subject"
                    type="text"
                    id="subject"
                    required
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div className="mb-6">
                  <Textarea
                    label="Message"
                    id="message"
                    rows={6}
                    required
                    placeholder="Tell us about your inquiry..."
                  />
                </div>
                
                <Button type="submit" size="lg">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
          
          {/* FAQ Section */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  question: "How quickly will I receive a response?",
                  answer: "We try to respond to all inquiries within 24 hours during business days. For urgent matters, please call our support line."
                },
                {
                  question: "Do you offer live chat support?",
                  answer: "Yes, our live chat is available Monday to Friday, 9am to 5pm PST. You can access it from the dashboard when logged in."
                },
                {
                  question: "Can I request a demo of the premium features?",
                  answer: "Absolutely! Fill out the contact form and select 'Request Demo' as the subject, and our sales team will arrange a personalized demo."
                },
                {
                  question: "How do I report a technical issue?",
                  answer: "You can report technical issues through the contact form or directly from your dashboard. Please include as much detail as possible."
                }
              ].map((faq, index) => (
                <motion.div 
                  key={index}
                  className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;