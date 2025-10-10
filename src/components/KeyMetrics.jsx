import MetricCard from "./MetricCard";
import { TrendingUp, DollarSign, Calendar, AlertCircle } from 'lucide-react';
// Key Metrics Grid Component
const KeyMetrics = () => {
  const metrics = [
    {
      title: 'Project Progress',
      titleColor: 'text-green-900',
      value: '68%',
      subtitle: 'On schedule',
      icon: TrendingUp,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    
    },
    {
      title: 'Budget Utilized',
       titleColor: 'text-blue-900',
      value: '65.3%',
      subtitle: '$1.31M remaining',
      icon: DollarSign,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
       
    },
    {
      title: 'Days to Next Milestone',
       titleColor: 'text-purple-900',
      value: '11',
      subtitle: 'Foundation completion',
      icon: Calendar,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
        
    },
    {
      title: 'Active Issues',
       titleColor: 'text-orange-900',
      value: '2',
      subtitle: 'Requiring attention',
      icon: AlertCircle,
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
         
    }
  ];

  return (
    <div className="grid grid-cols-1  sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {metrics.map((metric, idx) => (
        <MetricCard key={idx} {...metric} />
      ))}
    </div>
  );
};
export default KeyMetrics;