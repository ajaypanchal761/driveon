/**
 * BodyTypeFilter Component
 * Horizontal filter buttons for car body types
 * All, Sedan, Hatchback, SUV, MUV
 * All is selected by default (black), others are grey
 */
const BodyTypeFilter = ({ selected, onSelect }) => {
  const bodyTypes = [
    { label: 'All', value: 'All', carType: null },
    { label: 'Sedan', value: 'Sedan', carType: 'sedan' },
    { label: 'SUV', value: 'SUV', carType: 'suv' },
    { label: 'MUV', value: 'MUV', carType: 'muv' },
    { label: 'Hatchback', value: 'Hatchback', carType: 'hatchback' },
    { label: 'Luxury', value: 'Luxury', carType: 'luxury' },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-base font-bold text-white">
          Body Type
        </h3>
      </div>
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
        {bodyTypes.map((type) => (
          <button
            key={type.value}
            onClick={() => onSelect(type.value)}
            className={`px-1.5 py-0.5 rounded-md font-medium text-xs whitespace-nowrap transition-colors ${
              selected === type.value
                ? 'bg-white text-black'
                : 'text-gray-400 hover:text-gray-300'
            }`}
            style={{
              backgroundColor: selected === type.value ? '#FFFFFF' : 'transparent',
            }}
          >
            {type.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BodyTypeFilter;

