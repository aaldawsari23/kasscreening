
import React from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { ObjectiveData, DynamicRow } from '../../types/index';
import DynamicTable from '../ui/DynamicTable';

interface ObjectiveFormProps {
    data: ObjectiveData;
    onRowChange: (section: 'objective', field: string, index: number, key: string, value: string) => void;
    onAddRow: (section: 'objective', field: string, newRow: DynamicRow) => void;
    onRemoveRow: (section: 'objective', field: string, index: number) => void;
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const ObjectiveForm: React.FC<ObjectiveFormProps> = (props) => {
    const { data, onRowChange, onAddRow, onRemoveRow } = props;
    const dynamicTableProps = {
        section: 'objective' as const,
        onRowChange,
        onAddRow,
        onRemoveRow
    };
    
    return (
        <div className="space-y-8">
            <DynamicTable 
                title="Range of Motion (ROM)" 
                icon="fa-redo" 
                rows={data.romRows} 
                field="romRows"
                columns={[
                    {key: 'side', label: 'Side', type: 'select', options: ['','R','L','B/L']},
                    {key: 'joint', label: 'Joint', type: 'text'},
                    {key: 'movement', label: 'Movement', type: 'text'},
                    {key: 'result', label: 'Result', type: 'select', options: ['','WNL','Limited','Hypermobile']},
                    {key: 'degrees', label: 'Degrees', type: 'number'}
                ]}
                {...dynamicTableProps}
            />
            <DynamicTable 
                title="Manual Muscle Testing (MMT)" 
                icon="fa-dumbbell" 
                rows={data.mmtRows} 
                field="mmtRows"
                columns={[
                    {key: 'side', label: 'Side', type: 'select', options: ['','R','L','B/L']},
                    {key: 'muscle', label: 'Muscle', type: 'text'},
                    {key: 'grade', label: 'Grade (0-5)', type: 'number'}
                ]}
                {...dynamicTableProps}
            />
            <DynamicTable 
                title="Special Tests" 
                icon="fa-search" 
                rows={data.specialRows} 
                field="specialRows"
                columns={[
                    {key: 'side', label: 'Side', type: 'select', options: ['','R','L','B/L']},
                    {key: 'testName', label: 'Test Name', type: 'text'},
                    {key: 'result', label: 'Result', type: 'select', options: ['','Positive','Negative','Inconclusive']}
                ]}
                {...dynamicTableProps}
            />
        </div>
    );
};

export default ObjectiveForm;