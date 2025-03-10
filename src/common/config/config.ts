export default () => ({
  auth: {
    maxFailedAttempts: 5,
    blockTime: 5 * 60 * 1000,
  },
});
