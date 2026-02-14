"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Package, BadgeDollarSign, Boxes, Calendar } from "lucide-react";

type Goods = {
  id: string;
  sku: string;
  name: string;
  category: string;
  unit: string;
  price: number;
  stock: number;
  expiry?: string;
  supplier: string;
  status: "Đang bán" | "Ngừng bán";
};

const seed: Goods[] = [
  {
    id: "1",
    sku: "FMCG-0001",
    name: "Sữa tươi tiệt trùng 1L",
    category: "Đồ uống",
    unit: "Hộp",
    price: 32000,
    stock: 84,
    expiry: "2026-08-30",
    supplier: "Vinamilk",
    status: "Đang bán",
  },
  {
    id: "2",
    sku: "FMCG-0002",
    name: "Mì gói Hảo Hảo (thùng 30)",
    category: "Thực phẩm",
    unit: "Thùng",
    price: 118000,
    stock: 41,
    expiry: "2026-04-12",
    supplier: "Acecook",
    status: "Đang bán",
  },
  {
    id: "3",
    sku: "FMCG-0003",
    name: "Nước rửa chén 750ml",
    category: "Gia dụng",
    unit: "Chai",
    price: 45000,
    stock: 26,
    supplier: "Sunlight",
    status: "Đang bán",
  },
  {
    id: "4",
    sku: "FMCG-0004",
    name: "Khăn giấy rút (gói)",
    category: "Gia dụng",
    unit: "Gói",
    price: 24000,
    stock: 0,
    supplier: "Pulppy",
    status: "Ngừng bán",
  },
];

function cn(...classes: Array<string | undefined | false>) {
  return classes.filter(Boolean).join(" ");
}

function formatMoney(v: number) {
  return new Intl.NumberFormat("vi-VN").format(v) + " ₫";
}

export function GoodsPage() {
  const [items, setItems] = useState<Goods[]>(seed);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("Tất cả");

  const categories = useMemo(() => {
    const set = new Set(items.map((i) => i.category));
    return ["Tất cả", ...Array.from(set)];
  }, [items]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((i) => {
      const matchesQuery =
        !q ||
        i.name.toLowerCase().includes(q) ||
        i.sku.toLowerCase().includes(q) ||
        i.supplier.toLowerCase().includes(q);
      const matchesCat = category === "Tất cả" || i.category === category;
      return matchesQuery && matchesCat;
    });
  }, [items, query, category]);

  const stats = useMemo(() => {
    const total = items.length;
    const inStock = items.filter((i) => i.stock > 0).length;
    const outOfStock = items.filter((i) => i.stock === 0).length;
    const value = items.reduce((sum, i) => sum + i.price * i.stock, 0);
    return { total, inStock, outOfStock, value };
  }, [items]);

  function addDemoItem() {
    const id = String(Date.now());
    setItems((prev) => [
      {
        id,
        sku: `FMCG-${String(prev.length + 1).padStart(4, "0")}`,
        name: "Mặt hàng mới (demo)",
        category: "Thực phẩm",
        unit: "Cái",
        price: 15000,
        stock: 10,
        expiry: "2026-12-31",
        supplier: "Nhà cung cấp A",
        status: "Đang bán",
      },
      ...prev,
    ]);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm text-slate-500">Dashboard</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
              Quản lý mặt hàng tiêu dùng
            </h1>
            <p className="mt-1 text-sm text-slate-600">
              Frontend demo (dữ liệu giả lập) • Tìm kiếm • Lọc • Bảng quản lý
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={addDemoItem}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2 text-sm font-medium text-white shadow-soft transition hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-200"
            >
              <Plus className="h-4 w-4" />
              Thêm mặt hàng
            </button>
          </div>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Tổng mặt hàng" value={String(stats.total)} icon={<Package className="h-5 w-5" />} />
          <StatCard title="Còn hàng" value={String(stats.inStock)} icon={<Boxes className="h-5 w-5" />} />
          <StatCard title="Hết hàng" value={String(stats.outOfStock)} icon={<Boxes className="h-5 w-5" />} tone="warn" />
          <StatCard title="Giá trị tồn" value={formatMoney(stats.value)} icon={<BadgeDollarSign className="h-5 w-5" />} />
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-soft">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 sm:max-w-md">
              <Search className="h-4 w-4 text-slate-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Tìm theo tên, SKU, nhà cung cấp..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Nhóm:</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-4 focus:ring-brand-100"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-slate-50">
                <tr className="text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                  <Th>SKU</Th>
                  <Th>Tên mặt hàng</Th>
                  <Th>Nhóm</Th>
                  <Th>Đơn vị</Th>
                  <Th>Giá</Th>
                  <Th>Tồn</Th>
                  <Th>Hạn</Th>
                  <Th>Nhà cung cấp</Th>
                  <Th>Trạng thái</Th>
                  <Th></Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((i) => (
                  <tr key={i.id} className="text-sm text-slate-800 hover:bg-slate-50/70">
                    <Td mono>{i.sku}</Td>
                    <Td>
                      <div className="font-medium text-slate-900">{i.name}</div>
                    </Td>
                    <Td>{i.category}</Td>
                    <Td>{i.unit}</Td>
                    <Td className="whitespace-nowrap">{formatMoney(i.price)}</Td>
                    <Td>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                          i.stock === 0
                            ? "bg-rose-50 text-rose-700"
                            : "bg-emerald-50 text-emerald-700"
                        )}
                      >
                        {i.stock === 0 ? "Hết" : i.stock}
                      </span>
                    </Td>
                    <Td className="whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <Calendar className="h-3.5 w-3.5" />
                        {i.expiry ?? "-"}
                      </span>
                    </Td>
                    <Td>{i.supplier}</Td>
                    <Td>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
                          i.status === "Đang bán"
                            ? "bg-brand-50 text-brand-700"
                            : "bg-slate-100 text-slate-700"
                        )}
                      >
                        {i.status}
                      </span>
                    </Td>
                    <Td>
                      <div className="flex justify-end gap-2 pr-4">
                        <button
                          onClick={() => alert("Demo UI: Sửa mặt hàng")}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => setItems((prev) => prev.filter((x) => x.id !== i.id))}
                          className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          Xóa
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={10} className="p-10 text-center text-sm text-slate-500">
                      Không tìm thấy mặt hàng phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

        <footer className="mt-8 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} • Consumer Goods Admin (Demo)
        </footer>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  tone,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  tone?: "warn";
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="mt-1 text-xl font-semibold tracking-tight text-slate-900">{value}</p>
        </div>
        <div
          className={cn(
            "rounded-xl p-2",
            tone === "warn" ? "bg-rose-50 text-rose-700" : "bg-brand-50 text-brand-700"
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3">{children}</th>;
}

function Td({ children, mono }: { children: React.ReactNode; mono?: boolean }) {
  return (
    <td className={cn("px-4 py-3", mono && "font-mono text-xs text-slate-700")}>{children}</td>
  );
}
