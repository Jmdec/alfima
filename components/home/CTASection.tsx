import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTASection() {
  return (
    <section className="py-24 sm:py-32 bg-gradient-to-b from-transparent to-green-800/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-12 sm:p-16 text-center hover:bg-white/15 transition">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-green-100 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Start exploring your perfect property today or list your property to reach thousands of qualified buyers and renters.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/buy">
              <Button className="bg-gradient-to-r from-lime-400 to-green-500 hover:from-lime-500 hover:to-green-600 text-green-950 font-bold text-lg px-8 py-6">
                Browse Properties
              </Button>
            </Link>
            {/* <Link href="/list-property">
              <Button className="bg-white/20 hover:bg-white/30 text-white font-bold text-lg px-8 py-6 border border-white/30">
                List Your Property
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}