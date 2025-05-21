interface HumanizeOptions {
  readability: 'High School' | 'University' | 'Doctorate' | 'Journalist' | 'Marketing';
  purpose: 'General Writing' | 'Essay' | 'Article' | 'Marketing Material' | 'Story' | 'Cover Letter' | 'Report' | 'Business Material' | 'Legal Material';
  strength?: 'Quality' | 'Balanced' | 'More Human';
  model?: 'v2' | 'v11';
}

interface SubmitResponse {
  status: string;
  id: string;
  error?: string;
}

interface DocumentResponse {
  id: string;
  output: string;
  input: string;
  readability: string;
  createdDate: string;
  purpose: string;
  error?: string;
}

interface HumanizeResponse {
  success: boolean;
  humanizedText: string;
  documentId?: string;
  error?: string;
}

/**
 * Submits text for humanization
 */
async function submitDocument(
  text: string,
  options: HumanizeOptions
): Promise<SubmitResponse> {
  const apiKey = import.meta.env.VITE_APP_HUMANIZER_API_KEY;
  
  if (!apiKey) {
    throw new Error('Humanizer API key not found');
  }

  try {
    console.log('Submitting document with options:', {
      readability: options.readability,
      purpose: options.purpose,
      strength: options.strength || 'Balanced',
      model: options.model || 'v11'
    });
    
    const response = await fetch('https://humanize.undetectable.ai/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        content: text,
        readability: options.readability,
        purpose: options.purpose,
        strength: options.strength || 'Balanced',
        model: options.model || 'v11'
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'No error details available');
      console.error('API Error Response:', response.status, errorText);
      
      if (response.status === 400) {
        return {
          status: 'error',
          id: '',
          error: `Bad request: ${errorText || 'Likely insufficient credits or invalid API key'}`
        };
      }
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error submitting document:', error);
    return {
      status: 'error',
      id: '',
      error: error.message
    };
  }
}

/**
 * Retrieves a humanized document by ID
 */
async function retrieveDocument(documentId: string): Promise<DocumentResponse> {
  const apiKey = import.meta.env.VITE_APP_HUMANIZER_API_KEY;
  
  if (!apiKey) {
    throw new Error('Humanizer API key not found');
  }

  try {
    const response = await fetch('https://humanize.undetectable.ai/document', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': apiKey,
      },
      body: JSON.stringify({
        id: documentId
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error('Error retrieving document:', error);
    return {
      id: documentId,
      output: '',
      input: '',
      readability: '',
      createdDate: '',
      purpose: '',
      error: error.message
    };
  }
}

/**
 * Polls for document completion
 */
async function pollForCompletion(documentId: string, maxAttempts = 30): Promise<DocumentResponse> {
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    const document = await retrieveDocument(documentId);
    
    // If there's an error or the output is available
    if (document.error || document.output) {
      return document;
    }
    
    // Wait before trying again (5 seconds)
    await new Promise(resolve => setTimeout(resolve, 5000));
    attempts++;
  }
  
  throw new Error('Document processing timed out');
}

/**
 * Main function to humanize text with the undetectable.ai API
 */
export async function humanizeTextApi(
  text: string, 
  mode: 'standard' | 'casual' | 'academic' | 'creative' = 'standard',
  options: any = {}
): Promise<HumanizeResponse> {
  // Map our application modes to API options
  const apiOptions: HumanizeOptions = {
    readability: mapReadabilityLevel(mode),
    purpose: mapPurpose(mode),
    strength: mapStrength(options.humanizationStrength),
    model: 'v11' // Use the latest model
  };

  try {
    // Step 1: Submit the document
    const submitResponse = await submitDocument(text, apiOptions);
    
    if (submitResponse.error) {
      return {
        success: false,
        humanizedText: '',
        error: submitResponse.error
      };
    }
    
    // Step 2: Poll for completion
    const document = await pollForCompletion(submitResponse.id);
    
    if (document.error) {
      return {
        success: false,
        humanizedText: '',
        documentId: submitResponse.id,
        error: document.error
      };
    }
    
    // Return the humanized text
    return {
      success: true,
      humanizedText: document.output,
      documentId: document.id
    };
  } catch (error: any) {
    console.error('Error humanizing text:', error);
    return {
      success: false,
      humanizedText: '',
      error: error.message
    };
  }
}

// Helper functions to map our app options to API options

function mapReadabilityLevel(
  mode: 'standard' | 'casual' | 'academic' | 'creative'
): 'High School' | 'University' | 'Doctorate' | 'Journalist' | 'Marketing' {
  switch (mode) {
    case 'casual':
      return 'High School';
    case 'standard':
      return 'University';
    case 'academic':
      return 'Doctorate';
    case 'creative':
      return 'Marketing';
    default:
      return 'University';
  }
}

function mapPurpose(
  mode: 'standard' | 'casual' | 'academic' | 'creative'
): 'General Writing' | 'Essay' | 'Article' | 'Marketing Material' | 'Story' | 'Cover Letter' | 'Report' | 'Business Material' | 'Legal Material' {
  switch (mode) {
    case 'casual':
      return 'General Writing';
    case 'standard':
      return 'Article';
    case 'academic':
      return 'Essay';
    case 'creative':
      return 'Story';
    default:
      return 'General Writing';
  }
}

function mapStrength(
  strength?: number
): 'Quality' | 'Balanced' | 'More Human' {
  if (!strength) return 'Balanced';
  
  if (strength <= 3) {
    return 'Quality';
  } else if (strength <= 7) {
    return 'Balanced';
  } else {
    return 'More Human';
  }
} 