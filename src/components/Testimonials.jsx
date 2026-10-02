import TestimonialAvatar from "@/components/TestimonialAvatar";
import { getPublishedTestimonials } from "@/lib/testimonials";

const initials = (name) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");

// Published testimonials, managed from /admin/testimonials. Renders nothing until at least one is published.
export default async function Testimonials() {
  const testimonials = await getPublishedTestimonials();
  if (!testimonials.length) return null;

  return (
    <div className="py-4 sm:py-4">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What Our Clients Say About Us</h2>
        </div>
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-border pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {testimonials.map((testimonial) => {
            const subtitle = [testimonial.role, testimonial.company].filter(Boolean).join(", ");
            return (
              <figure key={testimonial._id} className="flex max-w-xl flex-col items-start justify-between">
                <blockquote className="text-sm leading-6">
                  <p>&ldquo;{testimonial.quote}&rdquo;</p>
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-x-4">
                  {testimonial.avatarPublicId ? (
                    <TestimonialAvatar publicId={testimonial.avatarPublicId} size={40} className="h-10 w-10" />
                  ) : (
                    <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground ring-1 ring-border">
                      {initials(testimonial.name)}
                    </span>
                  )}
                  <div className="text-sm leading-6">
                    <p className="font-semibold">{testimonial.name}</p>
                    {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
                  </div>
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </div>
  );
}
