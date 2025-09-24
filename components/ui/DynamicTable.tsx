
import React from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { DynamicRow } from '../../types/index';

interface DynamicTableProps {
    title: string;
    icon: string;
    // Fix: Allow readonly array for rows prop to match state type.
    rows: readonly DynamicRow[];
    section: 'objective';
    field: string;
    columns: {
        key: string;
        label: string;
        type: 'text' | 'select' | 'number';
        options?: string[];
    }[];
    onRowChange: (section: 'objective', field: string, index: number, key: string, value: string) => void;
    onAddRow: (section: 'objective', field: string, newRow: DynamicRow) => void;
    onRemoveRow: (section: 'objective', field: string, index: number) => void;
}

const DynamicTable: React.FC<DynamicTableProps> =
    ({ title, icon, rows, section, field, columns, onRowChange, onAddRow, onRemoveRow }) => {
        return (
            <div>
                <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-slate-800 flex items-center">
                        <i className={`fas ${icon} text-blue-500 mr-2`}></i>{title}
                    </h3>
                    <button type="button" onClick={() => onAddRow(section, field, {})} className="px-3 py-1 bg-slate-200 text-slate-700 text-xs rounded-md hover:bg-slate-300">
                        <i className="fas fa-plus mr-1"></i>Add Row
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full data-table text-sm border border-slate-200 rounded-lg">
                        <thead className="bg-slate-50">
                            <tr>
                                {columns.map(c => <th key={c.key} className="px-3 py-2 text-left font-medium text-slate-500">{c.label}</th>)}
                                <th className="px-3 py-2"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, index) => (
                                <tr key={index} className="border-t border-slate-200">
                                    {columns.map(col => (
                                        <td key={col.key} className="p-1">
                                            {col.type === 'select' ? (
                                                <select value={row[col.key] || ''} onChange={(e) => onRowChange(section, field, index, col.key, e.target.value)} className="w-full p-1 border rounded-md text-xs">
                                                    <option value=""></option>
                                                    {col.options?.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            ) : (
                                                <input type={col.type} value={row[col.key] || ''} onChange={(e) => onRowChange(section, field, index, col.key, e.target.value)} className="w-full p-1 border rounded-md text-xs" />
                                            )}
                                        </td>
                                    ))}
                                    <td className="p-1 text-center">
                                        <button type="button" onClick={() => onRemoveRow(section, field, index)} className="text-red-500 hover:text-red-700"><i className="fas fa-trash-alt"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

export default DynamicTable;