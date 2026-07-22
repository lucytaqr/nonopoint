# Frontend and Public Ordering System Planning

## Objective
Develop the public-facing ordering system for the web application using Next.js App Router, Tailwind CSS, Zustand for local state management, and Supabase for the database.

## Requirements and Features

1.  **Public Menu Page (`app/(public)/page.tsx`)**
    *   Fetch and display a list of active menu items from the `menu_items` table.
    *   Include a user interface for adding items to a local cart.

2.  **Local Cart Management (Zustand)**
    *   Implement a Zustand store (`src/store/useCartStore.ts`) to handle cart state.
    *   Features: Add item, remove item, update quantity, clear cart, calculate total price.
    *   Persist cart data locally (e.g., using Zustand's `persist` middleware) so items are not lost on refresh.

3.  **Checkout Form**
    *   Fields: Customer Name, Phone Number, Delivery Method (Pickup / Delivery).
    *   **Delivery Rules:** If the user selects "Delivery", the system **MUST** request GPS access to obtain `address_lat` and `address_lng`. Additionally, a text input for "Patokan Alamat" (Address Landmark) must be shown and is required.
    *   If the user selects "Pickup", GPS and Patokan Alamat are not required.

4.  **Order Submission (Server Action)**
    *   Create a Next.js Server Action (`src/actions/order.ts`) to handle the checkout submission.
    *   The action will insert the order data into the `orders` table.
    *   It must also insert the corresponding items into the `order_items` table within a transaction or secure sequential flow.
    *   *Note: The `order_no` is generated automatically at the database level by the previously configured trigger.*

5.  **"Cek Pesanan" (Check Order) Feature**
    *   Create a dedicated tab or page (e.g., `app/(public)/cek-pesanan/page.tsx`) where users can input their phone number.
    *   Query the `orders` table matching the input phone number.
    *   Display the order history, current status, and total for that user.

## Implementation Steps

### Phase 1: State Management & Types
1.  **Define Types:** Create TypeScript interfaces in `src/types/index.ts` for `MenuItem`, `CartItem`, and `Order`.
2.  **Setup Zustand Store:** Create `src/store/useCartStore.ts` utilizing `create` and `persist` to manage the cart state (items array, add, remove, clear, total calculation).

### Phase 2: Public UI Construction
3.  **App Router Setup:** Create the Route Group folder `src/app/(public)` and set up `layout.tsx` (for a global navigation bar with cart and "Cek Pesanan" links) and `page.tsx` (for the menu).
4.  **Menu Display:** In `page.tsx`, fetch `menu_items` from Supabase where `is_active = true`. Map through the items to render menu cards with "Add to Cart" buttons.
5.  **Cart Component:** Build a UI component (e.g., a slide-out sidebar or a dedicated checkout page) that reads from the Zustand store and displays selected items, adjustable quantities, and the total price.

### Phase 3: Checkout & Geolocation
6.  **Checkout Form Component:** Build the form UI collecting name, phone, and delivery method.
7.  **Geolocation Integration:** Conditionally use the browser's `navigator.geolocation.getCurrentPosition` API when "Delivery" is selected. Handle permission prompts and store the latitude and longitude in the component state.
8.  **Landmark Input:** Dynamically render the "Patokan Alamat" text area only when the Delivery method is active.

### Phase 4: Server Actions & Database Submission
9.  **Server Action (`src/actions/order.ts`):** 
    *   Implement an asynchronous function `submitOrder(payload)`.
    *   Validate the incoming payload (Name, Phone, Items, etc.).
    *   Insert into `public.orders` using the Supabase server client.
    *   Retrieve the inserted `order.id` (and the auto-generated `order_no`).
    *   Map the cart items and execute a bulk insert into `public.order_items`.
10. **Connect UI to Action:** Hook the checkout form submission to call the server action. On success, clear the Zustand cart, show a success modal with the `order_no`, and potentially redirect the user.

### Phase 5: Check Order Status
11. **Check Order UI:** Create the `src/app/(public)/cek-pesanan/page.tsx` page.
12. **Search Logic:** Build a form with a single phone number input field.
13. **Fetch & Display:** Use a Server Action or direct Supabase client fetch to query `orders` where `phone` matches the input. Display the results in a list or table format, highlighting the `status` (e.g., 'new', 'processing', 'completed') and `order_no`.
