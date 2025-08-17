// src/components/website/cards/HowItWorksCard.jsx
function HowItWorksCard({ step, p, h3 }) {
  return (
    <div className="relative h-full bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 lg:p-8 border border-gray-100 group hover:-translate-y-2 max-w-sm mx-auto">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-blue-500/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center h-full">
        {/* Step Badge */}
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary font-bold text-lg rounded-full mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-300 transform group-hover:scale-110">
          {step.split(" ")[1]}
        </div>

        {/* Step Label */}
        <div className="text-primary font-semibold text-sm uppercase tracking-wide mb-2 opacity-80">
          {step}
        </div>

        {/* Title */}
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors duration-300">
          {h3}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed text-sm lg:text-base">
          {p}
        </p>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-4 right-4 w-2 h-2 bg-primary/20 rounded-full group-hover:bg-primary/40 transition-colors duration-300"></div>
      <div className="absolute bottom-4 left-4 w-1 h-1 bg-blue-500/20 rounded-full group-hover:bg-blue-500/40 transition-colors duration-300"></div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-primary/20 transition-colors duration-300"></div>
    </div>
  );
}

export default HowItWorksCard;
