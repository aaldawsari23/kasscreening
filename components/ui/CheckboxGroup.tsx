import React from 'react';

interface CheckboxGroupProps {
    title: string;
    icon: string;
    name: string;
    options: readonly string[];
    // Fix: Allow readonly array for checkedValues prop to match state type.
    checkedValues: readonly string[];
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxGroup: React.FC<CheckboxGroupProps> =
    ({ title, icon, name, options, checkedValues, onChange }) => {
        return (
            <fieldset>
                <legend className="font-semibold text-slate-800 mb-2 flex items-center">
                    <i className={`fas ${icon} text-blue-500 mr-2`}></i>{title}
                </legend>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {options.map(option => (
                        <label key={option} className="flex items-center text-sm p-2 rounded-md hover:bg-slate-100">
                            <input type="checkbox" name={name} value={option} checked={checkedValues.includes(option)} onChange={onChange} className="mr-2" />
                            {option}
                        </label>
                    ))}
                </div>
            </fieldset>
        )
    }

export default CheckboxGroup;