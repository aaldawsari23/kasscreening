export interface SubjectiveData {
    chiefComplaint: string;
    onset: string;
    duration: string;
    progression: string;
    painScore: string;
    // Fix: Use readonly arrays for immutable state properties
    painLocation: readonly string[];
    painLocationOther: string;
    painSide: string;
    painQuality: string;
    painPattern: string;
    painRadiating: 'Yes' | 'No' | '';
    radiatingSide: 'Right' | 'Left' | '';
    // Fix: Use readonly arrays for immutable state properties
    radiatingSites: readonly string[];
    radiatingSiteOther: string;
    // Fix: Use readonly arrays for immutable state properties
    aggravatingFactors: readonly string[];
    aggravatingFactorsOther: string;
    // Fix: Use readonly arrays for immutable state properties
    relievingFactors: readonly string[];
    relievingFactorsOther: string;
    // Fix: Use readonly arrays for immutable state properties
    medicalHistory: readonly string[];
    medicalHistoryOther: string;
    surgery: 'Yes' | 'No' | '';
    operationType: string;
    operatedSide: string;
    surgeryTime: string;
    surgeryUnit: string;
    followUpDate: string;
    subjectiveNotes: string;
}

export interface DynamicRow {
    [key: string]: string;
}

export interface ObjectiveData {
    // Fix: Use readonly arrays for immutable state properties
    assistiveDevices: readonly string[];
    assistiveDevicesOther: string;
    // Fix: Use readonly arrays for immutable state properties
    braces: readonly string[];
    bracesOther: string;
    // Fix: Use readonly arrays for immutable state properties
    posture: readonly string[];
    postureOther: string;
    // Fix: Use readonly arrays for immutable state properties
    deformities: readonly string[];
    deformitiesOther: string;
    // Fix: Use readonly arrays for immutable state properties
    gaitPattern: readonly string[];
    gaitPatternOther: string;
    // Fix: Use readonly arrays for immutable state properties
    swellingSeverity: readonly string[];
    // Fix: Use readonly arrays for immutable state properties
    swellingType: readonly string[];
    swellingLocation: string;
    // Fix: Use readonly arrays for immutable state properties
    skinCondition: readonly string[];
    ulcerStage: string;
    skinConditionSite: string;
    // Fix: Use readonly arrays for immutable state properties
    tendernessGrade: readonly string[];
    tendernessSite: string;
    // Fix: Use readonly arrays for immutable state properties
    sensationFinding: readonly string[];
    sensationSite: string;
    balance: 'Normal' | 'Moderate' | 'High' | '';
    fallRisk: 'Low' | 'Moderate' | 'High' | '';
    // Fix: Use readonly arrays for immutable state properties
    romRows: readonly DynamicRow[];
    // Fix: Use readonly arrays for immutable state properties
    mmtRows: readonly DynamicRow[];
    // Fix: Use readonly arrays for immutable state properties
    specialRows: readonly DynamicRow[];
    objectiveNotes: string;
}

export interface AssessmentData {
    diagnosis: string;
    // Fix: Use readonly arrays for immutable state properties
    problemList: readonly string[];
    problemListOther: string;
    // Fix: Use readonly arrays for immutable state properties
    treatmentGoals: readonly string[];
    treatmentGoalsOther: string;
    prognosis: string;
    imagingDate: string;
    referringDoctor: string;
    imagingFindings: string;
    additionalNotes: string;
}

export interface PlanData {
    // Fix: Use readonly arrays for immutable state properties
    modalities: readonly string[];
    // Fix: Use readonly arrays for immutable state properties
    exercises: readonly string[];
    // Fix: Use readonly arrays for immutable state properties
    manualTherapy: readonly string[];
    totalSessions: string;
    sessionFrequency: string;
    sessionFrequencyUnit: string;
}

export interface FormData {
    subjective: SubjectiveData;
    objective: ObjectiveData;
    assessment: AssessmentData;
    plan: PlanData;
}

export interface SelectedExercise {
    id: string;
    name: string;
    sets: string;
    reps: string;
    hold: string;
    notes?: string;
}

export interface SelectedModality {
    name: string;
    duration: string;
    intensity: string;
    site: string;
    notes?: string;
}

export interface ProgressNoteSubjective {
    patientStatement: string;
    // Fix: Use readonly arrays for immutable state properties
    complaints: readonly string[];
    selfProgress: 'Improved' | 'No change' | 'Worse' | '';
}
  
export interface ProgressNoteObjective {
    // Fix: Use readonly arrays for immutable state properties
    exercises: readonly SelectedExercise[];
    // Fix: Use readonly arrays for immutable state properties
    modalities: readonly SelectedModality[];
    // Fix: Use readonly arrays for immutable state properties
    measurements: readonly DynamicRow[];
}
  
export interface ProgressNoteAssessment {
    clinicalObservations: string;
    // Fix: Use readonly arrays for immutable state properties
    performance: readonly string[];
}
  
export interface ProgressNotePlan {
    // Fix: Use readonly arrays for immutable state properties
    nextPlan: readonly string[];
    additionalNotes: string;
}

export interface ProgressNoteDistribution {
    transferRequired: 'Yes' | 'No' | '';
    transferTo: string;
    transferReason: string;
    returnNumber: string;
    returnUnit: string;
    returnDate: string;
    transferType: 'Temporary' | 'Full transfer' | '';
    notes: string;
}

export interface ProgressNoteDischarge {
    ready: 'Yes' | 'No' | '';
    improvement: string;
    date: string;
    therapist: string;
    vas: string;
    rom: string;
    mmt: string;
    specialTests: string;
    functional: string;
    reason: string;
    notes: string;
}

export interface ProgressNoteData {
    session: {
        number: string;
    };
    subjective: ProgressNoteSubjective;
    objective: ProgressNoteObjective;
    assessment: ProgressNoteAssessment;
    plan: ProgressNotePlan;
    distribution: ProgressNoteDistribution;
    discharge: ProgressNoteDischarge;
}

export type ReportTab = 'assessment' | 'progress';
export type AccordionSectionName = 'subjective' | 'objective' | 'assessment' | 'plan' | 'progressNote';

// Exercise and Protocol Types from JSON data
export interface ExerciseRule {
  condition: string;
  type: 'info' | 'warn' | 'lock';
  message: string;
}

export interface Exercise {
  id: string;
  name: string;
  region: readonly string[];
  category: string;
  type: string;
  tags: readonly string[];
  equipment: readonly string[];
  protocol: string;
  phase: string;
  rules: readonly ExerciseRule[];
  sets?: string;
  reps?: string;
  frequency?: string;
  hold?: string;
  duration?: string;
  notes?: string;
}

export interface ProtocolPhase {
  id: string;
  name: string;
  description: string;
  goals: readonly string[];
  precautions: readonly string[];
  tips: readonly string[];
  exercises: readonly Exercise[];
}

export interface Protocol {
  id: string;
  name: string;
  title: string;
  description: string;
  phases: readonly ProtocolPhase[];
}

export interface Modality {
  device: string;
  mode: string;
  time: number;
  freq: string;
  intensity: string;
  site: string;
}

export interface Database {
  exercises: readonly Exercise[];
  protocols: readonly Protocol[];
  modalities: readonly Modality[];
}