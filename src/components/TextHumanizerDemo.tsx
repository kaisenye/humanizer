import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Button from './Button';

const TextHumanizerDemo: React.FC = () => {
  const [isProcessed, setIsProcessed] = useState(false);
  
  const originalText = "The utilization of artificial intelligence for content generation has seen unprecedented growth in recent years. The implementation of such advanced technologies enables content creators to produce textual materials with greater efficiency. The methodology employed by AI systems is based on statistical analysis of vast corpora of text, allowing for the emergence of coherent linguistic patterns.";
  
  const humanizedText = "Using AI for creating content has grown like never before in recent years. These advanced technologies help content creators make text more efficiently. AI systems basically work by analyzing huge collections of text statistically, which lets them create coherent language patterns.";

  const handleProcess = () => {
    setIsProcessed(true);
  };

  const handleReset = () => {
    setIsProcessed(false);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Original AI Text</h3>
          <p className="text-gray-800">
            {originalText}
          </p>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Humanized Result</h3>
          {isProcessed ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-gray-800"
            >
              {humanizedText}
            </motion.p>
          ) : (
            <p className="text-gray-400 italic">Click "Humanize" to see the result</p>
          )}
        </div>
      </div>
      
      <div className="flex space-x-3">
        {isProcessed ? (
          <Button onClick={handleReset} variant="outline" fullWidth>
            Reset
          </Button>
        ) : (
          <Button onClick={handleProcess} fullWidth>
            Humanize
          </Button>
        )}
      </div>
    </div>
  );
};

export default TextHumanizerDemo;