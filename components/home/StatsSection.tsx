const STATS = [
  { value: '500+', label: 'Properties Listed' },
  { value: '90+', label: 'Expert Agents' },
  { value: '100+', label: 'Happy Customers' },
  { value: '24/7', label: 'Support Available' },
];

export function StatsSection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-green-800/50 to-green-900/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center hover:bg-white/15 transition">
              <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-lime-300 to-green-300 bg-clip-text text-transparent mb-3">
                {stat.value}
              </div>
              <p className="text-green-100 text-lg font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}