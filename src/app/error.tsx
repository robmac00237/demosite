"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="section">
      <h1>A LITTLE HICCUP.</h1>
      <p>We couldn’t load this part of the demo.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
