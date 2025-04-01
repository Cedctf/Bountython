import { useState } from 'react';

export default function ProposalAnalysis({ analysis, isLoading }) {
  const [activeTab, setActiveTab] = useState('summary');

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 relative">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-indigo-200 dark:border-indigo-900 border-t-indigo-600 dark:border-t-indigo-500 rounded-full animate-spin"></div>
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
            <svg className="w-8 h-8 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
        </div>
        <p className="mt-6 text-gray-600 dark:text-gray-300 font-medium">Analyzing governance proposal</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Using AI to generate insights and recommendations</p>
        <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 max-w-md">
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center py-16">
        <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200">No Analysis Yet</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md">
          Submit a governance proposal to see AI-powered insights and recommendations
        </p>
        <div className="mt-8 flex flex-col items-center">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">How it works</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-4 w-full max-w-lg">
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Submit Proposal</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">AI Analysis</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center mb-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-300">Get Insights</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Add default values for all analysis properties if they're missing
  const summary = analysis.summary || "No summary available.";
  const impact = Array.isArray(analysis.impact) && analysis.impact.length > 0 
    ? analysis.impact 
    : ["No impact details available."];
  const recommendations = Array.isArray(analysis.recommendations) && analysis.recommendations.length > 0 
    ? analysis.recommendations 
    : [{ title: "No Recommendations", description: "No recommendation details available." }];
  const sentiment = analysis.sentiment || "Neutral";

  const renderSentimentBadge = () => {
    const colorMap = {
      positive: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 border border-green-200 dark:border-green-800',
      neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300 border border-gray-200 dark:border-gray-600',
      negative: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-800',
      mixed: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800'
    };
    
    const sentimentClass = sentiment && typeof sentiment === 'string' 
      ? colorMap[sentiment.toLowerCase()] || colorMap.neutral 
      : colorMap.neutral;
    
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${sentimentClass}`}>
        {sentiment || 'Neutral'}
      </span>
    );
  };

  // Check if all analysis fields are empty
  const isEmptyAnalysis = 
    (!analysis.summary || analysis.summary.trim() === '') &&
    (!Array.isArray(analysis.impact) || analysis.impact.length === 0) &&
    (!Array.isArray(analysis.recommendations) || analysis.recommendations.length === 0);

  if (isEmptyAnalysis) {
    return (
      <div className="space-y-6 h-full">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Analysis
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Governance proposal insights</p>
            {renderSentimentBadge()}
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-4 rounded-lg mb-4">
          <div className="flex">
            <svg className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-amber-800 dark:text-amber-300 font-medium">No analysis content available</p>
              <p className="text-amber-700 dark:text-amber-400 text-sm mt-1">The API returned an empty or invalid response. Try a more detailed proposal or try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[600px] overflow-hidden neon-container rounded-lg">
      <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
            <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            AI Analysis
          </h2>
          <div className="flex justify-between items-center">
            <p className="text-gray-600 dark:text-gray-400 text-sm">Governance proposal insights</p>
            {renderSentimentBadge()}
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-6">
            {['summary', 'impact', 'recommendations'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${activeTab === tab 
                    ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' 
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'}
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-4 custom-scrollbar overflow-y-auto flex-grow pr-2">
          {activeTab === 'summary' && (
            <div className="prose prose-indigo dark:prose-invert max-w-none">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Summary
              </h3>
              <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line text-base leading-relaxed">
                {summary || "No summary available."}
              </div>
            </div>
          )}

          {activeTab === 'impact' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Potential Impact
              </h3>
              <ul className="space-y-3">
                {impact.map((item, index) => (
                  <li key={index} className="flex items-start p-3 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg">
                    <span className="flex-shrink-0 h-6 w-6 text-indigo-500 mt-0.5">
                      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                    <span className="ml-3 text-gray-700 dark:text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Recommendations
              </h3>
              <ul className="space-y-4">
                {recommendations.map((rec, index) => (
                  <li key={index} className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 p-4 rounded-lg border border-indigo-100 dark:border-indigo-800/20">
                    <div className="font-medium text-indigo-700 dark:text-indigo-300 text-base">{rec.title || "No Title"}</div>
                    <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{rec.description || "No description available."}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 