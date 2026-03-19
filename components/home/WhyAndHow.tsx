import { ArrowRight, Home, TrendingUp, Users, MapPin } from 'lucide-react';

export function WhyChooseUs() {
  const items = [
    { icon: <Home className="w-8 h-8 text-green-950" />, title: 'Vast Selection', desc: '50,000+ properties across prime locations' },
    { icon: <Users className="w-8 h-8 text-green-950" />, title: 'Expert Agents', desc: 'Connect with certified professionals' },
    { icon: <MapPin className="w-8 h-8 text-green-950" />, title: 'Prime Locations', desc: 'Properties in the best neighborhoods' },
    { icon: <TrendingUp className="w-8 h-8 text-green-950" />, title: 'Best Deals', desc: 'Competitive prices & exclusive offers' },
  ];

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-transparent to-green-800/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">Why Choose Us?</h2>
          <p className="text-green-100 text-xl max-w-2xl mx-auto">Experience premium real estate services with cutting-edge technology</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div key={item.title} className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl hover:bg-white/15 transition group">
              <div className="bg-gradient-to-br from-lime-400 to-green-500 p-4 rounded-xl w-fit mb-6 group-hover:scale-110 transition">
                {item.icon}
              </div>
              <h3 className="font-bold text-xl text-white mb-3">{item.title}</h3>
              <p className="text-green-100">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    { step: '1', title: 'Search', desc: 'Browse our extensive property catalog' },
    { step: '2', title: 'Connect', desc: 'Chat with agents and sellers directly' },
    { step: '3', title: 'View', desc: 'Schedule tours and virtual walkthroughs' },
    { step: '4', title: 'Invest', desc: 'Complete your purchase with ease' },
  ];

  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-green-900/40 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">How It Works</h2>
          <p className="text-green-100 text-xl">Simple steps to find your perfect property</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((item) => (
            <div key={item.step} className="relative">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl text-center hover:bg-white/15 transition h-full">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-lime-400 to-green-500 text-green-950 font-bold text-2xl rounded-full mb-6">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl text-white mb-2">{item.title}</h3>
                <p className="text-green-100">{item.desc}</p>
              </div>
              {item.step !== '4' && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-8 h-8 text-lime-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}