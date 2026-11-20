export function Input({ label, className = "", wrapperClassName = "", ...props }) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium text-[#FFFAEA] mb-1.5">
          {label}
        </label>
      )}
      <input
        className={`w-full px-4 py-3 rounded-xl bg-[#FFFAEA]/10 border border-[#9FA1FF]/30 text-[#FFFAEA] placeholder-[#FFFAEA]/50 focus:outline-none focus:border-[#9FA1FF] transition-colors ${className}`.trim()}
        {...props}
      />
    </div>
  );
}

export function Textarea({
  label,
  className = "",
  wrapperClassName = "",
  ...props
}) {
  return (
    <div className={wrapperClassName}>
      {label && (
        <label className="block text-sm font-medium text-[#FFFAEA] mb-1.5">
          {label}
        </label>
      )}
      <textarea
        className={`w-full px-4 py-3 rounded-xl bg-[#FFFAEA]/10 border border-[#9FA1FF]/30 text-[#FFFAEA] placeholder-[#FFFAEA]/50 focus:outline-none focus:border-[#9FA1FF] transition-colors resize-y ${className}`.trim()}
        {...props}
      />
    </div>
  );
}