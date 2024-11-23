export const useWebWorker = (swFile: string) => {
  const worker = new Worker(new URL(swFile));
};
