export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center w-full">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-border-color opacity-20"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-accent-primary animate-spin"></div>
        </div>
        <p className="text-text-secondary text-lg font-medium animate-pulse tracking-wide">
          Loading...
        </p>
      </div>
    </div>
  );
}
