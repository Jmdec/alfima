'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { useToast } from '@/hooks/use-toast';
import { Star } from 'lucide-react';

// Zod validation schema
const testimonialSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

interface Testimonial {
  id: number;
  full_name: string;
  message: string;
  is_approved: boolean;
  created_at: string;
}

export function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      full_name: '',
      message: '',
    },
  });

  // Fetch testimonials
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/testimonials');
        const data = await response.json();
        
        if (data.success) {
          setTestimonials(data.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch testimonials:', error);
        toast({
          title: 'Error',
          description: 'Failed to load testimonials',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, [toast]);

  // Handle form submission
  const onSubmit = async (values: TestimonialFormData) => {
    try {
      setSubmitting(true);
      const response = await fetch('/api/testimonials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success!',
          description: data.message || 'Thank you for your testimonial!',
        });
        form.reset();
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to submit testimonial',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Failed to submit testimonial:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while submitting your testimonial',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="w-full py-16 md:py-24 bg-gradient-to-b from-[#3d2626] to-[#2a1a1a]">
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Hear from satisfied clients about their experience with our real estate services.
          </p>
        </div>

        {/* Carousel and Form Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Carousel Section */}
          <div className="flex items-center justify-center">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <Spinner className="w-8 h-8" />
              </div>
            ) : testimonials.length === 0 ? (
              <div className="flex items-center justify-center h-96 bg-[#4a3333] rounded-xl border border-[#6b4949] p-8 shadow-lg">
                <p className="text-center text-gray-300">
                  No testimonials yet. Be the first to share your experience!
                </p>
              </div>
            ) : (
              <Carousel
                opts={{
                  align: 'start',
                  loop: true,
                }}
                plugins={[
                  Autoplay({
                    delay: 5000,
                  }),
                ]}
                className="w-full"
              >
                <CarouselContent>
                  {testimonials.map((testimonial) => (
                    <CarouselItem key={testimonial.id}>
                      <div className="bg-[#4a3333] border border-[#6b4949] rounded-xl p-8 h-96 flex flex-col justify-between shadow-lg">
                    
                        

                        {/* Message */}
                        <p className="text-white text-lg leading-relaxed flex-1">
                          {testimonial.message}
                        </p>

                        {/* Name */}
                        <div>
                          <p className="text-white font-semibold">
                            {testimonial.full_name}
                          </p>
                          <p className="text-sm text-gray-400">
                           {new Date(testimonial.created_at).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
})}
                          </p>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16" />
                <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16" />
              </Carousel>
            )}
          </div>

          {/* Form Section */}
          <div className="flex items-center">
            <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-white mb-6">
                Share Your Experience
              </h3>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Full Name Field */}
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-100">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Your name"
                            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                            {...field}
                            disabled={submitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Message Field */}
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-100">Your Testimonial</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Share your experience with us..."
                            className="min-h-32 resize-none bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
                            {...field}
                            disabled={submitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="w-full"
                    size="lg"
                  >
                    {submitting ? (
                      <>
                        <Spinner className="w-4 h-4 mr-2" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Testimonial'
                    )}
                  </Button>

                  <p className="text-xs text-gray-400 text-center">
                    Your testimonial will be reviewed and published after approval.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
