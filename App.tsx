
import React, { useReducer, useCallback, useMemo } from 'react';
import { appReducer, initialState } from './state/reducer';
// Fix: Corrected type import path from './types' to './types/index' to resolve module ambiguity.
import type { ReportTab, AccordionSectionName, Protocol, SelectedExercise, SelectedModality, DynamicRow } from './types/index';
import { generateAssessmentReport, generateProgressReport } from './services/reportService';
import { summarizeReport } from './services/geminiService';
import SubjectiveForm from './components/forms/SubjectiveForm';
import ObjectiveForm from './components/forms/ObjectiveForm';
import AssessmentForm from './components/forms/AssessmentForm';
import PlanForm from './components/forms/PlanForm';
import ProgressNoteForm from './components/forms/ProgressNoteForm';
import NarrativePanel from './components/layout/NarrativePanel';
import AccordionSection from './components/layout/AccordionSection';

const App: React.FC = () => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const { formData, progressNoteData } = state;

    const [activeAccordion, setActiveAccordion] = React.useState<AccordionSectionName | null>('subjective');
    const [activeReportTab, setActiveReportTab] = React.useState<ReportTab>('assessment');

    const handleFormChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        dispatch({
            type: 'UPDATE_FORM_FIELD',
            payload: {
                name: e.target.name,
                value: e.target.value,
                inputType: e.target.type,
                checked: (e.target as HTMLInputElement).checked
            }
        });
    }, []);

    const handleDynamicRowChange = useCallback((section: keyof typeof formData, field: string, index: number, key: string, value: string) => {
        dispatch({ type: 'UPDATE_DYNAMIC_ROW', payload: { section, field, index, key, value } });
    }, []);

    const addDynamicRow = useCallback((section: keyof typeof formData, field: string, newRow: DynamicRow) => {
        dispatch({ type: 'ADD_DYNAMIC_ROW', payload: { section, field, newRow } });
    }, []);

    const removeDynamicRow = useCallback((section: keyof typeof formData, field: string, index: number) => {
        dispatch({ type: 'REMOVE_DYNAMIC_ROW', payload: { section, field, index } });
    }, []);

    const handleExercisesUpdate = useCallback((exercises: SelectedExercise[]) => {
        dispatch({ type: 'UPDATE_PROGRESS_NOTE_OBJECTIVE', payload: { key: 'exercises', data: exercises } });
    }, []);

    const handleModalitiesUpdate = useCallback((modalities: SelectedModality[]) => {
        dispatch({ type: 'UPDATE_PROGRESS_NOTE_OBJECTIVE', payload: { key: 'modalities', data: modalities } });
    }, []);

    const handleProtocolSelect = useCallback((protocol: Protocol) => {
        dispatch({ type: 'APPLY_PROTOCOL', payload: { protocol } });
        setActiveAccordion('plan');
        setActiveReportTab('assessment');
    }, []);

    const handleReset = useCallback(() => {
        if (window.confirm('Are you sure you want to reset the entire form? This action cannot be undone.')) {
            dispatch({ type: 'RESET_FORMS' });
        }
    }, []);

    const handleAccordionToggle = (section: AccordionSectionName) => {
        setActiveAccordion(prev => (prev === section ? null : section));
        if (section === 'progressNote') {
            setActiveReportTab('progress');
        } else if (['subjective', 'objective', 'assessment', 'plan'].includes(section)) {
            setActiveReportTab('assessment');
        }
    };

    const report = useMemo(() => {
        if (activeReportTab === 'assessment') {
            return generateAssessmentReport(formData);
        }
        return generateProgressReport(progressNoteData);
    }, [formData, progressNoteData, activeReportTab]);

    return (
        <div className="main-layout grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-screen-2xl mx-auto p-4 md:p-6">
            <div className="w-full">
                <div className="banner-container no-print mb-8 rounded-xl overflow-hidden shadow-lg border-2 border-slate-200">
                    <img src="https://picsum.photos/1600/400?image=24" alt="Professional Physiotherapy Assessment Banner" className="w-full h-auto block min-h-[120px] max-h-[180px] object-cover" />
                </div>

                <form className="space-y-4 md:space-y-6">
                    <AccordionSection title="Subjective Assessment" subtitle="Patient's reported symptoms and history" icon="S" sectionName="subjective" isOpen={activeAccordion === 'subjective'} onToggle={handleAccordionToggle} data={formData.subjective}>
                        <SubjectiveForm data={formData.subjective} onChange={handleFormChange} />
                    </AccordionSection>
                    <AccordionSection title="Objective Assessment" subtitle="Clinical observations and measurements" icon="O" sectionName="objective" isOpen={activeAccordion === 'objective'} onToggle={handleAccordionToggle} data={formData.objective}>
                        <ObjectiveForm
                            data={formData.objective}
                            onRowChange={handleDynamicRowChange}
                            onAddRow={addDynamicRow}
                            onRemoveRow={removeDynamicRow}
                            onChange={handleFormChange}
                        />
                    </AccordionSection>
                    <AccordionSection title="Assessment" subtitle="Clinical diagnosis and problem identification" icon="A" sectionName="assessment" isOpen={activeAccordion === 'assessment'} onToggle={handleAccordionToggle} data={formData.assessment}>
                        <AssessmentForm data={formData.assessment} onChange={handleFormChange} />
                    </AccordionSection>
                    <AccordionSection title="Plan" subtitle="Treatment interventions and schedule" icon="P" sectionName="plan" isOpen={activeAccordion === 'plan'} onToggle={handleAccordionToggle} data={formData.plan}>
                        <PlanForm
                            data={formData.plan}
                            onChange={handleFormChange}
                            onProtocolSelect={handleProtocolSelect}
                        />
                    </AccordionSection>
                    <AccordionSection title="Progress Note Documentation" subtitle="Individual session records" icon="PN" sectionName="progressNote" isOpen={activeAccordion === 'progressNote'} onToggle={handleAccordionToggle} data={progressNoteData.subjective}>
                        <ProgressNoteForm
                            data={progressNoteData}
                            onChange={handleFormChange}
                            onExercisesUpdate={handleExercisesUpdate}
                            onModalitiesUpdate={handleModalitiesUpdate}
                        />
                    </AccordionSection>
                </form>
            </div>
            <div className="w-full">
                <NarrativePanel
                    report={report}
                    activeTab={activeReportTab}
                    onTabChange={setActiveReportTab}
                    onReset={handleReset}
                    summarizeReport={summarizeReport}
                />
            </div>
        </div>
    );
};

export default App;