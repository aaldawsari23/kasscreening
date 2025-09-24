
import React, { useState, useEffect, useMemo } from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { Exercise, SelectedExercise } from '../../types/index';

interface ExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (exercises: SelectedExercise[]) => void;
    // Fix: Allow readonly array for allExercises prop to match state type.
    allExercises: readonly Exercise[];
    // Fix: Allow readonly array for initialSelection prop to match state type.
    initialSelection: readonly SelectedExercise[];
}

const ExerciseModal: React.FC<ExerciseModalProps> = ({ isOpen, onClose, onConfirm, allExercises, initialSelection }) => {
    // Fix: Initialize state with a mutable copy of the readonly `initialSelection` prop to prevent type errors.
    const [selected, setSelected] = useState<SelectedExercise[]>([...initialSelection]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [region, setRegion] = useState('');

    useEffect(() => {
        if(isOpen) {
            // Fix: Create a mutable copy of the `initialSelection` prop when resetting state.
            setSelected([...initialSelection]);
        }
    }, [isOpen, initialSelection]);

    const filteredExercises = useMemo(() => {
        return allExercises.filter(ex => 
            (ex.name.toLowerCase().includes(search.toLowerCase())) &&
            (!category || ex.category === category) &&
            (!region || ex.region.includes(region))
        );
    }, [allExercises, search, category, region]);
    
    const uniqueCategories = useMemo(() => [...new Set(allExercises.map(ex => ex.category))], [allExercises]);
    const uniqueRegions = useMemo(() => [...new Set(allExercises.flatMap(ex => ex.region))], [allExercises]);

    const handleToggle = (exercise: Exercise) => {
        setSelected(prev => {
            const isSelected = prev.some(s => s.id === exercise.id);
            if (isSelected) {
                return prev.filter(s => s.id !== exercise.id);
            } else {
                return [...prev, { id: exercise.id, name: exercise.name, sets: '3', reps: '10', hold: '' }];
            }
        });
    };

    const handleParamChange = (id: string, param: keyof SelectedExercise, value: string) => {
        setSelected(prev => prev.map(ex => ex.id === id ? { ...ex, [param]: value } : ex));
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
                    <h2 className="text-xl font-semibold">Exercise Selector</h2>
                    <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-slate-800">&times;</button>
                </div>
                <div className="modal-body p-4 grid md:grid-cols-2 gap-4 overflow-y-auto">
                    {/* Filters and List */}
                    <div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
                            <input type="text" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="w-full p-2 border rounded-md text-sm" />
                            <select value={category} onChange={e => setCategory(e.target.value)} className="w-full p-2 border rounded-md text-sm"><option value="">All Categories</option>{uniqueCategories.map(c=><option key={c} value={c}>{c}</option>)}</select>
                            <select value={region} onChange={e => setRegion(e.target.value)} className="w-full p-2 border rounded-md text-sm"><option value="">All Regions</option>{uniqueRegions.map(r=><option key={r} value={r}>{r}</option>)}</select>
                        </div>
                        <div className="space-y-2 max-h-96 overflow-y-auto modal-scroll pr-2">
                           {filteredExercises.map(ex => {
                                const isSelected = selected.some(s => s.id === ex.id);
                                return (
                                    <div key={ex.id} className={`p-2 border rounded-md flex justify-between items-center ${isSelected ? 'bg-blue-50' : ''}`}>
                                        <div>
                                            <p className="font-medium text-sm">{ex.name}</p>
                                            <p className="text-xs text-slate-500">{ex.category} - {ex.region.join(', ')}</p>
                                        </div>
                                        <button onClick={() => handleToggle(ex)} className={`px-3 py-1 text-xs rounded-md ${isSelected ? 'bg-red-500 text-white' : 'bg-slate-200'}`}>
                                            {isSelected ? 'Remove' : 'Add'}
                                        </button>
                                    </div>
                                );
                           })}
                        </div>
                    </div>
                    {/* Selected Items */}
                    <div className="bg-slate-50 p-3 rounded-lg">
                         <h3 className="font-semibold mb-2">Selected Exercises ({selected.length})</h3>
                         <div className="space-y-2 max-h-[28rem] overflow-y-auto modal-scroll pr-2">
                             {selected.map(ex => (
                                 <div key={ex.id} className="p-2 border bg-white rounded-md">
                                     <p className="font-medium text-sm mb-2">{ex.name}</p>
                                     <div className="grid grid-cols-3 gap-2">
                                         <input type="text" placeholder="Sets" value={ex.sets} onChange={e => handleParamChange(ex.id, 'sets', e.target.value)} className="w-full p-1 border rounded-md text-xs" />
                                         <input type="text" placeholder="Reps" value={ex.reps} onChange={e => handleParamChange(ex.id, 'reps', e.target.value)} className="w-full p-1 border rounded-md text-xs" />
                                         <input type="text" placeholder="Hold" value={ex.hold} onChange={e => handleParamChange(ex.id, 'hold', e.target.value)} className="w-full p-1 border rounded-md text-xs" />
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

export default ExerciseModal;