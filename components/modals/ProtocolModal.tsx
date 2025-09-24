
import React from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { Protocol } from '../../types/index';

interface ProtocolModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (protocol: Protocol) => void;
    // Fix: Allow readonly array for protocols prop to match state type.
    protocols: readonly Protocol[];
}

const ProtocolModal: React.FC<ProtocolModalProps> = ({ isOpen, onClose, onSelect, protocols }) => {
    if (!isOpen) return null;

    const handleSelectProtocol = (protocol: Protocol) => {
        if (window.confirm(`Are you sure you want to apply the "${protocol.title}" protocol? This will overwrite the current diagnosis, goals, and exercise plan.`)) {
            onSelect(protocol);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4 fade-in">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="modal-header p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <i className="fas fa-clipboard-list text-blue-500"></i>
                        Select a Treatment Protocol
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl leading-none">&times;</button>
                </div>
                <div className="modal-body p-4 overflow-y-auto modal-scroll">
                    <p className="text-sm text-slate-600 mb-4">Select a protocol to automatically populate the assessment and plan with common exercises and goals for the condition.</p>
                    <div className="space-y-3">
                        {protocols.map(protocol => (
                            <div key={protocol.id} className="protocol-card border border-slate-200 rounded-lg p-4 hover:bg-slate-50 hover:shadow-md transition-all">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{protocol.title}</h3>
                                        <p className="text-sm text-slate-500 mt-1">{protocol.description}</p>
                                    </div>
                                    <button
                                        onClick={() => handleSelectProtocol(protocol)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="modal-footer p-4 border-t flex justify-end">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md text-sm hover:bg-slate-300">
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProtocolModal;