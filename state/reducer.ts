
import { initialFormData, initialProgressNoteData } from '../data/initialState';
// Fix: Corrected type import path from '../types' to '../types/index' to resolve module ambiguity.
import type { FormData, ProgressNoteData, DynamicRow, Protocol, SelectedExercise, SelectedModality } from '../types/index';
import { produce } from 'immer';

export interface AppState {
    formData: FormData;
    progressNoteData: ProgressNoteData;
}

export const initialState: AppState = {
    formData: initialFormData,
    progressNoteData: initialProgressNoteData,
};

type Action =
    | { type: 'UPDATE_FORM_FIELD'; payload: { name: string; value: string; inputType?: string; checked?: boolean } }
    | { type: 'UPDATE_DYNAMIC_ROW'; payload: { section: keyof FormData; field: string; index: number; key: string; value: string } }
    | { type: 'ADD_DYNAMIC_ROW'; payload: { section: keyof FormData; field: string; newRow: DynamicRow } }
    | { type: 'REMOVE_DYNAMIC_ROW'; payload: { section: keyof FormData; field: string; index: number } }
    | { type: 'UPDATE_PROGRESS_NOTE_OBJECTIVE'; payload: { key: 'exercises' | 'modalities'; data: any[] } }
    | { type: 'APPLY_PROTOCOL'; payload: { protocol: Protocol } }
    | { type: 'RESET_FORMS' };


export const appReducer = produce((draft: AppState, action: Action) => {
    switch (action.type) {
        case 'UPDATE_FORM_FIELD': {
            const { name, value, inputType, checked } = action.payload;
            const [section, field] = name.split('.');

            const isFormDataField = Object.keys(draft.formData).includes(section);
            const targetForm = isFormDataField ? draft.formData : draft.progressNoteData;

            if (inputType === 'checkbox') {
                // Fix: The original logic was buggy for new arrays and incompatible with readonly types.
                // This ensures the array exists on the draft, then safely adds/removes items.
                if (!targetForm[section][field]) {
                    targetForm[section][field] = [];
                }
                const fieldArray = targetForm[section][field] as string[];

                if (checked) {
                    if (!fieldArray.includes(value)) {
                        fieldArray.push(value);
                    }
                } else {
                    targetForm[section][field] = fieldArray.filter((v: string) => v !== value);
                }
            } else {
                targetForm[section][field] = value;
            }
            break;
        }

        case 'UPDATE_DYNAMIC_ROW': {
            const { section, field, index, key, value } = action.payload;
            (draft.formData[section][field] as DynamicRow[])[index][key] = value;
            break;
        }

        case 'ADD_DYNAMIC_ROW': {
            const { section, field, newRow } = action.payload;
            (draft.formData[section][field] as DynamicRow[]).push(newRow);
            break;
        }

        case 'REMOVE_DYNAMIC_ROW': {
            const { section, field, index } = action.payload;
            (draft.formData[section][field] as DynamicRow[]).splice(index, 1);
            break;
        }

        case 'UPDATE_PROGRESS_NOTE_OBJECTIVE': {
            const { key, data } = action.payload;
            draft.progressNoteData.objective[key] = data;
            break;
        }

        case 'APPLY_PROTOCOL': {
            const { protocol } = action.payload;
            if (!protocol.phases || protocol.phases.length === 0) {
                break;
            }
            const firstPhase = protocol.phases[0];
            
            // Update Assessment & Plan
            draft.formData.assessment.diagnosis = protocol.title;
            draft.formData.assessment.treatmentGoals = [...(firstPhase.goals || [])];
            draft.formData.plan.exercises = firstPhase.exercises.map(ex => ex.name);

            // Update Progress Note
            const selectedExercises: SelectedExercise[] = firstPhase.exercises.map(ex => ({
                id: ex.id,
                name: ex.name,
                sets: ex.sets || '3',
                reps: ex.reps || '10',
                hold: ex.hold || '',
                notes: ex.notes || ''
            }));
            draft.progressNoteData.objective.exercises = selectedExercises;
            break;
        }

        case 'RESET_FORMS': {
            return initialState;
        }

        default:
            break;
    }
});