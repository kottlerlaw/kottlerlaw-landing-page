"use client";

import { useActionState, useState } from "react";
import {
  sendContactMessage,
  type ContactField,
  type ContactState
} from "@/app/actions/contact";
import { phoneDisplay } from "./site";

const initialState: ContactState = { status: "idle" };

export function LeadForm({ title, id }: { title: string; id: string }) {
  const [state, formAction, pending] = useActionState(
    sendContactMessage,
    initialState
  );
  const [dismissed, setDismissed] = useState<ContactState | null>(null);
  const sent = state.status === "success" && dismissed !== state;

  const err = (field: ContactField) => state.errors?.[field];
  const fieldProps = (field: ContactField) => ({
    "aria-invalid": err(field) ? true : undefined,
    "aria-describedby": err(field) ? `${id}-${field}-error` : undefined
  });
  const errorText = (field: ContactField) =>
    err(field) ? (
      <span id={`${id}-${field}-error`} className="v2-error">
        {err(field)}
      </span>
    ) : null;

  return (
    <form
      action={formAction}
      id={id}
      className="rounded-sm bg-white p-7 text-[#14213a] shadow-[0_30px_60px_-25px_rgba(0,0,0,.6)] sm:p-9"
    >
      {sent ? (
        <div
          role="status"
          className="flex min-h-[420px] flex-col items-center justify-center text-center"
        >
          <p className="font-serif text-5xl">Thank you.</p>
          <p className="v2-body mt-4 max-w-sm">
            We received your request. A member of our team will contact you
            shortly.
          </p>
          <button
            type="button"
            className="mt-6 text-lg font-bold text-[#7a520c] underline"
            onClick={() => setDismissed(state)}
          >
            Send another request
          </button>
        </div>
      ) : (
        <>
          <h3 className="text-[1.9rem] leading-tight font-extrabold tracking-tight uppercase">
            {title}
          </h3>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="v2-label">
              First name
              <input
                required
                name="first"
                autoComplete="given-name"
                maxLength={80}
                defaultValue={state.values?.first}
                {...fieldProps("first")}
              />
              {errorText("first")}
            </label>
            <label className="v2-label">
              Last name
              <input
                required
                name="last"
                autoComplete="family-name"
                maxLength={80}
                defaultValue={state.values?.last}
                {...fieldProps("last")}
              />
              {errorText("last")}
            </label>
            <label className="v2-label">
              Phone
              <input
                required
                name="phone"
                type="tel"
                autoComplete="tel"
                maxLength={25}
                defaultValue={state.values?.phone}
                {...fieldProps("phone")}
              />
              {errorText("phone")}
            </label>
            <label className="v2-label">
              Email
              <input
                name="email"
                type="email"
                autoComplete="email"
                maxLength={200}
                defaultValue={state.values?.email}
                {...fieldProps("email")}
              />
              {errorText("email")}
            </label>
            <label className="v2-label sm:col-span-2">
              Tell us what happened
              <textarea
                name="message"
                rows={3}
                maxLength={5000}
                defaultValue={state.values?.message}
                {...fieldProps("message")}
              />
              {errorText("message")}
            </label>
          </div>
          {/* Honeypot for bots; hidden from people and assistive tech. */}
          <input
            type="text"
            name="company"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          <label className="mt-5 flex items-start gap-3 text-base leading-snug text-[#46526a]">
            <input
              required
              type="checkbox"
              name="consent"
              className="mt-1 h-5 w-5 shrink-0 accent-[#14213a]"
              {...fieldProps("consent")}
            />
            I agree to be contacted about my case. Submitting this form does not
            create an attorney-client relationship.
          </label>
          {errorText("consent")}
          {state.status === "error" && state.message && (
            <p role="alert" className="v2-error mt-5">
              {state.message}
            </p>
          )}
          <button
            type="submit"
            disabled={pending}
            aria-busy={pending}
            className="v2-btn v2-btn-gold mt-6 w-full !text-xl tracking-wide uppercase disabled:cursor-wait disabled:opacity-70"
          >
            {pending ? "Sending…" : "Get my free case consultation"}
          </button>
        </>
      )}
    </form>
  );
}

