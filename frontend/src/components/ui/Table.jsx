import React from 'react';

export const Table = ({ headers, children }) => (
  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="bg-slate-50 border-b border-slate-200">
          {headers.map((header, idx) => (
            <th key={idx} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100">
        {children}
      </tbody>
    </table>
  </div>
);

export const TableRow = ({ children }) => (
  <tr className="hover:bg-slate-50/50 transition-colors">
    {children}
  </tr>
);

export const TableCell = ({ children, className = "" }) => (
  <td className={`px-6 py-4 text-sm text-slate-600 ${className}`}>
    {children}
  </td>
);
