# Copilot Instructions for gws_calc

This project is an Angular-based mobile-first Progressive Web App for capturing food and drink orders.

## Product intent
- The app is used to capture orders for food and beverages
- Orders can be assigned to different tables
- A checkout page shows a final summary of all selected items
- The app should feel fast and simple on smartphones
- Desktop support is secondary to mobile usability

## Key priorities
1. Mobile-first UI
2. Touch-friendly interactions
3. Fast order entry
4. Clear table-based workflow
5. Clear checkout summary
6. PWA-friendly implementation
7. Reuse existing models and services

## Code guidance
- Prefer simple Angular solutions
- Reuse existing services in `src/app/core/services/`
- Reuse existing models in `src/app/core/models/`
- Keep components focused and maintainable
- Avoid unnecessary complexity
- Prefer readable TypeScript types and interfaces
- Use SCSS with responsive mobile-first styling
- Optimize for small screens first
- Keep buttons and interactive elements large enough for touch
- Maintain good performance for mobile devices

## Domain language
- Product = food or drink item
- Table = table to which an order belongs
- Cart = current selection of items
- Order = captured items for a table
- Checkout = final summary before completion

## UI guidance
- Prioritize active table visibility
- Make product selection fast
- Keep checkout easy to scan
- Prefer vertical layouts on mobile
- Avoid cluttered screens
- Highlight quantity, totals, and active context

## When generating code
Always ask:
- Is this mobile first?
- Is this easy to use on a phone?
- Does it fit the table-based order workflow?
- Does it support a simple checkout experience?
- Does it align with the current Angular project structure?
