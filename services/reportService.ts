
// Fix: Corrected type import path from '../types' to '../types/index' to resolve module ambiguity.
import type { FormData, ProgressNoteData } from '../types/index';

// --- HELPER FUNCTIONS ---

/**
 * Joins an array of strings into a grammatically correct list.
 * e.g., ['A', 'B', 'C'] => "a, b, and c"
 */
// Fix: Allow readonly arrays to be passed to joinList to match state types.
const joinList = (items?: readonly string[], conjunction: 'and' | 'or' = 'and'): string => {
    const cleanedItems = items?.filter(Boolean).map(s => s.trim().toLowerCase());
    if (!cleanedItems || cleanedItems.length === 0) return '';
    
    const uniqueItems = [...new Set(cleanedItems)];
    if (uniqueItems.length === 1) return uniqueItems[0];
    if (uniqueItems.length === 2) return `${uniqueItems[0]} ${conjunction} ${uniqueItems[1]}`;
    
    const lastItem = uniqueItems[uniqueItems.length - 1];
    const otherItems = uniqueItems.slice(0, -1);
    return `${otherItems.join(', ')}, ${conjunction} ${lastItem}`;
};

/**
 * Creates a sentence from a prefix and a list of items, returning an empty string if items are absent.
 */
// Fix: Allow readonly arrays to be passed to formatSentence to match state types.
const formatSentence = (prefix: string, items?: readonly string[], suffix: string = '.'): string => {
    const content = joinList(items);
    if (!content) return '';
    return `${prefix} ${content}${suffix}`;
};

/**
 * A helper to build sentences and add them to a parts array only if they have content.
 */
const addPart = (parts: string[], content: string) => {
    if (content && content.trim()) {
        parts.push(content.trim());
    }
};

/**
 * Formats a title and content block for the report.
 */
const formatSection = (title: string, color: string, content: string): string => {
    if (!content.trim()) return '';
    const paragraphs = content.split('\n').map(p => `<p>${p}</p>`).join('');
    return `<div class="mb-4">
        <strong style="color: ${color};">${title}:</strong>
        <div class="pl-2">${paragraphs}</div>
    </div>`;
};

// --- SUBJECTIVE SECTION FORMATTER ---

const formatSubjectiveReport = (data: FormData['subjective']): string => {
    const parts: string[] = [];

    if (data.chiefComplaint) {
        addPart(parts, `Patient presents with complaints of ${data.chiefComplaint.toLowerCase()}.`);
    }

    const timeFactors = [data.onset, data.duration, data.progression].filter(Boolean);
    if(timeFactors.length > 0) {
        addPart(parts, `The condition is characterized by a ${joinList(timeFactors)} course.`);
    }

    if (data.painScore && parseInt(data.painScore, 10) > 0) {
        const location = joinList([...data.painLocation, data.painLocationOther]);
        let painDescription = `Pain is rated at ${data.painScore}/10 on the VAS, described as ${data.painQuality.toLowerCase()}`;
        if (location) {
            painDescription += ` and located in the ${location}.`;
        } else {
            painDescription += '.';
        }
        addPart(parts, painDescription);
        
        if (data.painRadiating === 'Yes') {
            const radiationSites = joinList([...data.radiatingSites, data.radiatingSiteOther]);
            addPart(parts, `The pain radiates to the ${radiationSites}.`);
        }

    } else {
        addPart(parts, "Patient reports no pain at this time (0/10 VAS).");
    }
    
    addPart(parts, formatSentence('Symptoms are aggravated by', [...data.aggravatingFactors, data.aggravatingFactorsOther]));
    addPart(parts, formatSentence('Relief is reported with', [...data.relievingFactors, data.relievingFactorsOther]));
    
    const medHistory = joinList([...data.medicalHistory, data.medicalHistoryOther]);
    addPart(parts, medHistory ? `Past medical history is significant for ${medHistory}.` : 'Patient denies significant past medical history.');

    if (data.surgery === 'Yes') {
        const surgDetails = [data.operatedSide, data.operationType].filter(Boolean).join(' ');
        addPart(parts, `Patient has a history of ${surgDetails} approximately ${data.surgeryTime} ${data.surgeryUnit.toLowerCase()} ago.`);
    }

    if (data.subjectiveNotes) {
        addPart(parts, `\nAdditional Notes: ${data.subjectiveNotes}`);
    }
    
    return parts.join(' ');
};

// --- OBJECTIVE SECTION FORMATTER ---

const formatObjectiveReport = (data: FormData['objective']): string => {
    const parts: string[] = [];
    const observationParts: string[] = [];

    const devices = joinList([...data.assistiveDevices, data.assistiveDevicesOther]);
    if (devices) observationParts.push(`utilizes ${devices}`);

    const braces = joinList([...data.braces, data.bracesOther]);
    if (braces) observationParts.push(`wears ${braces}`);
    
    const posture = joinList([...data.posture, data.postureOther]);
    if (posture) observationParts.push(`presents with ${posture} posture`);
    
    const gait = joinList([...data.gaitPattern, data.gaitPatternOther]);
    if (gait) observationParts.push(`demonstrates a ${gait} gait pattern`);

    if(observationParts.length > 0) {
        addPart(parts, `On observation, the patient ${joinList(observationParts)}.`);
    }

    const palpationParts = [];
    if(data.swellingSeverity?.length > 0) {
        palpationParts.push(`${joinList(data.swellingSeverity)} ${joinList(data.swellingType)} swelling at ${data.swellingLocation}`);
    }
    if(data.tendernessGrade?.length > 0) {
        palpationParts.push(`${joinList(data.tendernessGrade)} tenderness at ${data.tendernessSite}`);
    }
    if(palpationParts.length > 0) {
        addPart(parts, `Palpation reveals ${joinList(palpationParts)}.`);
    }
    
    let objectiveMeasures = '';
    if (data.romRows && data.romRows.some(r => r.joint)) {
        objectiveMeasures += '<strong>Range of Motion:</strong><ul>';
        data.romRows.forEach(row => {
            const items = [row.side, row.joint, row.movement, row.result, row.degrees ? `${row.degrees}°` : ''].filter(Boolean);
            if (items.length > 1) objectiveMeasures += `<li>${items.join(' - ')}</li>`;
        });
        objectiveMeasures += '</ul>';
    }
    if (data.mmtRows && data.mmtRows.some(r => r.muscle)) {
        objectiveMeasures += '<strong>Manual Muscle Testing:</strong><ul>';
        data.mmtRows.forEach(row => {
            const items = [row.side, row.muscle, row.grade ? `Grade ${row.grade}/5` : ''].filter(Boolean);
            if (items.length > 1) objectiveMeasures += `<li>${items.join(' - ')}</li>`;
        });
        objectiveMeasures += '</ul>';
    }
    if (data.specialRows && data.specialRows.some(r => r.testName)) {
        objectiveMeasures += '<strong>Special Tests:</strong><ul>';
        data.specialRows.forEach(row => {
            const items = [row.side, row.testName, row.result].filter(Boolean);
            if (items.length > 1) objectiveMeasures += `<li>${items.join(' - ')}</li>`;
        });
        objectiveMeasures += '</ul>';
    }
    if (objectiveMeasures) addPart(parts, `\n${objectiveMeasures}`);

    if (data.objectiveNotes) {
        addPart(parts, `\nAdditional Findings: ${data.objectiveNotes}`);
    }

    return parts.join('\n').replace(/\n/g, '<br>');
}

const formatAssessmentReport = (data: FormData['assessment']): string => {
    const parts: string[] = [];
    if(data.diagnosis) addPart(parts, `Clinical Impression: ${data.diagnosis}.`);
    
    const problems = joinList([...data.problemList, data.problemListOther]);
    if(problems) addPart(parts, `Key problems include ${problems}.`);
    
    const goals = joinList([...data.treatmentGoals, data.treatmentGoalsOther]);
    if(goals) addPart(parts, `Primary goals are to ${goals}.`);

    if(data.prognosis) addPart(parts, `Prognosis for recovery is considered ${data.prognosis.toLowerCase()}.`);

    return parts.join(' ');
}

const formatPlanReport = (data: FormData['plan']): string => {
    const parts: string[] = [];
    let interventions = [
        formatSentence('Modalities', data.modalities, ''),
        formatSentence('Therapeutic exercises', data.exercises, ''),
        formatSentence('Manual therapy', data.manualTherapy, '')
    ].filter(Boolean);

    if (interventions.length > 0) {
        addPart(parts, `The treatment plan will focus on: <ul>${interventions.map(i => `<li>${i}</li>`).join('')}</ul>`);
    }

    if (data.totalSessions) {
        addPart(parts, `Recommended course of care is ${data.sessionFrequency} sessions per week for a total of ${data.totalSessions} visits.`);
    }

    return parts.join('\n').replace(/\n/g, '<br>');
}

const formatProgressNoteSubjective = (data: ProgressNoteData['subjective']): string => {
    const parts: string[] = [];
    if (data.patientStatement) {
        addPart(parts, `Patient states: "${data.patientStatement}".`);
    }
    const complaints = joinList(data.complaints);
    if (complaints) {
        addPart(parts, `Current complaints include ${complaints}.`);
    }
    if (data.selfProgress) {
        addPart(parts, `Patient reports their condition is ${data.selfProgress.toLowerCase()}.`);
    }
    return parts.join(' ');
};

const formatProgressNoteObjective = (data: ProgressNoteData['objective']): string => {
    const parts: string[] = [];
    if (data.exercises.length > 0) {
        let exerciseList = '<strong>Exercises Performed:</strong><ul>';
        data.exercises.forEach(ex => {
            exerciseList += `<li>${ex.name} (${ex.sets}x${ex.reps}${ex.hold ? `, ${ex.hold}s hold` : ''})</li>`;
        });
        exerciseList += '</ul>';
        addPart(parts, exerciseList);
    }
    if (data.modalities.length > 0) {
        let modalityList = '<strong>Modalities Applied:</strong><ul>';
        data.modalities.forEach(mod => {
            modalityList += `<li>${mod.name} (${mod.duration} mins at ${mod.intensity} to ${mod.site})</li>`;
        });
        modalityList += '</ul>';
        addPart(parts, modalityList);
    }
    if (data.measurements && data.measurements.length > 0 && data.measurements.some(r => Object.values(r).some(v => v))) {
        let measurementList = '<strong>Measurements:</strong><ul>';
        data.measurements.forEach(row => {
            const items = Object.values(row).filter(Boolean);
            if (items.length > 1) measurementList += `<li>${items.join(' - ')}</li>`;
        });
        measurementList += '</ul>';
        addPart(parts, measurementList);
    }

    return parts.join('\n').replace(/\n/g, '<br>');
};

const formatProgressNoteAssessment = (data: ProgressNoteData['assessment']): string => {
    const parts: string[] = [];
    if (data.clinicalObservations) {
        addPart(parts, `Clinical observations: ${data.clinicalObservations}.`);
    }
    const performance = joinList(data.performance);
    if (performance) {
        addPart(parts, `Patient demonstrated ${performance} performance with therapeutic activities.`);
    }
    return parts.join(' ');
};

const formatProgressNotePlan = (data: ProgressNoteData['plan']): string => {
    const parts: string[] = [];
    const nextPlan = joinList(data.nextPlan);
    if (nextPlan) {
        addPart(parts, `The plan for the next session includes continuing with ${nextPlan}.`);
    }
    if (data.additionalNotes) {
        addPart(parts, `Additional notes for plan: ${data.additionalNotes}.`);
    }
    return parts.join(' ');
};

// --- MAIN REPORT GENERATORS ---

export const generateAssessmentReport = (data: FormData): string => {
    let report = '';
    report += formatSection('S (SUBJECTIVE)', '#ef4444', formatSubjectiveReport(data.subjective));
    report += formatSection('O (OBJECTIVE)', '#22c55e', formatObjectiveReport(data.objective));
    report += formatSection('A (ASSESSMENT)', '#8b5cf6', formatAssessmentReport(data.assessment));
    report += formatSection('P (PLAN)', '#3b82f6', formatPlanReport(data.plan));
    return report;
};

export const generateProgressReport = (data: ProgressNoteData): string => {
    let report = '';
    
    if (data.session.number) {
        report += `<div class="mb-4"><strong style="color: #4b5563;">SESSION #${data.session.number}</strong></div>`;
    }

    report += formatSection('S (SUBJECTIVE)', '#ef4444', formatProgressNoteSubjective(data.subjective));
    report += formatSection('O (OBJECTIVE)', '#22c55e', formatProgressNoteObjective(data.objective));
    report += formatSection('A (ASSESSMENT)', '#8b5cf6', formatProgressNoteAssessment(data.assessment));
    report += formatSection('P (PLAN)', '#3b82f6', formatProgressNotePlan(data.plan));
    return report;
};