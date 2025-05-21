import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Save, Copy, RotateCcw, Settings, AlertCircle, LucideProps } from 'lucide-react';
import Button from '../components/Button';
import Textarea from '../components/Textarea';
import Input from '../components/Input';
import { useAuthStore } from '../store/authStore';
import { useProjectStore } from '../store/projectStore';

// Define the available humanization modes
type HumanizationMode = 'standard' | 'casual' | 'academic' | 'creative';
type PersonalityType = 'neutral' | 'friendly' | 'professional' | 'casual';
type LengthAdjustment = 'maintain' | 'shorter' | 'longer';

interface ModeOptionProps {
  id: HumanizationMode;
  title: string;
  description: string;
  icon: React.FC<LucideProps>;
  selected: boolean;
  onClick: () => void;
}

const ModeOption: React.FC<ModeOptionProps> = ({
  id,
  title,
  description,
  icon: Icon,
  selected,
  onClick,
}) => (
  <div
    className={`border rounded-lg p-4 cursor-pointer transition-all ${
      selected
        ? 'border-blue-500 bg-blue-50'
        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
    }`}
    onClick={onClick}
  >
    <div className="flex items-center mb-2">
      <div className={`${selected ? 'text-blue-600' : 'text-gray-500'}`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className={`ml-2 font-medium ${selected ? 'text-blue-600' : 'text-gray-900'}`}>
        {title}
      </h3>
    </div>
    <p className="text-sm text-gray-600">{description}</p>
  </div>
);

const TextHumanizerPage: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    projects, 
    currentProject, 
    setCurrentProject, 
    createProject, 
    updateProject, 
    fetchProjects,
    humanizeText
  } = useProjectStore();
  
  const [title, setTitle] = useState('Untitled Project');
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<HumanizationMode>('standard');
  const [creditsUsed, setCreditsUsed] = useState(0);
  const [error, setError] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  
  // Advanced options
  const [humanizationStrength, setHumanizationStrength] = useState(5);
  const [personality, setPersonality] = useState<PersonalityType>('neutral');
  const [lengthAdjustment, setLengthAdjustment] = useState<LengthAdjustment>('maintain');
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get the project ID from the URL query parameters
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const projectId = query.get('id');
    
    if (projectId) {
      fetchProjects().then(() => {
        const project = projects.find(p => p.id === projectId);
        if (project) {
          setCurrentProject(project);
          setTitle(project.title);
          setInputText(project.content);
          setOutputText(project.humanizedContent || '');
          setCreditsUsed(project.creditsUsed);
          
          // Load mode and advanced options if they exist
          if (project.mode) {
            setMode(project.mode);
          }
          
          if (project.humanizationStrength) {
            setHumanizationStrength(project.humanizationStrength);
          }
          
          if (project.personality) {
            setPersonality(project.personality);
          }
          
          if (project.lengthAdjustment) {
            setLengthAdjustment(project.lengthAdjustment);
          }
        } else {
          // If project not found, redirect to create new
          navigate('/humanizer');
        }
      });
    } else {
      // Clear current project when creating new
      setCurrentProject(null);
      setTitle('Untitled Project');
      setInputText('');
      setOutputText('');
      setCreditsUsed(0);
      setMode('standard');
      setHumanizationStrength(5);
      setPersonality('neutral');
      setLengthAdjustment('maintain');
    }
  }, [location.search, fetchProjects, projects, setCurrentProject, navigate]);
  
  const handleModeChange = (newMode: HumanizationMode) => {
    setMode(newMode);
    // If we have a current project, update its mode
    if (currentProject) {
      updateProject(currentProject.id, { mode: newMode });
    }
  };
  
  const handleProcess = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to humanize');
      return;
    }
    
    if (!user) {
      setError('You must be logged in to use this feature');
      return;
    }
    
    const availableCredits = user.maxCredits - user.creditsUsed;
    const requiredCredits = Math.ceil(inputText.length / 100);
    
    if (requiredCredits > availableCredits) {
      setError(`Not enough credits. This operation requires ${requiredCredits} credits, but you only have ${availableCredits} available.`);
      return;
    }
    
    setError('');
    setIsProcessing(true);
    
    try {
      // Include advanced options when calling humanizeText
      const options = {
        humanizationStrength,
        personality,
        lengthAdjustment
      };
      
      const result = await humanizeText(inputText, mode, options);
      setOutputText(result.humanizedText);
      
      // Calculate credits used (approximately 1 credit per 100 characters)
      const usedCredits = Math.ceil(inputText.length / 100);
      setCreditsUsed(usedCredits);
      
      // Save the project with all settings
      if (currentProject) {
        await updateProject(currentProject.id, {
          title,
          content: inputText,
          humanizedContent: result.humanizedText,
          creditsUsed: usedCredits,
          mode: mode,
          humanizationStrength,
          personality,
          lengthAdjustment,
          humanizationDocumentId: result.documentId
        });
      } else {
        const newProject = await createProject(title, inputText);
        if (newProject) {
          await updateProject(newProject.id, {
            humanizedContent: result.humanizedText,
            creditsUsed: usedCredits,
            mode: mode,
            humanizationStrength,
            personality,
            lengthAdjustment,
            humanizationDocumentId: result.documentId
          });
          // Update URL with new project ID
          navigate(`/humanizer?id=${newProject.id}`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing your text');
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSave = async () => {
    if (!user) return;
    
    try {
      if (currentProject) {
        await updateProject(currentProject.id, {
          title,
          content: inputText,
          humanizedContent: outputText,
        });
      } else {
        const newProject = await createProject(title, inputText);
        if (newProject) {
          await updateProject(newProject.id, {
            humanizedContent: outputText,
            creditsUsed: creditsUsed
          });
          // Update URL with new project ID
          navigate(`/humanizer?id=${newProject.id}`);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save project');
    }
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    // Show a toast or some indication that copy was successful
  };
  
  const handleReset = () => {
    setOutputText('');
  };
  
  const availableCredits = user ? user.maxCredits - user.creditsUsed : 0;
  
  return (
    <div className="py-10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="mb-8 flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Text Humanizer</h1>
            <p className="text-gray-600">
              Make AI-generated text sound more human and natural
            </p>
          </div>
          <div className="flex items-center">
            <div className="text-sm text-gray-600 mr-4">
              Credits: <span className="font-semibold">{availableCredits}</span> available
            </div>
            <Button
              variant="ghost"
              onClick={() => setShowSettings(!showSettings)}
              className="flex items-center"
            >
              <Settings className="h-5 w-5 mr-1" />
              Settings
            </Button>
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Column */}
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="p-6 border-b border-gray-200">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Project Title"
                className="text-2xl font-semibold border-none p-0 focus:ring-0"
              />
            </div>
            <div className="p-6">
              <Textarea
                label="Paste AI-generated text"
                id="inputText"
                rows={12}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste your AI-generated text here..."
                className="resize-none"
              />
              <div className="mt-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  {inputText.length} characters (~{Math.ceil(inputText.length / 100)} credits needed)
                </div>
                <Button onClick={handleProcess} isLoading={isProcessing}>
                  Humanize Text
                </Button>
              </div>
            </div>
          </motion.div>
          
          {/* Output Column */}
          <motion.div 
            className="bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Humanized Output</h2>
              {outputText && (
                <div className="flex space-x-2">
                  <Button variant="ghost" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-1" />
                    Reset
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleSave}>
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              )}
            </div>
            <div className="p-6">
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
                  <div className="text-red-600">{error}</div>
                </div>
              ) : null}
              
              {outputText ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[300px]">
                  <p className="text-gray-900 whitespace-pre-wrap">{outputText}</p>
                </div>
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[300px] flex items-center justify-center">
                  <p className="text-gray-500 italic">
                    {isProcessing 
                      ? 'Processing your text...' 
                      : 'Humanized text will appear here'}
                  </p>
                </div>
              )}
              
              {outputText && (
                <div className="mt-4 text-sm text-gray-500">
                  {outputText.length} characters | {creditsUsed} credits used
                </div>
              )}
            </div>
          </motion.div>
        </div>
        
        {/* Settings Panel */}
        {showSettings && (
          <motion.div 
            className="mt-6 bg-white rounded-xl shadow-md overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Humanization Settings</h2>
            </div>
            <div className="p-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">Select a mode:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <ModeOption
                  id="standard"
                  title="Standard"
                  description="Balanced humanization suitable for most content"
                  icon={Settings}
                  selected={mode === 'standard'}
                  onClick={() => handleModeChange('standard')}
                />
                <ModeOption
                  id="casual"
                  title="Casual"
                  description="More relaxed, conversational tone"
                  icon={Settings}
                  selected={mode === 'casual'}
                  onClick={() => handleModeChange('casual')}
                />
                <ModeOption
                  id="academic"
                  title="Academic"
                  description="Formal style suitable for papers"
                  icon={Settings}
                  selected={mode === 'academic'}
                  onClick={() => handleModeChange('academic')}
                />
                <ModeOption
                  id="creative"
                  title="Creative"
                  description="More expressive and varied output"
                  icon={Settings}
                  selected={mode === 'creative'}
                  onClick={() => handleModeChange('creative')}
                />
              </div>
              <div className="mt-6">
                <h3 className="text-md font-medium text-gray-900 mb-4">Advanced options:</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Humanization Strength
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={humanizationStrength}
                      onChange={(e) => setHumanizationStrength(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Subtle</span>
                      <span>Strong</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Personality
                    </label>
                    <select 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={personality}
                      onChange={(e) => setPersonality(e.target.value as PersonalityType)}
                    >
                      <option value="neutral">Neutral</option>
                      <option value="friendly">Friendly</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Text Length Adjustment
                    </label>
                    <select 
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      value={lengthAdjustment}
                      onChange={(e) => setLengthAdjustment(e.target.value as LengthAdjustment)}
                    >
                      <option value="maintain">Maintain Original Length</option>
                      <option value="shorter">Shorter (Concise)</option>
                      <option value="longer">Longer (Detailed)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TextHumanizerPage;