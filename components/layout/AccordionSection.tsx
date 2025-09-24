
import React from 'react';
// Fix: Corrected type import path from '../../types' to '../../types/index' to resolve module ambiguity.
import type { AccordionSectionName } from '../../types/index';

interface AccordionSectionProps {
    title: string;
    subtitle: string;
    icon: 'S' | 'O' | 'A' | 'P' | 'PN';
    sectionName: AccordionSectionName;
    isOpen: boolean;
    onToggle: (section: AccordionSectionName) => void;
    children: React.ReactNode;
    data: object;
}

const iconColors = {
    S: 'bg-red-500',
    O: 'bg-green-500',
    A: 'bg-purple-500',
    P: 'bg-blue-500',
    PN: 'bg-orange-500',
};

const getStatus = (data: object): { text: string, className: string } => {
    const filledFields = Object.values(data).filter(value => {
        if (Array.isArray(value)) return value.length > 0;
        if (typeof value === 'object' && value !== null) {
            // For nested objects like rows
            return Object.values(value).some(subValue => Array.isArray(subValue) && subValue.length > 0 && Object.values(subValue[0]).some(v => v !== ''));
        }
        return value !== '' && value !== '0' && value !== null;
    }).length;

    if (filledFields === 0) return { text: 'Empty', className: 'bg-amber-100 text-amber-800 border-amber-300' };
    if (filledFields < 3) return { text: 'Partial', className: 'bg-blue-100 text-blue-800 border-blue-300' };
    return { text: 'Complete', className: 'bg-green-100 text-green-800 border-green-300' };
};

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, subtitle, icon, sectionName, isOpen, onToggle, children, data }) => {
    const { text: statusText, className: statusClassName } = getStatus(data);
    
    return (
        <div className={`accordion-section bg-white border border-slate-200 rounded-xl shadow-sm transition-all duration-300 ${isOpen ? 'shadow-lg border-blue-300' : 'hover:shadow-md'}`}>
            <div
                className="accordion-header flex items-center justify-between p-4 md:p-6 cursor-pointer"
                onClick={() => onToggle(sectionName)}
                role="button"
                aria-expanded={isOpen}
                tabIndex={0}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onToggle(sectionName)}
            >
                <div className="flex items-center flex-1">
                    <div className={`accordion-icon w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-xl mr-4 flex-shrink-0 ${iconColors[icon]}`}>
                        {icon}
                    </div>
                    <div>
                        <h2 className="text-lg md:text-xl font-bold text-slate-800">{title}</h2>
                        <p className="text-xs md:text-sm text-slate-500">{subtitle}</p>
                    </div>
                </div>
                <div className={`status-badge px-3 py-1 rounded-full text-xs font-semibold border ${statusClassName} mx-4`}>
                    {statusText}
                </div>
                <i className={`fas fa-chevron-down text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}></i>
            </div>
            <div className={`accordion-content ${isOpen ? 'expanded' : ''}`}>
                <div className="accordion-body p-4 md:p-6 border-t border-slate-100">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AccordionSection;