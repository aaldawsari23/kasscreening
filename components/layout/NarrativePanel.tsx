
import React, { useState } from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { ReportTab } from '../../types/index';

interface NarrativePanelProps {
    report: string;
    activeTab: ReportTab;
    onTabChange: (tab: ReportTab) => void;
    onReset: () => void;
    summarizeReport: (reportText: string) => Promise<string>;
}

const NarrativePanel: React.FC<NarrativePanelProps> = ({ report, activeTab, onTabChange, onReset, summarizeReport }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isLoadingSummary, setIsLoadingSummary] = useState(false);
    const [summary, setSummary] = useState('');
    const reportRef = React.useRef<HTMLDivElement>(null);

    const handleCopy = () => {
        if (reportRef.current) {
            navigator.clipboard.writeText(reportRef.current.innerText);
            alert('Report copied to clipboard!');
        }
    };

    const handleGenerateSummary = async () => {
        if (!reportRef.current?.innerText) return;
        setIsLoadingSummary(true);
        setSummary('');
        try {
            const result = await summarizeReport(reportRef.current.innerText);
            setSummary(result);
        } catch (error) {
            console.error(error);
            setSummary('Failed to generate summary.');
        } finally {
            setIsLoadingSummary(false);
        }
    };
    
    return (
        <div className="narrative-panel sticky top-6 bg-slate-50/80 backdrop-blur-lg border border-slate-200 rounded-xl shadow-lg h-[calc(100vh-3rem)] flex flex-col">
            <div className="narrative-header p-4 border-b border-slate-200">
                <h2 className="text-xl font-bold flex items-center gap-3 text-slate-800">
                    <i className="fas fa-file-invoice text-blue-500"></i>
                    Live Report
                </h2>
            </div>
            <div className="report-tabs flex border-b border-slate-200">
                <button 
                    className={`report-tab flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${activeTab === 'assessment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                    onClick={() => onTabChange('assessment')}
                >
                    SOAP ASSESSMENT
                </button>
                <button 
                    className={`report-tab flex-1 py-3 text-sm font-semibold transition-colors duration-200 ${activeTab === 'progress' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-slate-500 hover:bg-slate-100'}`}
                    onClick={() => onTabChange('progress')}
                >
                    PROGRESS NOTE
                </button>
            </div>
            <div 
                ref={reportRef}
                className="flex-1 overflow-y-auto p-4 modal-scroll text-sm leading-relaxed whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: report || `<div class="text-slate-500 text-center py-8"><i class="fas fa-file-alt text-4xl mb-3 opacity-50"></i><p>Start filling the forms to see the live preview...</p></div>` }}
                contentEditable={isEditing}
                style={{ border: isEditing ? '2px solid #3b82f6' : 'none' }}
            />
            {summary && (
                <div className="p-4 border-t border-slate-200 bg-blue-50">
                    <h4 className="font-bold text-sm text-blue-800 mb-2">Gemini Summary:</h4>
                    <p className="text-xs text-slate-700">{summary}</p>
                </div>
            )}
             <div className="flex items-center justify-between p-3 border-t bg-slate-100 rounded-b-xl flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsEditing(!isEditing)} className="btn bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs md:text-sm px-3 py-2 rounded-md shadow-sm">
                        <i className={`fas ${isEditing ? 'fa-check' : 'fa-edit'} mr-2`}></i>{isEditing ? 'Save' : 'Edit'}
                    </button>
                     <button onClick={handleGenerateSummary} disabled={isLoadingSummary} className="btn bg-purple-500 hover:bg-purple-600 text-white text-xs md:text-sm px-3 py-2 rounded-md shadow-sm disabled:opacity-50">
                        {isLoadingSummary ? <i className="fas fa-spinner fa-spin mr-2"></i> : <i className="fas fa-wand-magic-sparkles mr-2"></i>}
                        {isLoadingSummary ? 'Summarizing...' : 'Summarize'}
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleCopy} className="btn bg-white hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs md:text-sm px-3 py-2 rounded-md shadow-sm">
                        <i className="fas fa-copy mr-2"></i>Copy
                    </button>
                    <button onClick={onReset} className="btn bg-red-500 hover:bg-red-600 text-white text-xs md:text-sm px-3 py-2 rounded-md shadow-sm">
                        <i className="fas fa-undo-alt mr-2"></i>Reset
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NarrativePanel;