import React, { useState, useEffect } from 'react';
import { analyzeScript } from './services/geminiService';
import { AnalysisResult, HistoryItem } from './types';
import ScoreGauge from './components/ScoreGauge';
import MetricCard from './components/MetricCard';
import ImprovementCard from './components/ImprovementCard';
import HistoryPanel from './components/HistoryPanel';
import HelpModal from './components/HelpModal';

// SVG Icons
const SparklesIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.75 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);
const SaveIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>;
const HookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" /></svg>;
const UserIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>;
const PainIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>;
const CtaIcon = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" /></svg>;
const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
  </svg>
);


export default function App() {
  const [scriptText, setScriptText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);

  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('robo-ai-history');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (error) {
      console.error("Failed to load history from localStorage", error);
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('robo-ai-history', JSON.stringify(history));
    } catch (error) {
      console.error("Failed to save history to localStorage", error);
    }
  }, [history]);

  const handleAnalyze = async () => {
    if (!scriptText.trim()) {
      setError("Please enter a sales script to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setIsSaving(false);

    try {
      const result = await analyzeScript(scriptText);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setScriptText(e.target.value);
    setAnalysisResult(null);
    setError(null);
    setIsSaving(false); // Cancel save if user edits script
  };

  const handleInitiateSave = () => {
    setIsSaving(true);
    setSaveTitle(`Script Analyzed on ${new Date().toLocaleDateString()}`);
  };

  const handleConfirmSave = () => {
      if (!analysisResult || !saveTitle.trim()) return;
      
      const newItem: HistoryItem = {
          id: Date.now().toString(),
          title: saveTitle.trim(),
          scriptText,
          analysis: analysisResult,
          timestamp: new Date().toISOString(),
      };
      setHistory([newItem, ...history]);
      
      setIsSaving(false);
      setSaveTitle('');
  };

  const handleCancelSave = () => {
      setIsSaving(false);
      setSaveTitle('');
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setScriptText(item.scriptText);
    setAnalysisResult(item.analysis);
    setError(null);
    setIsLoading(false);
    setIsSaving(false); // Ensure save mode is off when loading
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory(history.filter(item => item.id !== id));
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all history? This action cannot be undone.")) {
        setHistory([]);
    }
  };

  const isCurrentScriptSaved = history.some(item => 
    item.scriptText === scriptText && JSON.stringify(item.analysis) === JSON.stringify(analysisResult)
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="relative text-center mb-10">
          <div className="flex justify-center items-center gap-3">
            <SparklesIcon />
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-500">
              Robo AI - Sales Script Analyzer
            </h1>
          </div>
          <p className="mt-2 text-md sm:text-lg text-gray-400">Get Your Copy Score in 10 Seconds</p>
          <button
            onClick={() => setIsHelpModalOpen(true)}
            className="absolute top-0 right-0 p-2 text-gray-500 hover:text-cyan-400 transition-colors rounded-full hover:bg-gray-800"
            aria-label="Open help dialog"
          >
            <HelpIcon />
          </button>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-gray-800/50 rounded-xl p-6 shadow-2xl border border-gray-700 backdrop-blur-sm">
              <textarea
                value={scriptText}
                onChange={handleTextAreaChange}
                placeholder="Paste your sales script here..."
                rows={12}
                className="w-full bg-gray-900/70 border border-gray-600 rounded-lg p-4 text-gray-200 placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-200"
                disabled={isLoading}
              />
              <button
                onClick={handleAnalyze}
                disabled={isLoading}
                className="mt-4 w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:scale-100 shadow-lg shadow-cyan-900/50"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Analyzing...
                  </>
                ) : "Analyze Script"}
              </button>
              {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
            </div>

            {analysisResult && (
              <div className="animate-fade-in">
                {!isCurrentScriptSaved && (
                  <div className="mb-8">
                    {!isSaving ? (
                      <div className="text-center">
                        <button
                          onClick={handleInitiateSave}
                          className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg shadow-teal-900/50"
                        >
                          <SaveIcon /> Save Analysis to History
                        </button>
                      </div>
                    ) : (
                      <div className="bg-gray-800 rounded-lg p-4 max-w-md mx-auto space-y-3 border border-gray-700 animate-fade-in">
                        <label htmlFor="save-title" className="block text-sm font-medium text-gray-300">Enter a title to save:</label>
                        <input
                          type="text"
                          id="save-title"
                          value={saveTitle}
                          onChange={(e) => setSaveTitle(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && saveTitle.trim() && handleConfirmSave()}
                          className="w-full bg-gray-900/70 border border-gray-600 rounded-lg p-2 text-gray-200 focus:ring-1 focus:ring-cyan-500"
                          autoFocus
                        />
                        <div className="flex gap-3 justify-end">
                          <button onClick={handleCancelSave} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-1 px-4 rounded-lg transition-colors">
                            Cancel
                          </button>
                          <button 
                            onClick={handleConfirmSave} 
                            className="bg-cyan-600 hover:bg-cyan-500 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-1 px-4 rounded-lg transition-colors"
                            disabled={!saveTitle.trim()}
                          >
                            Confirm Save
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 bg-gray-800 rounded-xl p-6 flex items-center justify-center shadow-lg">
                    <ScoreGauge score={analysisResult.overallScore} />
                  </div>
                  <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 gap-6">
                    <MetricCard title="Hook Strength" value={analysisResult.hookStrength} icon={<HookIcon />} />
                    <MetricCard title="Pain Point Clarity" value={analysisResult.painPointClarity} icon={<PainIcon />} />
                    <MetricCard title="CTA Strength" value={analysisResult.ctaStrength} icon={<CtaIcon />} />
                    <MetricCard title="'You' Usage" value={analysisResult.youUsageCount} unit="" icon={<UserIcon />} maxValue={1} />
                  </div>
                </div>
                <div className="mt-10">
                  <h2 className="text-2xl font-bold mb-6 text-center text-gray-300">Actionable Improvements</h2>
                  <div className="space-y-6">
                    {analysisResult.improvements.map((imp, index) => (
                      <ImprovementCard key={index} improvement={imp} index={index} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            {!analysisResult && !isLoading && (
                <div className="text-center text-gray-500">
                  <div className="inline-block p-6 bg-gray-800/50 rounded-xl border border-gray-700">
                    <h3 className="text-lg font-semibold text-gray-400">Your analysis will appear here.</h3>
                    <p className="max-w-md mx-auto mt-2">Enter your sales script above and click "Analyze Script" to see your score and get actionable feedback.</p>
                  </div>
                </div>
              )}
          </div>
          <div className="lg:col-span-1">
            <HistoryPanel
                history={history}
                onSelectItem={handleSelectHistoryItem}
                onDeleteItem={handleDeleteHistoryItem}
                onClearHistory={handleClearHistory}
            />
          </div>
        </main>
      </div>
      <HelpModal isOpen={isHelpModalOpen} onClose={() => setIsHelpModalOpen(false)} />
    </div>
  );
}
