// components/try-on/useTryOnSteps.ts
import { useState } from "react";

export const useTryOnSteps = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 6;

  const next = () => setStep((s) => Math.min(totalSteps, s + 1));
  const prev = () => setStep((s) => Math.max(1, s - 1));
  const reset = () => setStep(1);

  return { step, next, prev, reset, totalSteps };
};
