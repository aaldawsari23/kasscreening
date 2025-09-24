
import React, { useState } from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { PlanData, Protocol } from '../../types/index';
import Input from '../ui/Input';
import CheckboxGroup from '../ui/CheckboxGroup';
import ProtocolModal from '../modals/ProtocolModal';
import { DB } from '../../data/database';

interface PlanFormProps {
    data: PlanData;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    onProtocolSelect: (protocol: Protocol) => void;
}

const PlanForm: React.FC<PlanFormProps> = ({ data, onChange, onProtocolSelect }) => {
    const [isProtocolModalOpen, setProtocolModalOpen] = useState(false);

    return (
        <div className="space-y-8">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div>
                        <h3 className="font-semibold text-slate-800">Use a Standard Protocol</h3>
                        <p className="text-sm text-slate-600">Quickly populate diagnosis, goals, and exercises for common conditions.</p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setProtocolModalOpen(true)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                        <i className="fas fa-clipboard-list"></i> Select Protocol
                    </button>
                </div>
            </div>
            <CheckboxGroup
                title="Electrotherapy & Modalities"
                icon="fa-bolt"
                name="plan.modalities"
                options={['TENS', 'IFC', 'Ultrasound', 'Hot Packs', 'Cold Packs', 'Laser']}
                checkedValues={data.modalities}
                onChange={onChange}
            />
            <CheckboxGroup
                title="Therapeutic Exercises"
                icon="fa-dumbbell"
                name="plan.exercises"
                options={[...new Set(['ROM exercises', 'Stretching', 'Strengthening', 'Balance training', 'Home program', ...data.exercises])]}
                checkedValues={data.exercises}
                onChange={onChange}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <Input type="number" label="Total Sessions" icon="fa-calendar" name="plan.totalSessions" value={data.totalSessions} onChange={onChange} />
                 <Input type="number" label="Frequency (/week)" icon="fa-redo" name="plan.sessionFrequency" value={data.sessionFrequency} onChange={onChange} />
            </div>

            <ProtocolModal
                isOpen={isProtocolModalOpen}
                onClose={() => setProtocolModalOpen(false)}
                onSelect={onProtocolSelect}
                protocols={DB.protocols}
            />
        </div>
    );
};

export default PlanForm;