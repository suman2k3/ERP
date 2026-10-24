import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";
import { chartData, money, type Product } from "@/lib/erp/data";
export function SalesChart({
  period = "Last 6 months",
  accounts = false,
}: {
  period?: string;
  accounts?: boolean;
}) {
  const data =
    period === "This month"
      ? [
          { month: "Week 1", income: 68000, expenses: 32000 },
          { month: "Week 2", income: 79000, expenses: 38000 },
          { month: "Week 3", income: 87000, expenses: 41000 },
          { month: "Week 4", income: 84500, expenses: 51400 },
        ]
      : period === "Last month"
        ? [
            { month: "Week 1", income: 49000, expenses: 29000 },
            { month: "Week 2", income: 62000, expenses: 36000 },
            { month: "Week 3", income: 54000, expenses: 31000 },
            { month: "Week 4", income: 61000, expenses: 31000 },
          ]
        : chartData;
  return (
    <div className="chart-box">
      <ResponsiveContainer width="100%" height="100%">
        {accounts ? (
          <BarChart data={data} barGap={5} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: "var(--font-sans)" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v / 1000}k`}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: "var(--font-sans)" }}
              width={56}
            />
            <Tooltip
              formatter={(v: number) => money(v)}
              contentStyle={{
                background: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: 6,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
              }}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="var(--chart-blue)"
              radius={[3, 3, 0, 0]}
              maxBarSize={24}
            />
            <Bar
              dataKey="expenses"
              name="Expenses"
              fill="var(--chart-green)"
              radius={[3, 3, 0, 0]}
              maxBarSize={24}
            />
          </BarChart>
        ) : (
          <AreaChart data={data} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="sales-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-blue)" stopOpacity={0.16} />
                <stop offset="100%" stopColor="var(--chart-blue)" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 4" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: "var(--font-sans)" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${v / 1000}k`}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12, fontFamily: "var(--font-sans)" }}
              width={56}
            />
            <Tooltip
              formatter={(v: number) => money(v)}
              contentStyle={{
                background: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: 6,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
              }}
            />
            <Area
              type="monotone"
              dataKey="income"
              name="Sales"
              stroke="var(--chart-blue)"
              strokeWidth={2.5}
              fill="url(#sales-fill)"
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
export function StockChart({ products }: { products: Product[] }) {
  const data = [
    { name: "In Stock", value: products.filter((p) => p.stock >= 25).length },
    { name: "Low Stock", value: products.filter((p) => p.stock > 0 && p.stock < 25).length },
    { name: "Out of Stock", value: products.filter((p) => p.stock === 0).length },
  ];
  return (
    <>
      <div className="stock-donut">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={64}
              outerRadius={82}
              paddingAngle={5}
              cornerRadius={4}
              stroke="none"
              startAngle={90}
              endAngle={-270}
            >
              {["var(--chart-blue)", "var(--chart-amber)", "var(--chart-red)"].map((c) => (
                <Cell key={c} fill={c} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: "var(--card)",
                borderColor: "var(--border)",
                borderRadius: 6,
                fontSize: 13,
                fontFamily: "var(--font-sans)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="donut-center">
          <strong>{products.length}</strong>
          <small>Total products</small>
        </div>
      </div>
      <div className="stock-legend">
        {data.map((d, i) => (
          <div key={d.name}>
            <span>
              <i className={`legend-dot ${i === 1 ? "amber" : i === 2 ? "red" : ""}`} />
              {d.name}
            </span>
            <strong>{d.value} products</strong>
          </div>
        ))}
      </div>
    </>
  );
}
