import { cva } from 'class-variance-authority';

const cardVariants = cva(
  "relative flex flex-col rounded-xl p-5 shadow-sm transition-all hover:shadow-md",
  {
    variants: {
      variant: {
        blue: "bg-blue-50 text-blue-700 border border-blue-100",
        green: "bg-green-50 text-green-700 border border-green-100",
        amber: "bg-amber-50 text-amber-700 border border-amber-100",
        red: "bg-red-50 text-red-700 border border-red-100",
        purple: "bg-purple-50 text-purple-700 border border-purple-100",
        teal: "bg-teal-50 text-teal-700 border border-teal-100",
      }
    },
    defaultVariants: {
      variant: "blue"
    }
  }
);

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  variant = "blue", 
  trend = null, 
  trendValue = null,
  onClick,
  className = ""
}) => {
  return (
    <div 
      className={`${cardVariants({ variant })} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
        </div>
        {Icon && <Icon className="h-8 w-8 opacity-80" />}
      </div>
      
      {trend && (
        <div className={`mt-3 text-xs font-medium ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
          {trend === 'up' ? '↑' : '↓'} {trendValue}% from last month
        </div>
      )}
    </div>
  );
};

export default StatCard;