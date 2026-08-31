import { useForm, ValidationError } from "@formspree/react";

const inputClass =
  "mt-1 block w-full rounded border border-slate-300 px-3 py-2 text-sm focus:border-teal focus:outline-none focus:ring-1 focus:ring-teal";

export function ContactForm() {
  const [state, handleSubmit] = useForm("mnpqpavq");

  if (state.succeeded) {
    return (
      <div className="mt-8 max-w-lg rounded border border-teal/30 bg-teal-light px-5 py-6 text-center">
        <p className="font-display text-lg font-semibold text-ink">Thanks — message sent.</p>
        <p className="mt-2 text-sm text-slate-600">
          We'll get back to you shortly to set up a walkthrough.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 grid gap-4 max-w-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-ink">
          Name
        </label>
        <input id="name" name="name" type="text" required className={inputClass} />
        <ValidationError prefix="Name" field="name" errors={state.errors} className="mt-1 text-xs text-red-600" />
      </div>
      <div>
        <label htmlFor="pharmacy" className="block text-sm font-medium text-ink">
          Pharmacy name
        </label>
        <input id="pharmacy" name="pharmacy" type="text" required className={inputClass} />
        <ValidationError
          prefix="Pharmacy name"
          field="pharmacy"
          errors={state.errors}
          className="mt-1 text-xs text-red-600"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-ink">
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
        <ValidationError prefix="Email" field="email" errors={state.errors} className="mt-1 text-xs text-red-600" />
      </div>
      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-ink">
          Phone (optional)
        </label>
        <input id="phone" name="phone" type="tel" className={inputClass} />
        <ValidationError prefix="Phone" field="phone" errors={state.errors} className="mt-1 text-xs text-red-600" />
      </div>
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-ink">
          Message
        </label>
        <textarea id="message" name="message" rows={4} className={inputClass} />
        <ValidationError
          prefix="Message"
          field="message"
          errors={state.errors}
          className="mt-1 text-xs text-red-600"
        />
      </div>
      <button
        type="submit"
        disabled={state.submitting}
        className="mt-2 inline-flex items-center justify-center rounded bg-teal-dark px-6 py-3 font-semibold text-white transition hover:bg-teal hover:-translate-y-0.5 active:scale-95 disabled:opacity-60 disabled:pointer-events-none"
      >
        {state.submitting ? "Sending…" : "Send"}
      </button>
    </form>
  );
}
