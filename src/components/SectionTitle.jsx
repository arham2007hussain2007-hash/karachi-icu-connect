export default function SectionTitle({ title, subtitle, center = false }) {
  return (
    <div className={`mb-8 ${center ? "text-center" : ""}`}>
      <h2 className="text-2xl md:text-3xl font-bold text-navy-900 tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-navy-500 text-sm md:text-base max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
}
