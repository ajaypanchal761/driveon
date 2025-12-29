import React from 'react';
import { MdFolderOpen, MdImportExport, MdNote, MdTimer, MdCalculate, MdHistory } from 'react-icons/md';

/**
 * Generic Placeholder for Tools Sub-Pages
 */
const ToolPlaceholder = ({ title, subtitle, type }) => {
  let Icon = MdFolderOpen;
  let colorClass = 'bg-gray-50 text-gray-500 border-gray-300';

  if (type === 'export') {
    Icon = MdImportExport;
    colorClass = 'bg-green-50 text-green-500 border-green-200';
  } else if (type === 'note') {
    Icon = MdNote;
    colorClass = 'bg-yellow-50 text-yellow-500 border-yellow-200';
  } else if (type === 'timer') {
    Icon = MdTimer;
    colorClass = 'bg-purple-50 text-purple-500 border-purple-200';
  } else if (type === 'calc') {
    Icon = MdCalculate;
    colorClass = 'bg-blue-50 text-blue-500 border-blue-200';
  } else if (type === 'log') {
    Icon = MdHistory;
    colorClass = 'bg-orange-50 text-orange-500 border-orange-200';
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-gray-500 text-sm">{subtitle}</p>
        </div>
      </div>

      <div className={`bg-white rounded-xl border-2 border-dashed p-10 flex flex-col items-center justify-center text-center min-h-[400px] ${colorClass.split(' ')[2]}`}>
         <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${colorClass.split(' ').slice(0, 2).join(' ')}`}>
            <Icon size={40} />
         </div>
         <h3 className="text-xl font-semibold text-gray-700">Module: {title}</h3>
         <p className="text-gray-500 max-w-sm mt-2">
            The "{title}" utility tool will be available here.
         </p>
      </div>
    </div>
  );
};

export const ExcelExportPage = () => <ToolPlaceholder title="Excel Export" subtitle="Download data in .xlsx format" type="export" />;
export const PDFExportPage = () => <ToolPlaceholder title="PDF Export" subtitle="Generate printable PDF documents" type="export" />;
export const NotesPage = () => <ToolPlaceholder title="Quick Notes" subtitle="Digital scratchpad for quick memos" type="note" />;
export const RemindersPage = () => <ToolPlaceholder title="Reminders" subtitle="Set alerts and tasks" type="timer" />;
export const CalculatorPage = () => <ToolPlaceholder title="Calculator" subtitle="Quick financial tools and converters" type="calc" />;
export const AuditLogsPage = () => <ToolPlaceholder title="Audit Logs" subtitle="System activity and security logs" type="log" />;
