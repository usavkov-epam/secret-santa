/**
 * Creates a progress bar for a command.
 * @param currentStep The current step index.
 * @param totalSteps The total number of steps.
 * @returns A progress bar string.
 */
export function getProgressBar(currentStep: number, totalSteps: number): string {
  const progress = Math.round(((currentStep + 1) / totalSteps) * 10);

  return `[${'█'.repeat(progress)}${'░'.repeat(10 - progress)}] ${currentStep + 1}/${totalSteps}`;
}
