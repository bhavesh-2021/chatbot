import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { useChatBotResponse } from './hooks';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const responseEndRef = useRef<HTMLDivElement | null>(null);

  const { response, isLoading, error, sendMessage } = useChatBotResponse();

  useEffect(() => {
    responseEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [response]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim() || isLoading) return;

    sendMessage(prompt);
    setPrompt('');
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="py-4 px-6 bg-white border-b shadow-sm">
        <h1 className="text-xl font-bold text-gray-800">AI Assistant</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <div className="max-w-3xl mx-auto space-y-6">
          {(response || isLoading || error) ? (
            <div className="flex flex-col space-y-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {error ? 'Error' : 'AI Response'}
              </span>
              <div className={`bg-white border rounded-2xl p-6 shadow-sm ${error ? 'border-red-200 bg-red-50' : ''}`}>
                {error ? (
                  <p className="text-red-600">{error}</p>
                ) : (
                  <article className="prose prose-slate max-w-none">
                    <ReactMarkdown>{response}</ReactMarkdown>
                    {isLoading && (
                      <span className="inline-block w-2 h-5 ml-1 bg-blue-500 animate-pulse align-middle" />
                    )}
                  </article>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center mt-20 text-gray-400">
              <p className="text-lg font-light">Enter a prompt to start the conversation.</p>
            </div>
          )}
          <div ref={responseEndRef} />
        </div>
      </main>

      <footer className="p-4 bg-white border-t">
        <form onSubmit={handleSubmit} className="max-w-3xl mx-auto relative">
          <input
            className="w-full p-4 pr-16 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="absolute right-2 top-2 bottom-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </form>
      </footer>
    </div>
  );
};

export default App;
