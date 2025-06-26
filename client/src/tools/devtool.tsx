import React, { useState } from 'react';
import { toolRegistry } from './registry'; // 👈 update path if needed

export default function DevToolsPage() {
  const toolNames = Object.keys(toolRegistry);
  const [selectedTool, setSelectedTool] = useState<string>(toolNames[0]);
  const [inputs, setInputs] = useState<Record<string, any>>({});
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const definition = toolRegistry[selectedTool]?.definition;
  const handler = toolRegistry[selectedTool]?.handler;
  const paramFields = definition?.parameters?.properties ?? {};

  const runTool = async () => {
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      const response = await handler.execute(inputs);
      setResult(response);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (key: string, value: any) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-zinc-600 to-purple-600 bg-clip-text text-transparent mb-2">
             Tool Testing Panel
          </h1>
          <p className="text-slate-600">Test and debug your tools with an intuitive interface</p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          {/* Tool Selector Section */}
          <div className="bg-gradient-to-r from-slate-50 to-blue-50 p-6 border-b border-slate-200">
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                Select Tool
              </label>
              <select
                value={selectedTool}
                onChange={(e) => {
                  setSelectedTool(e.target.value);
                  setInputs({}); // reset input values
                  setResult(null);
                  setError(null);
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-white shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700 font-medium"
              >
                {toolNames.map(name => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dynamic Input Fields */}
          <div className="p-6 space-y-6">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              Parameters
            </h3>
            
            {Object.keys(paramFields).length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <div className="text-4xl mb-2">📝</div>
                <p>No parameters required for this tool</p>
              </div>
            ) : (
              <div className="grid gap-6">
                {Object.entries(paramFields).map(([key, config]) => (
                  <div key={key} className="space-y-2">
                    <label className="block text-sm font-semibold text-slate-700">
                      {key}
                      {definition.parameters?.required?.includes(key) && (
                        <span className="text-red-500 ml-1">*</span>
                      )}
                    </label>
                    <div className="relative">
                      <input
                        type={config.type === 'number' ? 'number' : 'text'}
                        value={inputs[key] ?? ''}
                        onChange={(e) =>
                          handleInputChange(
                            key,
                            config.type === 'number' ? Number(e.target.value) : e.target.value
                          )
                        }
                        placeholder={config.description || `Enter ${key}...`}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-700"
                      />
                      {config.type === 'number' && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 text-xs">
                          NUM
                        </div>
                      )}
                    </div>
                    {config.description && (
                      <p className="text-xs text-slate-500 mt-1">{config.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Execute Button */}
            <div className="pt-4">
              <button
                onClick={runTool}
                disabled={loading}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-white transition-all duration-200 transform ${
                  loading 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 hover:scale-[1.02] shadow-lg hover:shadow-xl'
                }`}
              >
                {loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Running...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <span>check</span>
                    Run "{selectedTool}"
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          {(error || result) && (
            <div className="border-t border-slate-200 p-6 bg-slate-50">
              <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                Results
              </h3>
              
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-2 text-red-700">
                    <span className="text-lg">❌</span>
                    <span className="font-medium">Error</span>
                  </div>
                  <p className="text-red-600 mt-2 font-mono text-sm">{error}</p>
                </div>
              )}
              
              {result && (
                <div className="bg-green-50 border border-green-200 rounded-xl overflow-hidden">
                  <div className="bg-green-100 px-4 py-2 border-b border-green-200">
                    <div className="flex items-center gap-2 text-green-700">
                      <span className="text-lg">✅</span>
                      <span className="font-medium">Success</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-900 text-green-400 font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-slate-500 text-sm">
          <p>Built with React & Tailwind CSS</p>
        </div>
      </div>
    </div>
  );
}