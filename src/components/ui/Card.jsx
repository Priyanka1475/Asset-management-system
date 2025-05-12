const Card = ({ 
  children, 
  title, 
  description, 
  footer, 
  className = ""
}) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm overflow-hidden ${className}`}>
      {(title || description) && (
        <div className="p-5 border-b">
          {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
        </div>
      )}
      <div className="p-5">{children}</div>
      {footer && <div className="p-4 bg-gray-50 border-t">{footer}</div>}
    </div>
  );
};

export default Card;