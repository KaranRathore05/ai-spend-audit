# Tests

This project includes tests to ensure the deterministic audit engine is accurate.

## Running Tests
Run the test suite using Vitest:
```bash
npm run test
```

## Test Coverage
- `tests/audit-engine.test.ts`
  - **Test 1:** Cursor Teams with 2 users recommends downgrade.
  - **Test 2:** Duplicate Cursor + Copilot detects overlap savings.
  - **Test 3:** API spend over $300 recommends Credex/credits savings.
  - **Test 4:** Low spend optimized stack returns honest "excellent" health.
  - **Test 5:** Seats greater than team size recommends seat reduction.
  - **Test 6:** High savings over $500 triggers high-opportunity.
  - **Test 7:** AI failure does not break audit because fallback summary works (handled in endpoint test/logic).
