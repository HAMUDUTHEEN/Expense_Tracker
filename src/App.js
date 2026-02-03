import React, { useState, useEffect, useMemo } from "react";
import { Line, Pie } from "react-chartjs-2";
import { motion, AnimatePresence } from "framer-motion";
import logo from "./money.gif";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend
);

function App() {
  // ✅ STATE - Initializing directly from LocalStorage to avoid effect desync
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("expenses");
    return saved ? JSON.parse(saved) : [];
  });
  
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");

  const categories = ["Food", "Travel", "Shopping", "Rent", "Other"];

  // ✅ SAVE TO LOCALSTORAGE
  useEffect(() => {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }, [expenses]);

  // ✅ ADD EXPENSE
  const addExpense = () => {
    if (!title || !amount) return;
    const newExpense = {
      id: Date.now(),
      title,
      amount: Number(amount),
      category,
      date: new Date().toLocaleDateString(),
    };
    setExpenses([...expenses, newExpense]);
    setTitle("");
    setAmount("");
  };

  // ✅ REMOVE INDIVIDUAL EXPENSE
  const removeExpense = (id) => {
    setExpenses(expenses.filter((e) => e.id !== id));
  };

  // ✅ CLEAR ALL EXPENSES
  const clearAll = () => {
    if (window.confirm("Are you sure you want to delete all expenses?")) {
      setExpenses([]);
    }
  };

  // ✅ MEMOIZED DATA (Optimized)
  const total = expenses.reduce((sum, e) => sum + e.amount, 0);

  // ✅ UPDATED MEMOIZED DATA (Pink & Violet Theme)
const lineData = useMemo(() => ({
  labels: expenses.map((e) => e.date),
  datasets: [{
    label: "Expenses",
    data: expenses.map((e) => e.amount),
    borderColor: "#db2777", // Pink-600
    backgroundColor: "rgba(219, 39, 119, 0.2)",
    tension: 0.4,
    fill: true,
  }],
}), [expenses]);

const pieData = useMemo(() => ({
  labels: categories,
  datasets: [{
    data: categories.map((cat) =>
      expenses
        .filter((e) => e.category === cat)
        .reduce((sum, e) => sum + e.amount, 0)
    ),
    // Mechanical/Modern Palette: Pink, Violet, Rose, Indigo, Slate
    backgroundColor: ["#db2777", "#7c3aed", "#fb7185", "#6366f1", "#475569"],
    borderWidth: 2,
    borderColor: "#ffffff",
  }],
}), [expenses]);

  return (
  <div className="min-h-screen bg-gray-100 p-6">
    
    {/* --- BRANDING HEADER --- */}
    <div className="flex flex-col items-center justify-center mb-10">
      <motion.img 
        src={logo} 
        alt="Logo" 
        className="w-20 h-20 drop-shadow-lg"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      />
      <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600 mt-2">
        Hamath's Expense Tracker
      </h1>
    </div>

    <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
      {/* ADD EXPENSE FORM */}
      <motion.div whileHover={{ scale: 1.01 }} className="bg-white p-5 rounded-xl shadow-md border-t-4 border-pink-500">
        <h2 className="text-xl font-semibold mb-3 text-gray-700">Add Expense</h2>
        <input className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-pink-400 outline-none" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-pink-400 outline-none" type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <select className="w-full p-2 border rounded mb-2 focus:ring-2 focus:ring-pink-400 outline-none" value={category} onChange={(e) => setCategory(e.target.value)}>
          {categories.map((c) => <option key={c}>{c}</option>)}
        </select>
        <button onClick={addExpense} className="w-full bg-gradient-to-r from-pink-600 to-violet-600 text-white py-2 rounded font-bold hover:opacity-90 transition shadow-lg">
          Add Expense
        </button>
      </motion.div>

      {/* SUMMARY SECTION */}
      <div className="bg-white p-5 rounded-xl shadow-md border-t-4 border-violet-500">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-xl font-semibold text-gray-700">Summary</h2>
          <span className="text-lg font-bold text-pink-600">Total: ₹{total}</span>
        </div>
        <div className="h-40">
          <Line data={lineData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>

    {/* PIE CHART */}
    {expenses.length > 0 && (
      <div className="max-w-4xl mx-auto mt-6 bg-white p-5 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-3 text-center text-gray-700">Category Breakdown</h2>
        <div className="flex justify-center h-64">
          <Pie data={pieData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    )}

    {/* EXPENSE LIST */}
    <div className="max-w-4xl mx-auto mt-6">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-semibold text-gray-700">Recent History</h2>
        {expenses.length > 0 && (
          <button onClick={clearAll} className="text-sm text-red-500 hover:underline font-medium">
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {expenses.length === 0 ? (
            <p className="text-gray-500 text-center py-10 italic">No expenses recorded yet.</p>
          ) : (
            expenses.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="bg-white p-4 rounded-lg shadow-sm flex justify-between items-center border-l-4 border-violet-500 hover:shadow-md transition-shadow"
              >
                <div>
                  <p className="font-bold text-gray-800">{e.title}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold">{e.date} • {e.category}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-lg text-pink-600">₹{e.amount}</span>
                  <button
                    onClick={() => removeExpense(e.id)}
                    className="text-gray-300 hover:text-red-500 transition-colors"
                    title="Delete entry"
                  >
                    ✕
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);
}

export default App;