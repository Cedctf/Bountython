import { useState, useEffect } from 'react';
import { createProposal } from '../services/blockchain';

export default function ProposalForm({ proposal, setProposal, onAnalyze, isWalletConnected, isLoading, wallet }) {
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(false);
  const [transactionSignature, setTransactionSignature] = useState('');
  const [analysis, setAnalysis] = useState(null);

  // Update the local analysis state when the parent component processes an analysis
  useEffect(() => {
    if (!analysis && !isLoading && typeof window !== 'undefined' && window.latestAnalysis) {
      setAnalysis(window.latestAnalysis);
    }
  }, [analysis, isLoading]);

  const handleChange = (e) => {
    const text = e.target.value;
    setProposal(text);
    setCharCount(text.length);
    if (error) setError('');
    // Reset transaction success when form changes
    if (transactionSuccess) {
      setTransactionSuccess(false);
      setTransactionSignature('');
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    
    if (!isWalletConnected) {
      setError('Please connect your wallet first');
      return;
    }
    
    if (!proposal.trim()) {
      setError('Please enter a proposal to analyze');
      return;
    }
    
    setError('');
    
    // Call the parent's onAnalyze function
    try {
      await onAnalyze(proposal);
    } catch (error) {
      setError(`Analysis failed: ${error.message}`);
    }
  };

  const handleSubmitToBlockchain = async () => {
    if (!analysis) {
      setError('Please analyze the proposal first before submitting to blockchain');
      return;
    }

    if (!isWalletConnected || !wallet) {
      setError('Please connect your wallet to submit to blockchain');
      return;
    }

    setSubmitLoading(true);
    setError('');
    
    try {
      // Extract the relevant data from the analysis
      const { summary, sentiment } = analysis;
      
      // Create the proposal on the blockchain
      const result = await createProposal(
        wallet,
        `Proposal: ${proposal.slice(0, 50)}${proposal.length > 50 ? '...' : ''}`, // Title (shortened)
        proposal, // Full proposal text as description
        summary, // AI-generated summary
        sentiment, // AI-generated sentiment
        86400 // 1 day voting period
      );
      
      setTransactionSignature(result.signature);
      setTransactionSuccess(true);
    } catch (error) {
      console.error('Error submitting proposal to blockchain:', error);
      setError(`Failed to submit to blockchain: ${error.message}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const sampleProposals = [
    "Increase community treasury allocation for developer grants from 5% to 10% to accelerate ecosystem growth.",
    "Change voting threshold from 15% to 10% to improve governance participation.",
    "Implement a 2-day voting delay period for all proposals to allow for proper community discussion."
  ];

  const loadSampleProposal = (index) => {
    setProposal(sampleProposals[index]);
    setCharCount(sampleProposals[index].length);
    setError('');
    setTransactionSuccess(false);
    setTransactionSignature('');
    setAnalysis(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2 flex items-center">
          <svg className="w-5 h-5 text-indigo-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Governance Proposal
        </h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">Enter a governance proposal to analyze with AI</p>
      </div>

      {!isWalletConnected && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 p-4 rounded-lg mb-4 flex items-start">
          <svg className="w-5 h-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <p className="text-amber-800 dark:text-amber-300 font-medium text-sm">Wallet not connected</p>
            <p className="text-amber-700 dark:text-amber-400 text-xs mt-1">Please connect your wallet to use this feature</p>
          </div>
        </div>
      )}

      {transactionSuccess && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-4 rounded-lg mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-800 dark:text-green-300 font-medium">Proposal submitted to blockchain!</p>
          </div>
          <p className="text-green-700 dark:text-green-400 text-xs mt-2">Transaction signature:</p>
          <a 
            href={`https://explorer.solana.com/tx/${transactionSignature}?cluster=devnet`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block mt-1 text-xs font-mono p-2 bg-green-100 dark:bg-green-900/40 rounded overflow-x-auto text-green-800 dark:text-green-300 hover:underline"
          >
            {transactionSignature}
          </a>
        </div>
      )}

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-1">
            <label htmlFor="proposal" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Proposal Text
            </label>
            <span className={`text-xs ${charCount > 0 ? 'text-gray-500 dark:text-gray-400' : 'text-transparent'}`}>
              {charCount} characters
            </span>
          </div>
          <div className="relative">
            <textarea
              id="proposal"
              rows={8}
              className="w-full p-4 border dark:bg-gray-800 dark:border-gray-700 border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-colors custom-scrollbar"
              placeholder="Enter your governance proposal here..."
              value={proposal}
              onChange={handleChange}
              disabled={isLoading || submitLoading}
            />
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-lg">
                <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm p-4 rounded-lg max-w-md">
                  <div className="flex">
                    <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{error}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isLoading || !isWalletConnected || submitLoading}
            className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-white 
              ${isLoading || !isWalletConnected || submitLoading
                ? 'bg-indigo-400/70 dark:bg-indigo-600/30 cursor-not-allowed' 
                : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700'
              } transition-all duration-200 shadow-md hover:shadow-lg`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analyzing...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Analyze with AI
              </>
            )}
          </button>
          
          {analysis && (
            <button
              type="button"
              disabled={submitLoading || !isWalletConnected}
              onClick={handleSubmitToBlockchain}
              className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg font-medium text-white
                ${submitLoading || !isWalletConnected
                  ? 'bg-green-400/70 dark:bg-green-600/30 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600'
                } transition-all duration-200 shadow-md hover:shadow-lg`}
            >
              {submitLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  Submit to Blockchain
                </>
              )}
            </button>
          )}
        </div>
      </form>

      <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-medium">Try a sample proposal:</p>
        <div className="space-y-2">
          {sampleProposals.map((sample, index) => (
            <button
              key={index}
              onClick={() => loadSampleProposal(index)}
              disabled={isLoading || submitLoading}
              className="w-full text-left p-3 text-sm border border-gray-200 dark:border-gray-700 dark:bg-gray-800/40 dark:hover:bg-gray-800/80 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              {sample.length > 100 ? `${sample.substring(0, 100)}...` : sample}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 