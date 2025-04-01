import { useState, useEffect } from 'react';
import Head from 'next/head';
import Script from 'next/script';
import WalletConnect from '../components/WalletConnect';
import ProposalForm from '../components/ProposalForm';
import ProposalAnalysis from '../components/ProposalAnalysis';
import ProposalsList from '../components/ProposalsList';

export default function Home() {
  const [wallet, setWallet] = useState(null);
  const [proposal, setProposal] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'list'
  const [refreshProposals, setRefreshProposals] = useState(0);

  const analyzeProposal = async (proposalText) => {
    setLoading(true);
    try {
      // Use real OpenAI API endpoint instead of mock
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ proposal: proposalText }),
      });
      
      const data = await response.json();
      
      // If there's an error but fallback data is available, use that
      if (data.error && data.fallback) {
        console.log('Using fallback analysis data due to API error:', data.error);
        setAnalysis(data.fallback);
        
        // Also store the fallback analysis in window for access by ProposalForm
        if (typeof window !== 'undefined') {
          window.latestAnalysis = data.fallback;
        }
        return;
      }
      
      // Handle error case without fallback
      if (data.error) {
        console.error('Error from analysis API:', data.error);
        alert(`Error analyzing proposal: ${data.error}`);
        setLoading(false);
        return;
      }
      
      setAnalysis(data);
      
      // Also store the analysis in window for access by ProposalForm
      if (typeof window !== 'undefined') {
        window.latestAnalysis = data;
      }
    } catch (error) {
      console.error('Error analyzing proposal:', error);
      alert('Failed to analyze proposal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update refresh trigger whenever a proposal is submitted to blockchain
  useEffect(() => {
    const handleProposalSubmitted = () => {
      setRefreshProposals(prev => prev + 1);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('proposal:submitted', handleProposalSubmitted);
      return () => {
        window.removeEventListener('proposal:submitted', handleProposalSubmitted);
      };
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Head>
        <title>VoteVision - AI-Powered Governance Analysis</title>
        <meta name="description" content="Make informed DAO governance decisions with AI-powered proposal analysis" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto+Mono&display=swap" rel="stylesheet" />
      </Head>
      <Script 
          src="https://cdn.jsdelivr.net/npm/buffer@6.0.3/index.min.js" 
          strategy="afterInteractive"
        />

      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-r from-indigo-600 to-purple-600 transform -skew-y-3 origin-top-left -z-10"></div>

      <header className="relative z-10 w-full py-4 px-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-white shadow-md mr-3">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 text-transparent bg-clip-text">Vote Vision</span>
            </div>
          </div>
          <WalletConnect onConnect={setWallet} />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        <div className="text-center mb-8 pt-10">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-3">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
              AI-Powered Governance Analysis
            </span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Make more informed DAO decisions with advanced AI insights and on-chain voting
          </p>
        </div>

        <div className="mb-8 flex justify-center">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-1 inline-flex">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors
                ${activeTab === 'create' 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              Create Proposal
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`px-6 py-2 text-sm font-medium rounded-md transition-colors
                ${activeTab === 'list' 
                  ? 'bg-indigo-500 text-white' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
            >
              View Proposals
            </button>
          </div>
        </div>

        {activeTab === 'create' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden h-full">
              <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-500 h-full">
                <div className="bg-white dark:bg-gray-800 p-6 h-full">
                  <ProposalForm 
                    proposal={proposal} 
                    setProposal={setProposal} 
                    onAnalyze={analyzeProposal}
                    isWalletConnected={!!wallet}
                    isLoading={loading}
                    wallet={wallet}
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden h-full">
              <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-500 h-full">
                <div className="bg-white dark:bg-gray-800 p-6 h-full">
                  <ProposalAnalysis analysis={analysis} isLoading={loading} />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden mb-16">
            <div className="p-1 bg-gradient-to-r from-indigo-500 to-purple-500">
              <div className="bg-white dark:bg-gray-800 p-6">
                <ProposalsList wallet={wallet} refreshTrigger={refreshProposals} />
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="w-full bg-gray-50 dark:bg-gray-900 py-8 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-2">
            Built for Bountython by Superteam Malaysia
          </p>
          <div className="flex space-x-2 items-center">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-indigo-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.39-.444.898-.608 1.297a19.82 19.82 0 0 0-5.582 0c-.164-.4-.397-.908-.608-1.297a.077.077 0 0 0-.079-.036c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026c.462-.62.874-1.272 1.226-1.96.021-.04.001-.088-.041-.104a13.26 13.26 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.34 1.225 1.96a.076.076 0 0 0 .084.025 19.964 19.964 0 0 0 6.002-2.98.076.076 0 0 0 .32-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
              </svg>
            </div>
            <div className="w-6 h-6 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
            </div>
            <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
              <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
