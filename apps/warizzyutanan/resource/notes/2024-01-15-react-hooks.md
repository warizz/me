# React Hooks Best Practices

Today I learned about the importance of using `useCallback` and `useMemo` properly.

## Key Takeaways

- `useCallback` should be used when passing functions as dependencies to other hooks
- `useMemo` is great for expensive computations
- Don't overuse them - they have their own overhead

Remember: **Premature optimization is the root of all evil**, but strategic memoization can significantly improve performance in React apps.
