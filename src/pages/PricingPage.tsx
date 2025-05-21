import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Button from '../components/Button';
import { useAuthStore } from '../store/authStore';
import type { PlanInfo } from '../types';

const PricingPage: React.FC = () => {
  const { user } = useAuthStore();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans: PlanInfo[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: billingCycle,
      credits: 100,
      features: [
        '100 credits per month',
        'Basic humanization features',
        'Standard quality text',
        'Email support'
      ]
    },
    {
      id: 'basic',
      name: 'Basic',
      price: billingCycle === 'monthly' ? 9.99 : 99.99,
      period: billingCycle,
      credits: 1000,
      features: [
        '1,000 credits per month',
        'Advanced humanization options',
        'High quality text',
        'Priority email support',
        'Basic analytics'
      ],
      popularPlan: true
    },
    {
      id: 'premium',
      name: 'Premium',
      price: billingCycle === 'monthly' ? 19.99 : 199.99,
      period: billingCycle,
      credits: 5000,
      features: [
        '5,000 credits per month',
        'All humanization features',
        'Premium quality text',
        'Priority support',
        'Advanced analytics',
        'API access'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 49.99 : 499.99,
      period: billingCycle,
      credits: 20000,
      features: [
        '20,000 credits per month',
        'All humanization features',
        'Highest quality text',
        '24/7 dedicated support',
        'Full analytics suite',
        'API access with higher rate limits',
        'Custom integrations'
      ]
    }
  ];

  // Calculate yearly discount
  const yearlyDiscount = 16.7; // Approximately 16.7% discount

  return (
    <div className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Simple, Transparent Pricing
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Choose the perfect plan for your content needs. All plans include our core humanizing technology.
          </motion.p>
          
          {/* Billing Cycle Selector */}
          <motion.div 
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="bg-gray-100 p-1 rounded-lg inline-flex">
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingCycle === 'monthly' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setBillingCycle('monthly')}
              >
                Monthly
              </button>
              <button
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  billingCycle === 'yearly' 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                onClick={() => setBillingCycle('yearly')}
              >
                Yearly <span className="text-green-600 text-xs font-bold">Save {yearlyDiscount}%</span>
              </button>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan, index) => (
            <motion.div 
              key={plan.id}
              className={`bg-white rounded-xl shadow-md overflow-hidden border ${
                plan.popularPlan ? 'border-blue-500' : 'border-gray-200'
              } flex flex-col h-full relative`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 * index }}
            >
              {plan.popularPlan && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-3 py-1 uppercase">
                  Most Popular
                </div>
              )}
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.credits.toLocaleString()} credits per {billingCycle === 'monthly' ? 'month' : 'year'}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-6 pb-6">
                <Link to={user ? "/payment" : "/signup"}>
                  <Button 
                    fullWidth
                    variant={plan.popularPlan ? 'primary' : 'outline'}
                    className={plan.popularPlan ? '' : 'border-2'}
                  >
                    {plan.price === 0 ? 'Sign Up Free' : 'Get Started'}
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
        
        {/* FAQs */}
        <div className="mt-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "What are credits?",
                answer: "Credits are our usage currency. Each credit allows you to humanize a certain amount of text. One credit typically covers approximately 100 words of input text."
              },
              {
                question: "Do credits roll over?",
                answer: "Credits reset at the beginning of each billing cycle and do not roll over to the next period."
              },
              {
                question: "Can I cancel my subscription anytime?",
                answer: "Yes, you can cancel your subscription at any time. Your plan will remain active until the end of your current billing cycle."
              },
              {
                question: "What payment methods do you accept?",
                answer: "We accept all major credit cards including Visa, Mastercard, American Express, and Discover."
              },
              {
                question: "Is there a limit to how much text I can humanize?",
                answer: "The limit depends on your plan's credit allowance. You can purchase additional credits if you need more before your next billing cycle."
              },
              {
                question: "Can I upgrade my plan later?",
                answer: "Yes, you can upgrade your plan at any time. The cost will be prorated based on the remaining time in your current billing cycle."
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
        
        {/* CTA */}
        <div className="bg-blue-50 rounded-2xl p-8 md:p-12 mt-20">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Need a custom plan for your organization?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              We offer custom plans for organizations with specific needs. Contact us to discuss your requirements.
            </p>
            <Link to="/contact">
              <Button size="lg">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;