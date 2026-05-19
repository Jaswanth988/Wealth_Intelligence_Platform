export const fetchNAV = async () => {
  await new Promise((r) => setTimeout(r, 500));

  return {
    nav: Number((50 + Math.random() * 10).toFixed(2)),
  };
};