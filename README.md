# The Clicker Hub

Build a polished, responsive multi-tenant ERP UI for The Clicker India based on the attached UI reference image. Focus on UI and realistic interactive frontend prototype, with clear mock data and no claims that authentication or backend persistence is production-ready.

Brand/visual direction: premium modern SaaS, white/light gray canvas, deep navy sidebar, blue accents, gentle shadows, rounded cards, professional typography, clean charts, responsive desktop/tablet/mobile. Use lucide icons and shadcn/ui components. Create an actual app with routes and functional navigation, search/filter controls, dialogs, forms, tabs and table actions.

Required screens and flows:

1. Company selection portal. Show The Clicker India logo/wordmark at the top and a responsive grid of example client cards with logos/wordmarks: BugyBoo, Aash Logistics, Sumiraj, Mieux Display, Electra Cutting, Maitra Consultancy. Clicking a company opens that company's branded login route.
2. Tenant login. Show The Clicker India logo at the top, then the selected client's logo/brand below it, company/domain context, email or username field, password with show/hide, remember me, forgot password, validation and login button. Include back-to-companies action. Let the user switch between example tenant domains in a controlled dropdown. Use a demo login interaction that enters the ERP dashboard without pretending the credentials are securely authenticated; clearly label this as a demo prototype.
3. ERP dashboard for selected tenant: persistent dark navy sidebar, topbar with global search, notifications, date filter, profile menu, selected tenant identity. Summary KPI cards such as total products, stock value, sales this month, expenses. Sales chart and stock-status chart, recent activities and low-stock items table. Use plausible sample data.
4. Stock Management page: product stock table with product image/placeholder, SKU, category, current stock, price, stock status (In Stock/Low Stock/Out of Stock), filters, search, tabs for All Products, Add Products, Stock In, Stock Out, Stock Adjustment. Include working create/edit/view dialogs and demo submit interactions.
5. Inventory Management page: inventory overview cards, tabs/sections for Inventory Overview, Purchase Orders, Suppliers, Categories, Warehouses; searchable/filterable stock ledger/product table with locations and updated dates. Buttons open useful dialogs or views.
6. Account Management page: KPI cards for income, expenses, receivables, payables; tabs Overview, Income, Expenses, Invoices, Payments, Vendors, Reports; chart for income vs expenses, recent transactions table, filters and buttons for creating transaction/invoice/payment with forms.
7. Super Admin area, separate from tenant workspace: Manage Clients, User Logins, Roles & Permissions, ERP Modules, Activity Logs. Build a Super Admin dashboard with client count and statuses; clients table; add/edit client dialog with client name, logo upload/URL, domain, assigned modules, status; User Logins table with assigned tenant, email, role, status; add user dialog. Allow assigning users to clients and configuring module access in the prototype. Provide explicit company-data isolation UX cues.
8. Settings and Reports pages to complete the navigation. Make all key sidebar links navigate to real pages, not dead links.

Use React + TypeScript + Tailwind + shadcn/ui in the project's default stack. Prefer Recharts for charts if available. Use a consistent component system, accessible labels, empty/error states and toast feedback. Make controls actually work locally through component state and sample in-memory data; keep data structures ready for a future backend. Tenant route/state must control displayed logo/name and sample context. The UI should communicate that Super Admin provisions client logins and assigns module permissions, and clients only see their assigned modules. Do not expose super-admin navigation within a regular client account. Make the main visual quality high and match the reference: company chooser/login panels at the entrance, then a dashboard with sidebar and polished KPI/chart/table layout.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/b3414f5a-8f66-4e4d-a1a6-e3a0c26987d7).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
