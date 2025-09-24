// Fix: Corrected type import path from '../types' to '../types/index' to resolve module ambiguity.
import type { FormData, ProgressNoteData } from '../types/index';

export const initialFormData: FormData = {
    subjective: {
        chiefComplaint: '',
        onset: '',
        duration: '',
        progression: '',
        painScore: '0',
        painLocation: [],
        painLocationOther: '',
        painSide: '',
        painQuality: '',
        painPattern: '',
        painRadiating: '',
        radiatingSide: '',
        radiatingSites: [],
        radiatingSiteOther: '',
        aggravatingFactors: [],
        aggravatingFactorsOther: '',
        relievingFactors: [],
        relievingFactorsOther: '',
        medicalHistory: [],
        medicalHistoryOther: '',
        surgery: '',
        operationType: '',
        operatedSide: '',
        surgeryTime: '',
        surgeryUnit: 'Weeks',
        followUpDate: '',
        subjectiveNotes: ''
    },
    objective: {
        assistiveDevices: [],
        assistiveDevicesOther: '',
        braces: [],
        bracesOther: '',
        posture: [],
        postureOther: '',
        deformities: [],
        deformitiesOther: '',
        gaitPattern: [],
        gaitPatternOther: '',
        swellingSeverity: [],
        swellingType: [],
        swellingLocation: '',
        skinCondition: [],
        ulcerStage: '',
        skinConditionSite: '',
        tendernessGrade: [],
        tendernessSite: '',
        sensationFinding: [],
        sensationSite: '',
        balance: '',
        fallRisk: '',
        romRows: [{ side: '', joint: '', movement: '', result: '', degrees: '' }],
        mmtRows: [{ side: '', muscle: '', grade: '' }],
        specialRows: [{ side: '', testName: '', result: '' }],
        objectiveNotes: ''
    },
    assessment: {
        diagnosis: '',
        problemList: [],
        problemListOther: '',
        treatmentGoals: [],
        treatmentGoalsOther: '',
        prognosis: '',
        imagingDate: '',
        referringDoctor: '',
        imagingFindings: '',
        additionalNotes: ''
    },
    plan: {
        modalities: [],
        exercises: [],
        manualTherapy: [],
        totalSessions: '',
        sessionFrequency: '',
        sessionFrequencyUnit: 'per week'
    }
};

export const initialProgressNoteData: ProgressNoteData = {
    session: { number: '1' },
    subjective: {
        patientStatement: '',
        complaints: [],
        selfProgress: ''
    },
    objective: {
        exercises: [],
        modalities: [],
        measurements: []
    },
    assessment: {
        clinicalObservations: '',
        performance: []
    },
    plan: {
        nextPlan: [],
        additionalNotes: ''
    },
    distribution: {
        transferRequired: '',
        transferTo: '',
        transferReason: '',
        returnNumber: '',
        returnUnit: 'Days',
        returnDate: '',
        transferType: '',
        notes: ''
    },
    discharge: {
        ready: '',
        improvement: '',
        date: '',
        therapist: '',
        vas: '',
        rom: '',
        mmt: '',
        specialTests: '',
        functional: '',
        reason: '',
        notes: ''
    }
};