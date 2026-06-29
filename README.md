# Product Listing Frontend

This project is a Next.js frontend for managing a product catalog. It provides a simple interface to browse products, add new items, and organize catalog data such as brands, categories, manufacturers, and product details.

## Frontend Guide

### 1. Start the app

From the project folder, install dependencies and run the development server:

```bash
npm install
npm run dev
```

Then open http://localhost:3000 in your browser.

### 2. Main pages

- Home page: shows quick links to browse products or add a new product.
- Products page: view all products, search by name, change product status, delete items, and open detailed views.
- Add Product page: create a new product with name, brand, categories, price, specifications, tags, gallery images, and optional variants.
- Categories, Brands, and Manufacturers pages: organize the catalog structure used by products.

### 3. Recommended workflow

1. Create or confirm categories, brands, and manufacturers.
2. Go to the Add Product page.
3. Fill in the required product details.
4. Add images, specifications, and tags if needed.
5. Save the product and verify it appears on the Products page.

### 4. Useful actions

- Use the search box on the Products page to quickly find items.
- Toggle a product as active or inactive without deleting it.
- Add variants only when a product needs size, color, or other option-based variations.
- Upload gallery images to give each product a richer preview.

### 5. Environment notes

If your frontend needs to talk to a backend API from a different host, set:

```bash
NEXT_PUBLIC_API_URL=http://localhost:5000
```

If this variable is not set, the app will use the current browser origin.

### 6. Common commands

```bash
npm run dev
npm run build
npm run lint
```

## Project structure

### Main folders

- app/: contains all route pages and layouts for the frontend
  - app/page.tsx: landing page
  - app/products/page.tsx: product listing and management UI
  - app/products/add/page.tsx: product creation form
  - app/categories/: category-related pages
  - app/brands/: brand-related pages
  - app/manufacturers/: manufacturer-related pages
  - app/api/: API routes used by the frontend

- components/: reusable UI components used across the app
- lib/: helper functions, utilities, and shared logic
- schema/: validation schemas and form input definitions
- public/: static assets such as images and icons
- types/: shared TypeScript type definitions

### What each area is for

- app/: user-facing screens and routes
- components/: building blocks like forms, cards, and buttons
- lib/: reusable logic and helpers
- schema/: form validation and data structure rules
- public/: images and static files served by the app
- types/: strongly typed data models used across the project

This guide should help a new user understand how to run and use the frontend efficiently.
