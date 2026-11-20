/** Browser-only simulation. Accepts no customer details; no network or storage. */
export async function simulateCheckout(): Promise<{
  reference: string;
  simulated: true;
}> {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return {
    reference: `DEMO-${crypto.randomUUID().slice(0, 8).toUpperCase()}`,
    simulated: true,
  };
}
