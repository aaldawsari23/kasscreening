
import React, { useState } from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { ProgressNoteData, SelectedExercise, SelectedModality } from '../../types/index';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import ExerciseModal from '../modals/ExerciseModal';
import ModalitiesModal from '../modals/ModalitiesModal';
import { DB } from '../../data/database';

interface ProgressNoteFormProps {
    data: ProgressNoteData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onExercisesUpdate: (exercises: SelectedExercise[]) => void;
    onModalitiesUpdate: (modalities: SelectedModality[]) => void;
}

const ProgressNoteForm: React.FC<ProgressNoteFormProps> = ({ data, onChange, onExercisesUpdate, onModalitiesUpdate }) => {
    const [isExerciseModalOpen, setExerciseModalOpen] = useState(false);
    const [isModalitiesModalOpen, setModalitiesModalOpen] = useState(false);

    return (
        <div className="space-y-6">
            <div className="bg-slate-100 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                    <h3 className="font-bold flex items-center text-slate-800">
                        <i className="fas fa-calendar-check text-orange-500 mr-2"></i>
                        Session Information
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-600">Session #</span>
                        <input 
                          type="number" 
                          name="session.number"
                          value={data.session.number} 
                          onChange={onChange}
                          className="w-16 px-2 py-1 border-2 border-slate-200 rounded-lg text-center font-bold bg-white" 
                        />
                    </div>
                </div>
            </div>

            <fieldset>
                 <legend className="font-semibold text-slate-800 mb-2">Patient Reported (Subjective)</legend>
                 <div className="space-y-4 pl-6">
                     <Input label="Patient Statement" name="subjective.patientStatement" value={data.subjective.patientStatement} onChange={onChange} />
                 </div>
            </fieldset>

            <fieldset>
                 <legend className="font-semibold text-slate-800 mb-2">What Was Done (Objective)</legend>
                 <div className="space-y-4 pl-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <button type="button" onClick={() => setExerciseModalOpen(true)} className="group bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                            <i className="fas fa-dumbbell"></i>
                            <span className="font-medium">Add Exercises</span>
                        </button>
                        <button type="button" onClick={() => setModalitiesModalOpen(true)} className="group bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2">
                            <i className="fas fa-bolt"></i>
                            <span className="font-medium">Add Modalities</span>
                        </button>
                    </div>
                    {data.objective.exercises.length > 0 && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                            <h4 className="font-semibold text-sm text-slate-800 mb-2">Selected Exercises:</h4>
                            <ul className="list-disc pl-5 text-sm">
                                {data.objective.exercises.map(ex => <li key={ex.id}>{ex.name} ({ex.sets}x{ex.reps})</li>)}
                            </ul>
                        </div>
                    )}
                     {data.objective.modalities.length > 0 && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <h4 className="font-semibold text-sm text-slate-800 mb-2">Selected Modalities:</h4>
                            <ul className="list-disc pl-5 text-sm">
                                {data.objective.modalities.map(mod => <li key={mod.name}>{mod.name} ({mod.duration} mins)</li>)}
                            </ul>
                        </div>
                    )}
                 </div>
            </fieldset>

            <Textarea label="Therapist Assessment" name="assessment.clinicalObservations" value={data.assessment.clinicalObservations} onChange={onChange} rows={3} />
            <Textarea label="Plan for Next Session" name="plan.additionalNotes" value={data.plan.additionalNotes} onChange={onChange} rows={3} />
            
            <ExerciseModal 
                isOpen={isExerciseModalOpen} 
                onClose={() => setExerciseModalOpen(false)} 
                onConfirm={onExercisesUpdate}
                allExercises={DB.exercises}
                initialSelection={data.objective.exercises}
            />
            <ModalitiesModal
                isOpen={isModalitiesModalOpen}
                onClose={() => setModalitiesModalOpen(false)}
                onConfirm={onModalitiesUpdate}
                allModalities={DB.modalities}
                initialSelection={data.objective.modalities}
            />
        </div>
    );
};

export default ProgressNoteForm;