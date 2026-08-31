import { useEffect, useRef, useState } from "react";
import { TestimonialsColumn, type Testimonial } from "./testimonials-columns-1";
import { useIsMobile } from "./useIsMobile";

function useInView<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

const testimonials: Testimonial[] = [
  {
    text: "The customer credit ledger alone was worth switching for. I can finally show a customer exactly which sale a disputed charge came from.",
    name: "Denise Okafor",
    role: "Pharmacist-in-Charge, Cedar Grove Pharmacy",
    initials: "DO",
    hue: "#1D9E75",
  },
  {
    text: "Catalogue import matched our McKesson file on the first try. No re-keying two thousand line items by hand like we did with Fillware.",
    name: "Marcus Whitfield",
    role: "Owner, Whitfield Family Drug",
    initials: "MW",
    hue: "#085041",
  },
  {
    text: "Split-tender checkout used to mean a workaround and a sticky note. Now it just works at the register, every time.",
    name: "Priya Natarajan",
    role: "Store Manager, Riverside Rx",
    initials: "PN",
    hue: "#4E564F",
  },
  {
    text: "Onboarding was hands-on, not a video link. Someone paired our scanner and card reader in person before we ever rang up a sale.",
    name: "Teodoro Salcedo",
    role: "Pharmacy Technician Lead, Salcedo Pharmacy",
    initials: "TS",
    hue: "#1D9E75",
  },
  {
    text: "Our monthly reports finally net out refunds and discounts correctly. I stopped reconciling by hand in a spreadsheet on Sundays.",
    name: "Abigail Fenwick",
    role: "Pharmacist-in-Charge, Fenwick Compounding",
    initials: "AF",
    hue: "#085041",
  },
  {
    text: "Tiered pricing for our senior and cash-pay customers used to live in someone's head. Now it is configured once and applied correctly.",
    name: "Rashid Aziz",
    role: "Owner, Aziz Family Pharmacy",
    initials: "RA",
    hue: "#4E564F",
  },
  {
    text: "When our regular pharmacist called out sick, a backup covered the shift without needing a crash course on the register.",
    name: "Colette Marchetti",
    role: "Operations Manager, Marchetti Pharmacy Group",
    initials: "CM",
    hue: "#1D9E75",
  },
  {
    text: "The refund flow shows exactly what it is reversing instead of just a negative number on the tape. Audits take a fraction of the time now.",
    name: "Jamal Whitcombe",
    role: "Pharmacist-in-Charge, Whitcombe Drug Co.",
    initials: "JW",
    hue: "#085041",
  },
  {
    text: "We tried two other systems before this one. Vantis was the first that felt like it was built by someone who had actually worked a register.",
    name: "Yuki Tanabe",
    role: "Owner, Tanabe Family Pharmacy",
    initials: "YT",
    hue: "#4E564F",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
  const heading = useInView<HTMLDivElement>();
  const columns = useInView<HTMLDivElement>();
  const isMobile = useIsMobile();

  return (
    <div>
      <div
        ref={heading.ref}
        className={`max-w-2xl motion-safe:transition motion-safe:duration-700 motion-safe:ease-out ${
          heading.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
          What independent pharmacies are saying.
        </h2>
        <p className="mt-4 text-slate-600">
          Feedback from pharmacists and owners who moved off legacy systems
          like Fillware onto Vantis.
        </p>
      </div>

      <div
        ref={columns.ref}
        className={`flex justify-center gap-6 mt-10 md:[mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] md:[-webkit-mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] md:max-h-[640px] md:overflow-hidden motion-safe:transition motion-safe:duration-700 motion-safe:ease-out ${
          isMobile || columns.inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
        }`}
      >
        <TestimonialsColumn testimonials={firstColumn} duration={17} />
        <TestimonialsColumn
          testimonials={secondColumn}
          className="hidden md:block"
          duration={21}
        />
        <TestimonialsColumn
          testimonials={thirdColumn}
          className="hidden lg:block"
          duration={19}
        />
      </div>
    </div>
  );
}
