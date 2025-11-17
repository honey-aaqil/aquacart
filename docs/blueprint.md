# **App Name**: AquaCart

## Core Features:

- User Registration and Verification: Allows users to register with email and phone, verifying both through email (Brevo SMTP) and phone validation.
- Admin Login: Admin users log in through the standard login page with role-based authentication.
- Product Catalog: Displays products with details such as name, description, price, image, category, quantity, and availability from MongoDB.
- One-Click Order Placement: Users can directly place orders from the cart using their default saved address.
- Order Management: Creates and manages orders in MongoDB, associating them with users and items, including total amount and delivery address.
- Real-time Admin Notification: Uses WebSockets to push real-time notifications to admin clients upon order creation, including order ID, total price, customer name, and customer phone.
- Checkout Confirmation: After order placement, displays a confirmation message: 'Your order is in queue. Our team will contact you to take your order.'

## Style Guidelines:

- Primary color: Deep blue (#1E3A8A) to evoke the aquatic theme and trustworthiness.
- Background color: Light gray-blue (#E5E7EB), a desaturated version of the primary color for a clean background.
- Accent color: Teal (#38B2AC) to complement the blue and add vibrancy to calls to action.
- Body and headline font: 'Inter', a sans-serif font providing a modern and neutral look for readability and UI consistency.
- Use a set of consistent, clean icons sourced from a library like FontAwesome to represent various functions and categories, maintaining a user-friendly interface.
- Maintain a consistent grid-based layout with ample whitespace for readability and easy navigation. Use clear visual hierarchy to guide users through the app.
- Use subtle animations with 'framer-motion', such as the shared element transition for product images from the shop to the product detail view and fade-in effects on product cards, to enhance the user experience without being distracting.