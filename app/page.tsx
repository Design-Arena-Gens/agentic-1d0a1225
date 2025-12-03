/* eslint-disable @next/next/no-img-element */
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Moon, Printer, RefreshCcw, BellRing, Plus, Save, Edit, Trash2, RadioTower } from "lucide-react";
import clsx from "clsx";
import { v4 as uuid } from "uuid";

type Entry = {
  id: string;
  plateNumber: string;
  yukBilan: number;
  yuksiz: number;
  sofVazin: number;
  date: string;
  summa: string;
  addonCheckNumber: string;
  price: number;
};

type FormState = {
  plateNumber: string;
  yukBilan: string;
  yuksiz: string;
  sofVazin: string;
  date: string;
  summa: string;
  addonCheckNumber: string;
  price: string;
};

const initialForm: FormState = {
  plateNumber: "",
  yukBilan: "",
  yuksiz: "",
  sofVazin: "0",
  date: "",
  summa: "",
  addonCheckNumber: "",
  price: ""
};

const camelLogo =
  "https://images.unsplash.com/photo-1509644851207-8dad5a6d065f?auto=format&fit=crop&w=400&q=80";

export default function HomePage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [alarmPulse, setAlarmPulse] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => setAlarmPulse((prev) => !prev), 1500);
    return () => clearInterval(timer);
  }, []);

  const handleFormChange = useCallback((field: keyof FormState, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "yukBilan" || field === "yuksiz") {
        const yukBilanValue = parseFloat(field === "yukBilan" ? value : next.yukBilan) || 0;
        const yuksizValue = parseFloat(field === "yuksiz" ? value : next.yuksiz) || 0;
        const sof = Math.max(yukBilanValue - yuksizValue, 0);
        next.sofVazin = sof.toString();
      }
      return next;
    });
  }, []);

  const resetForm = useCallback(() => {
    setForm(initialForm);
    setEditingId(null);
  }, []);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const payload: Entry = {
        id: editingId ?? uuid(),
        plateNumber: form.plateNumber.trim(),
        yukBilan: parseFloat(form.yukBilan) || 0,
        yuksiz: parseFloat(form.yuksiz) || 0,
        sofVazin: parseFloat(form.sofVazin) || 0,
        date: form.date,
        summa: form.summa.trim(),
        addonCheckNumber: form.addonCheckNumber.trim(),
        price: parseFloat(form.price) || 0
      };

      if (!payload.plateNumber) {
        return;
      }

      setEntries((prev) => {
        if (editingId) {
          return prev.map((item) => (item.id === editingId ? payload : item));
        }
        return [payload, ...prev];
      });

      resetForm();
    },
    [editingId, form, resetForm]
  );

  const handleEdit = useCallback(
    (entry: Entry) => {
      setEditingId(entry.id);
      setForm({
        plateNumber: entry.plateNumber,
        yukBilan: entry.yukBilan.toString(),
        yuksiz: entry.yuksiz.toString(),
        sofVazin: entry.sofVazin.toString(),
        date: entry.date,
        summa: entry.summa,
        addonCheckNumber: entry.addonCheckNumber,
        price: entry.price ? entry.price.toString() : ""
      });
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    []
  );

  const handleDelete = useCallback((id: string) => {
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }, []);

  const handleRelay = useCallback(() => {
    setAlarmPulse(false);
    setTimeout(() => setAlarmPulse(true), 150);
  }, []);

  const handlePrint = useCallback(() => {
    if (typeof window !== "undefined") {
      window.print();
    }
  }, []);

  const handleReload = useCallback(() => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  }, []);

  const filteredEntries = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return entries.map((entry) => {
      const match =
        term.length === 0
          ? false
          : entry.plateNumber.toLowerCase().includes(term) ||
            entry.summa.toLowerCase().includes(term) ||
            entry.addonCheckNumber.toLowerCase().includes(term) ||
            entry.date.toLowerCase().includes(term) ||
            entry.yukBilan.toString().includes(term) ||
            entry.yuksiz.toString().includes(term) ||
            entry.sofVazin.toString().includes(term) ||
            entry.price.toString().includes(term);

      return { entry, match };
    });
  }, [entries, searchTerm]);

  const quickSumma = useCallback((value: string) => {
    setForm((prev) => ({ ...prev, summa: value }));
  }, []);

  const quickPrice = useCallback((value: number) => {
    setForm((prev) => ({ ...prev, price: value.toString() }));
  }, []);

  return (
    <main className="min-h-screen bg-transparent">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 text-white">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/20 bg-black/60 p-6 backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="relative h-14 w-20 overflow-hidden rounded-xl border border-white/10 bg-black/50">
              <Image
                src={camelLogo}
                alt="Camel convoy logo"
                fill
                className="object-cover"
                sizes="80px"
                priority
              />
            </div>
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-wide">Desert Camel Freight</h1>
              <p className="text-sm text-white/70">Field console for weight declarations</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={clsx(
                "flex items-center gap-2 rounded-full border border-alarm-red/60 bg-alarm-red/20 px-4 py-2 text-sm font-medium uppercase tracking-[0.2em]",
                alarmPulse && "animate-pulseAlarm"
              )}
            >
              <BellRing className="h-4 w-4 text-red-400" />
              Active Alarm
            </div>
            <button
              type="button"
              onClick={handleRelay}
              className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:border-white/40 hover:bg-white/20"
            >
              <RadioTower className="h-4 w-4" />
              Relay
            </button>
          </div>
        </header>

        <section className="grid gap-6 rounded-3xl border border-white/15 bg-black/65 p-6 backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <form
              className="flex flex-1 items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-2"
              onSubmit={(event) => event.preventDefault()}
            >
              <Moon className="h-5 w-5 text-blue-200/80" />
              <input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search manifest..."
                className="w-full bg-transparent font-medium text-white placeholder:text-white/50 focus:outline-none"
              />
            </form>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={handlePrint}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:border-white/40 hover:bg-white/20"
              >
                <Printer className="h-4 w-4" />
                Print
              </button>
              <button
                type="button"
                onClick={handleReload}
                className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold hover:border-white/40 hover:bg-white/20"
              >
                <RefreshCcw className="h-4 w-4" />
                Reload
              </button>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 text-sm md:grid-cols-2"
          >
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/60">Plate Number</label>
              <input
                required
                value={form.plateNumber}
                onChange={(event) => handleFormChange("plateNumber", event.target.value)}
                placeholder="Enter plate number"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-semibold text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/60">Add-on Check Number</label>
              <input
                value={form.addonCheckNumber}
                onChange={(event) => handleFormChange("addonCheckNumber", event.target.value)}
                placeholder="Check number"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-semibold text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/60">Yuk bilan (Kg)</label>
              <input
                type="number"
                min="0"
                value={form.yukBilan}
                onChange={(event) => handleFormChange("yukBilan", event.target.value)}
                placeholder="Weight with load"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-semibold text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/60">Yuksiz (Kg)</label>
              <input
                type="number"
                min="0"
                value={form.yuksiz}
                onChange={(event) => handleFormChange("yuksiz", event.target.value)}
                placeholder="Weight without load"
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-semibold text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/60">Sof Vazin (Kg)</label>
              <input
                type="number"
                min="0"
                value={form.sofVazin}
                onChange={(event) => handleFormChange("sofVazin", event.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-semibold text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
              />
              <p className="text-xs text-white/50">Automatically calculated as Yuk bilan - Yuksiz.</p>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/60">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(event) => handleFormChange("date", event.target.value)}
                className="rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-semibold text-white focus:border-white/40 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/60">Summa</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={form.summa}
                  onChange={(event) => handleFormChange("summa", event.target.value)}
                  placeholder="Enter amount"
                  className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-semibold text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => quickSumma("30,000")}
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold hover:border-white/40 hover:bg-white/20"
                  >
                    30,000
                  </button>
                  <button
                    type="button"
                    onClick={() => quickSumma("40,000")}
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold hover:border-white/40 hover:bg-white/20"
                  >
                    40,000
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-white/60">Price (USD)</label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(event) => handleFormChange("price", event.target.value)}
                  placeholder="Set price"
                  className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 font-semibold text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => quickPrice(30000)}
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold hover:border-white/40 hover:bg-white/20"
                  >
                    30k
                  </button>
                  <button
                    type="button"
                    onClick={() => quickPrice(40000)}
                    className="rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold hover:border-white/40 hover:bg-white/20"
                  >
                    40k
                  </button>
                </div>
              </div>
            </div>

            <div className="md:col-span-2 flex flex-wrap items-center gap-3 pt-2">
              <button
                type="submit"
                className="flex items-center gap-2 rounded-xl border border-primary/40 bg-primary/80 px-5 py-3 text-sm font-semibold uppercase tracking-wide text-white shadow-lg shadow-primary/30 transition hover:border-primary hover:bg-primary"
              >
                {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                {editingId ? "Update Entry" : "Add Entry"}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded-xl border border-white/30 bg-white/10 px-5 py-3 text-sm font-semibold uppercase tracking-wide hover:border-white/50 hover:bg-white/20"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="rounded-3xl border border-white/20 bg-black/70 p-6 text-sm backdrop-blur-xl">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left text-xs uppercase tracking-[0.2em] text-white/60">
              <thead>
                <tr>
                  <th className="px-4 py-3">Plate_Number</th>
                  <th className="px-4 py-3">Yuk_bilan</th>
                  <th className="px-4 py-3">Sana (Date)</th>
                  <th className="px-4 py-3">Yuksiz</th>
                  <th className="px-4 py-3">Sof_Vazin</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Summa</th>
                  <th className="px-4 py-3">Check No.</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-base tracking-normal">
                {filteredEntries.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-8 text-center text-white/50">
                      No manifest entries yet. Add cargo details above.
                    </td>
                  </tr>
                ) : (
                  filteredEntries.map(({ entry, match }) => (
                    <tr
                      key={entry.id}
                      className={clsx(
                        "transition hover:bg-white/5",
                        searchTerm && match ? "text-red-400" : "text-white"
                      )}
                    >
                      <td className="px-4 py-3 font-semibold">{entry.plateNumber}</td>
                      <td className="px-4 py-3">{entry.yukBilan.toLocaleString()}</td>
                      <td className="px-4 py-3">{entry.date}</td>
                      <td className="px-4 py-3">{entry.yuksiz.toLocaleString()}</td>
                      <td className="px-4 py-3">{entry.sofVazin.toLocaleString()}</td>
                      <td className="px-4 py-3">${entry.price.toLocaleString()}</td>
                      <td className="px-4 py-3">{entry.summa}</td>
                      <td className="px-4 py-3">{entry.addonCheckNumber}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(entry)}
                            className="rounded-lg border border-white/20 bg-white/10 p-2 hover:border-white/40 hover:bg-white/20"
                          >
                            <Edit className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(entry.id)}
                            className="rounded-lg border border-red-400/40 bg-red-500/20 p-2 text-red-200 hover:border-red-300/80 hover:bg-red-400/30"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}
