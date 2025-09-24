
import React, { useState, useEffect, useMemo } from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { Modality, SelectedModality } from '../../types/index';

interface ModalitiesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (modalities: SelectedModality[]) => void;
    // Fix: Allow readonly array for allModalities prop to match state type.
    allModalities: readonly Modality[];
    // Fix: Allow readonly array for initialSelection prop to match state type.
    initialSelection: readonly SelectedModality[];
}

const ModalitiesModal: React.FC<ModalitiesModalProps> = ({ isOpen, onClose, onConfirm, allModalities, initialSelection }) => {
    // Fix: Initialize state with a mutable copy of the readonly `initialSelection` prop and remove unsafe type cast.
    const [selected, setSelected] = useState<SelectedModality[]>([...initialSelection]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        if(isOpen) {
            // Fix: Create a mutable copy of the `initialSelection` prop when resetting state and remove unsafe type cast.
            setSelected([...initialSelection]);
        }
    }, [isOpen, initialSelection]);

    const filteredModalities = useMemo(() => {
        return allModalities.filter(mod => 
            mod.device.toLowerCase().includes(search.toLowerCase())
        );
    }, [allModalities, search]);

    const handleToggle = (modality: Modality) => {
        setSelected(prev => {
            const isSelected = prev.some(s => s.name === modality.device);
            if (isSelected) {
                return prev.filter(s => s.name !== modality.device);
            } else {
                return [...prev, { name: modality.device, duration: String(modality.time), intensity: modality.intensity, site: modality.site }];
            }
        });
    };

    const handleParamChange = (name: string, param: keyof SelectedModality, value: string) => {
        setSelected(prev => prev.map(mod => mod.name === name ? { ...mod, [param]: value } : mod));
    };

    const handleConfirm = () => {
        onConfirm(selected);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
                <div className="modal-header p-4 border-b">
                    <h2 className="text-xl font-semibold">Modalities Selector</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">&times;</button>
                </div>
                <div className="modal-body p-4 grid md:grid-cols-2 gap-4 overflow-y-auto">
                    {/* Filters and List */}
                    <div>
                         <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-2 border rounded-md text-sm mb-4" />
                         <div className="space-y-2 max-h-96 overflow-y-auto modal-scroll pr-2">
                           {filteredModalities.map(mod => {
                                const isSelected = selected.some(s => s.name === mod.device);
                                return (
                                    <div key={mod.device} className={`p-2 border rounded-md flex justify-between items-center ${isSelected ? 'bg-blue-50' : ''}`}>
                                        <p className="font-medium text-sm">{mod.device}</p>
                                        <button onClick={() => handleToggle(mod)} className={`px-3 py-1 text-xs rounded-md ${isSelected ? 'bg-red-500 text-white' : 'bg-slate-200'}`}>
                                            {isSelected ? 'Remove' : 'Add'}
                                        </button>
                                    </div>
                                );
                           })}
                        </div>
                    </div>
                     {/* Selected Items */}
                    <div className="bg-slate-50 p-3 rounded-lg">
                         <h3 className="font-semibold mb-2">Selected Modalities ({selected.length})</h3>
                         <div className="space-y-2 max-h-[28rem] overflow-y-auto modal-scroll pr-2">
                             {selected.map(mod => (
                                 <div key={mod.name} className="p-2 border bg-white rounded-md">
                                     <p className="font-medium text-sm mb-2">{mod.name}</p>
                                     <div className="grid grid-cols-3 gap-2">
                                         <input type="text" placeholder="Duration" value={mod.duration} onChange={e => handleParamChange(mod.name, 'duration', e.target.value)} className="w-full p-1 border rounded-md text-xs" />
                                         <input type="text" placeholder="Intensity" value={mod.intensity} onChange={e => handleParamChange(mod.name, 'intensity', e.target.value)} className="w-full p-1 border rounded-md text-xs" />
                                         <input type="text" placeholder="Site" value={mod.site} onChange={e => handleParamChange(mod.name, 'site', e.target.value)} className="w-full p-1 border rounded-md text-xs" />
                                     </div>
                                 </div>
                             ))}
                         </div>
                    </div>
                </div>
                 <div className="modal-footer p-4 border-t flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 rounded-md text-sm">Cancel</button>
                    <button onClick={handleConfirm} className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm">Add Selected</button>
                </div>
            </div>
        </div>
    );
};

export default ModalitiesModal;