# Security Specification for Veloura Furniture

## Data Invariants
1. **Products**: Publicly readable. Modifiable only by users with the `admin` role.
2. **Categories**: Publicly readable. Modifiable only by `admin`.
3. **Users**: A user can only read and write their own profile document. The `role` field is immutable for the user themselves (only settable by a pre-existing admin or during initial system bootstrapping).
4. **Orders**:
   - Customers can create orders (if they are the owner).
   - Customers can read their own orders.
   - Only Admins can list all orders or update order status.
   - `totalAmount` must match the sum of items (validated on creation).
   - `createdAt` is immutable.

## The Dirty Dozen Payloads (Rejection Targets)
1. Creating a product as a regular user.
2. Updating product price as a regular user.
3. Reading another user's private profile.
4. Setting one's own role to `admin` during registration.
5. Reading someone else's order list.
6. Changing another user's order status to `shipped`.
7. Creating an order with a mismatched `userId`.
8. Injecting a massive 1MB string into a product name.
9. Deleting a category as a regular user.
10. Updating `createdAt` on an existing order.
11. Bypassing state logic by setting status to `delivered` immediately.
12. Listing all users as a regular customer.

## Test Runner
The following rules will be verified against these rejection targets.
