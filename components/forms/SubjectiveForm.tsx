
import React from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { SubjectiveData } from '../../types/index';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Textarea from '../ui/Textarea';

interface SubjectiveFormProps {
    data: SubjectiveData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const SubjectiveForm: React.FC<SubjectiveFormProps> = ({ data, onChange }) => {
    return (
        <div className="space-y-6">
            <Textarea label="Chief Complaint" icon="fa-comment-dots" name="subjective.chiefComplaint" value={data.chiefComplaint} onChange={onChange} rows={2} placeholder="Describe the main issue..." />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Select label="Onset" icon="fa-clock" name="subjective.onset" value={data.onset} onChange={onChange}>
                    <option value="">Select onset</option>
                    <option value="Sudden">Sudden</option>
                    <option value="Gradual">Gradual</option>
                    <option value="Insidious">Insidious</option>
                </Select>
                 <Select label="Duration" icon="fa-calendar-alt" name="subjective.duration" value={data.duration} onChange={onChange}>
                    <option value="">Select duration</option>
                    <option value="Acute">Acute (< 6 weeks)</option>
                    <option value="Subacute">Subacute (6–12 weeks)</option>
                    <option value="Chronic">Chronic (> 12 weeks)</option>
                </Select>
                 <Select label="Progression" icon="fa-chart-line" name="subjective.progression" value={data.progression} onChange={onChange}>
                    <option value="">Select progression</option>
                    <option value="Improving">Improving</option>
                    <option value="Worsening">Worsening</option>
                    <option value="Fluctuating">Fluctuating</option>
                    <option value="Static">Static</option>
                </Select>
            </div>
            {/* Additional form elements like Pain Assessment would go here */}
        </div>
    );
};

export default SubjectiveForm;