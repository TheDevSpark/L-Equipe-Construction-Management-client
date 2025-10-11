
import React from 'react';

const IssueItem = ({ text, severity }) => {
  const severityStyles = {
    medium: {
      badge: 'bg-yellow-600 text-white',
      label: 'Medium'
    },
    high: {
      badge: 'bg-red-600 text-white',
      label: 'High'
    }
  }; 

  const style = severityStyles[severity];

  return (
    <div className="flex items-start gap-2 mb-3">
      <span className={`inline-block px-2 py-0.5 rounded-[8px] text-xs font-bold ${style.badge} flex-shrink-0`}>
        {style.label}
      </span>
      <p className="text-sm text-gray-800 leading-relaxed">{text}</p>
    </div>
  );
};
  export default IssueItem;