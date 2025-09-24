
import React from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { AssessmentData } from '../../types/index';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';

interface AssessmentFormProps {
    data: AssessmentData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const AssessmentForm: React.FC<AssessmentFormProps> = ({ data, onChange }) => {
    return (
        <div className="space-y-6">
            <Textarea label="Clinical Diagnosis" icon="fa-diagnoses" name="assessment.diagnosis" value={data.diagnosis} onChange={onChange} rows={2} placeholder="e.g., Rotator cuff tendinitis..." />
            {/* Additional form elements like Problem List and Goals would be implemented here */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Prognosis" icon="fa-chart-line" name="assessment.prognosis" value={data.prognosis} onChange={onChange}>
                    <option value="">Select prognosis</option>
                    <option>Excellent</option>
                    <option>Good</option>
                    <option>Fair</option>
                    <option>Poor</option>
                </Select>
                <Input type="text" label="Referring Doctor" icon="fa-user-md" name="assessment.referringDoctor" value={data.referringDoctor} onChange={onChange} />
            </div>
            <Textarea label="Imaging Findings" icon="fa-x-ray" name="assessment.imagingFindings" value={data.imagingFindings} onChange={onChange} rows={3} />
        </div>
    );
};

export default AssessmentForm;