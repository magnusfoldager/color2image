# Specifications

## Functionality
The user selects a color or inputs hex/rgb/etc. and specifies image dimensions and file size to create an image of that dimension with full color.
On page initialisation a random color from a pre-defined set of tailwind colors in either dark or light mode depending on user preference is selected and loaded into the form.

## Tech
React + Vite, deployed to GH Pages. Everything needs to happen on-page and in JS.

## Design
Use Tailwind for design. Use a Stripe-like design approach.
- Use Tailwind Zinc for grays and whites. Do not use colors for buttons, etc.
- The page background is always equal to the selected color.
- Centered container box with dark or white background.