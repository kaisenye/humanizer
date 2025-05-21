import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, CreditCard, Lock } from 'lucide-react';
import Button from '../components/Button';
import Input from '../components/Input';
import { useAuthStore } from '../store/authStore';
import type { PlanInfo } from '../types';

const PaymentPage: React.FC = () => {
  const { user, updateUserProfile } = useAuthStore();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState<PlanInfo | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  // Credit card form state
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  const [zipCode, setZipCode] = useState('');

  const plans: PlanInfo[] = [
    {
      id: 'free',
      name: 'Free',
      price: 0,
      period: 'monthly',
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

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } 
    return value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 3) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return value;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiry(e.target.value);
    setCardExpiry(formatted);
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlanId(planId);
    const plan = plans.find(p => p.id === planId);
    setSelectedPlan(plan || null);
  };

  const validateForm = () => {
    // Basic validation - in a real app, you'd want more robust validation
    const errors: {[key: string]: string} = {};
    
    if (cardName.length === 0) {
      errors.cardName = "Please enter the name on your card";
    }
    
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      errors.cardNumber = "Please enter a valid 16-digit card number";
    }
    
    if (cardExpiry.length !== 5) {
      errors.cardExpiry = "Please enter a valid expiry date (MM/YY)";
    }
    
    if (cardCVC.length !== 3) {
      errors.cardCVC = "Please enter a valid 3-digit CVC";
    }
    
    if (zipCode.length !== 5) {
      errors.zipCode = "Please enter a valid 5-digit ZIP code";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (!isValid || !selectedPlan || !user) {
      // Show warnings but don't prevent submission
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user profile with new subscription
      await updateUserProfile({
        subscriptionTier: selectedPlan.id as 'free' | 'basic' | 'premium' | 'enterprise',
        maxCredits: selectedPlan.credits
      });
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Payment failed:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Complete Your Purchase
            </h1>
            <p className="text-gray-600">
              Select a plan and enter your payment details
            </p>
          </div>
          
          {/* Plan Selection */}
          <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Choose a Plan</h2>
            </div>
            <div className="p-6">
              {/* Billing Cycle Selector */}
              <div className="flex justify-center mb-8">
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
                    Yearly <span className="text-green-600 text-xs font-bold">Save 16.7%</span>
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {plans
                  .filter(plan => !(plan.id === 'free' && user?.subscriptionTier !== 'free'))
                  .map((plan) => (
                    <div 
                      key={plan.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedPlanId === plan.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-300'
                      }`}
                      onClick={() => handlePlanSelect(plan.id)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">{plan.name}</h3>
                        {user?.subscriptionTier === plan.id && (
                          <span className="text-xs font-medium bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                            Current
                          </span>
                        )}
                      </div>
                      <div className="mb-4">
                        <span className="text-2xl font-bold text-gray-900">${plan.price}</span>
                        <span className="text-gray-500">/{billingCycle === 'monthly' ? 'mo' : 'yr'}</span>
                      </div>
                      <ul className="space-y-2 mb-4">
                        {plan.features.slice(0, 3).map((feature, i) => (
                          <li key={i} className="flex items-start text-sm">
                            <Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          
          {/* Payment Details */}
          {selectedPlan && selectedPlan.price > 0 ? (
            <motion.div 
              className="bg-white rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Payment Details</h2>
              </div>
              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-6">
                    <Input
                      label="Name on Card"
                      id="cardName"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="John Doe"
                      required
                    />
                    {formErrors.cardName && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.cardName}</p>
                    )}
                  </div>
                  
                  <div className="mb-6">
                    <Input
                      label="Card Number"
                      id="cardNumber"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                    />
                    {formErrors.cardNumber && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div>
                      <Input
                        label="Expiry Date"
                        id="cardExpiry"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                      />
                      {formErrors.cardExpiry && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.cardExpiry}</p>
                      )}
                    </div>
                    
                    <div>
                      <Input
                        label="CVC"
                        id="cardCVC"
                        value={cardCVC}
                        onChange={(e) => setCardCVC(e.target.value.replace(/\D/g, ''))}
                        placeholder="123"
                        maxLength={3}
                        required
                      />
                      {formErrors.cardCVC && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.cardCVC}</p>
                      )}
                    </div>
                    
                    <div>
                      <Input
                        label="Zip Code"
                        id="zipCode"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="12345"
                        maxLength={5}
                        required
                      />
                      {formErrors.zipCode && (
                        <p className="mt-1 text-sm text-red-600">{formErrors.zipCode}</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Lock className="h-4 w-4 mr-1 text-green-600" />
                      Secured by 256-bit encryption
                    </div>
                    <div className="flex items-center space-x-2">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                      <span className="text-sm text-gray-500">Major cards accepted</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="text-gray-900">${selectedPlan.price}</span>
                    </div>
                    {billingCycle === 'yearly' && (
                      <div className="flex justify-between mb-2 text-green-600">
                        <span>Yearly discount</span>
                        <span>-$23.89</span>
                      </div>
                    )}
                    <div className="flex justify-between font-semibold text-lg">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${selectedPlan.price}</span>
                    </div>
                  </div>
                  
                  <Button
                    type="submit"
                    fullWidth
                    size="lg"
                    isLoading={isProcessing}
                  >
                    Complete Purchase
                  </Button>
                  
                  <p className="text-xs text-center text-gray-500 mt-4">
                    By completing this purchase, you agree to our{' '}
                    <a href="#" className="text-blue-600">Terms of Service</a> and{' '}
                    <a href="#" className="text-blue-600">Privacy Policy</a>
                  </p>
                </form>
              </div>
            </motion.div>
          ) : selectedPlan ? (
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Confirm Selection</h2>
              </div>
              <div className="p-6 text-center">
                <p className="mb-6 text-gray-600">
                  You've selected the <span className="font-semibold">{selectedPlan.name}</span> plan, which is free of charge.
                </p>
                <Button
                  onClick={() => {
                    setIsProcessing(true);
                    setTimeout(() => {
                      // Update user profile with free plan
                      if (user) {
                        updateUserProfile({
                          subscriptionTier: 'free',
                          maxCredits: 100
                        }).then(() => {
                          navigate('/dashboard');
                        });
                      }
                    }, 1000);
                  }}
                  isLoading={isProcessing}
                >
                  Activate Free Plan
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden p-6 text-center">
              <p className="text-gray-600">Please select a plan to continue.</p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default PaymentPage;