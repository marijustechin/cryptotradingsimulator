import { useTranslation } from 'react-i18next';

const StepsComponent = () => {
  const { t } = useTranslation();
  const steps = [
    { icon: "📝", text: t('howto_step_1') },
    { icon: "📊", text: t('howto_step_2') },
    { icon: "📈", text: t('howto_step_3') },
    { icon: "💰", text: t('howto_step_4') }
  ];

  return (
    <div className="flex justify-center items-center my-10 px-4 md:mb-40">
      <div className="relative w-full max-w-4xl flex flex-col md:flex-row items-center md:items-start">
        
        {/* Gradient Line (Only shows on medium+ screens) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-violet-500 to-blue-500 transform -translate-y-1/2"></div>
        
        {/* Steps */}
        <div className="w-full flex flex-col md:flex-row md:justify-between relative z-10">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center w-full md:w-1/4 text-center mb-8 md:mb-0">
              
              {/* Step Circle */}
              <div className="relative flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-white border-4 border-violet-500 shadow-lg text-3xl">
                {step.icon}
              </div>
              
              {/* Step Text */}
              <p className="mt-3 text-sm md:text-base font-semibold bg-gradient-to-r from-violet-300 to-blue-300 text-transparent bg-clip-text">
                {step.text}
              </p>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default StepsComponent;

