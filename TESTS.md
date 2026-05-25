# Testing Strategy

## Unit Tests (Logic Validation)
We validate the core audit engine to ensure pricing accuracy:
1. **`calculateSavings()`:** Verify that it correctly identifies savings when a user switches from "Individual" plans to a "Team" plan.
2. **`inputValidation()`:** Ensure the tool returns an error or a prompt when invalid numbers (e.g., negative seats) are provided.
3. **`apiResponseHandling()`:** Test how the application behaves when the Anthropic/OpenAI API is unreachable (graceful degradation).

## Integration Tests
1. **End-to-End Audit Flow:** Confirm the user input travels from the form to the backend engine and results are returned correctly to the UI.
2. **Lead Capture:** Verify that an email input successfully triggers a write to the Supabase database.

## Manual/Edge Case Testing
* **Empty State:** Tested that the audit summary displays a friendly message when no data is provided.
* **Mobile Responsiveness:** Tested the audit form on iPhone/Android browsers to ensure inputs are accessible.
* **Large Numbers:** Checked that inputting a high number of seats (e.g., 500+) doesn't break the UI layout or calculation display.