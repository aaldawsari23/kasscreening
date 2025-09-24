
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    icon?: string;
    children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, icon, children, ...props }) => {
    return (
        <div className="w-full">
            <label className="block text-sm font-medium text-slate-600 mb-1">
                {icon && <i className={`fas ${icon} text-blue-500 mr-2`}></i>}
                {label}
            </label>
            <select
                {...props}
                className="input-field w-full px-3 py-2 border-2 border-slate-200 rounded-md text-sm transition-colors duration-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
                {children}
            </select>
        </div>
    );
};

export default Select;
