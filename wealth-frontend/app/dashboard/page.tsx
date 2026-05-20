// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { api } from "@/lib/api";

// export default function Dashboard() {
//   const { user, loading } = useAuth();
//   const [wealth, setWealth] = useState<any>(null);

//   useEffect(() => {
//     if (!user) return;

//     const load = async () => {
//       const res = await api.get(
//         `/wealth/${user.unifiedInvestorId}/summary`
//       );
//       setWealth(res.data.data);
//     };

//     load();
//   }, [user]);

//   if (loading) return <p>Loading...</p>;
//   if (!user) return <p>Please login</p>;

//   return (
//     <div className="p-10 text-white bg-slate-950 min-h-screen">
//       <h1 className="text-3xl mb-6">Welcome {user.name}</h1>

//       {wealth && (
//         <div className="bg-slate-900 p-6 rounded-xl">
//           <h2 className="text-xl mb-4">Wealth Summary</h2>
//           <p>Equity: ₹ {wealth.wealthBreakdown.equityValue}</p>
//           <p>Mutual Funds: ₹ {wealth.wealthBreakdown.mutualFundValue}</p>
//           <p>Real Estate: ₹ {wealth.wealthBreakdown.realEstateValue}</p>

//           <h3 className="text-2xl mt-4 text-emerald-400">
//             Total Wealth: ₹ {wealth.wealthBreakdown.totalWealth}
//           </h3>
//         </div>
//       )}
//     </div>
//   );
// }
// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { api } from "@/lib/api";

// export default function Dashboard() {
//   const { user, loading, logoutUser } = useAuth();
//   const [wealth, setWealth] = useState<any>(null);
//   const [activeTab, setActiveTab] = useState("dashboard");

//   useEffect(() => {
//     if (!user) return;

//     const load = async () => {
//       try {
//         const res = await api.get(`/wealth/${user.unifiedInvestorId}/summary`);
//         setWealth(res.data.data);
//       } catch (error) {
//         console.error("Failed to load wealth metrics:", error);
//       }
//     };

//     load();
//   }, [user]);

//   if (loading) {
//     return (
//       <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
//         <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
//       </div>
//     );
//   }

//   if (!user) {
//     return (
//       <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
//         <div className="rounded-2xl bg-white p-8 shadow-sm max-w-sm border border-slate-100">
//           <p className="text-lg font-semibold text-slate-800 mb-4">Access Denied</p>
//           <p className="text-sm text-slate-500 mb-6">Please authenticate into your investor account to view your dashboard.</p>
//           <a href="/login" className="block w-full rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors">
//             Go to Login
//           </a>
//         </div>
//       </div>
//     );
//   }

//   // Calculate percentages for visual asset allocation breakdown
//   const totalWealth = wealth?.wealthBreakdown?.totalWealth || 0;
//   const equityVal = wealth?.wealthBreakdown?.equityValue || 0;
//   const mfVal = wealth?.wealthBreakdown?.mutualFundValue || 0;
//   const reVal = wealth?.wealthBreakdown?.realEstateValue || 0;

//   const equityPct = totalWealth ? Math.round((equityVal / totalWealth) * 100) : 0;
//   const mfPct = totalWealth ? Math.round((mfVal / totalWealth) * 100) : 0;
//   const rePct = totalWealth ? Math.round((reVal / totalWealth) * 100) : 0;

//   return (
//     <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
//       {/* SIDEBAR NAVIGATION */}
//       <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-200 bg-white px-5 py-6">
//         {/* Brand Header */}
//         <div className="flex items-center gap-3 px-2 mb-8">
//           <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
//             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <span className="text-xl font-bold tracking-tight text-slate-900">dompet</span>
//         </div>

//         {/* Mini Profile Card */}
//         <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 mb-6 border border-slate-100">
//           <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
//             {user.name ? user.name.charAt(0).toUpperCase() : "I"}
//           </div>
//           <div className="overflow-hidden">
//             <h4 className="truncate text-sm font-semibold text-slate-800">{user.name}</h4>
//             <p className="truncate text-xs text-slate-400">Investor Account</p>
//           </div>
//         </div>

//         {/* Navigation Routes */}
//         <nav className="flex-1 space-y-1">
//           <button 
//             onClick={() => setActiveTab("dashboard")}
//             className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "dashboard" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
//           >
//             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
//             Dashboard
//           </button>
//           <button 
//             onClick={() => setActiveTab("stocks")}
//             className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "stocks" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
//           >
//             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
//             Stocks & Equities
//           </button>
//           <button 
//             onClick={() => setActiveTab("mutual-funds")}
//             className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "mutual-funds" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
//           >
//             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
//             Mutual Funds & SIP
//           </button>
//           <button 
//             onClick={() => setActiveTab("real-estate")}
//             className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "real-estate" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
//           >
//             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
//             Real Estate Assets
//           </button>
//         </nav>

//         {/* Logout Control Panel */}
//         <div className="pt-4 border-t border-slate-100">
//           <button 
//             onClick={logoutUser}
//             className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
//           >
//             <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
//             Logout Session
//           </button>
//         </div>
//       </aside>

//       {/* MAIN APP CONTENT CONTAINER */}
//       <main className="flex-1 pl-64">
//         {/* APP TOP BAR */}
//         <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-10 sticky top-0 z-10">
//           <div>
//             <h1 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard Overview</h1>
//             <p className="text-xs text-slate-400 mt-0.5">Real-time valuation of assets across unified portfolios.</p>
//           </div>
          
//           <div className="flex items-center gap-6">
//             {/* Search Input Simulation */}
//             <div className="relative w-64 hidden md:block">
//               <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
//                 <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
//               </span>
//               <input type="text" placeholder="Search parameters..." className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs focus:border-emerald-500 focus:bg-white focus:outline-none transition-colors" />
//             </div>

//             {/* Simulated Action Button */}
//             <button className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-semibold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-all">
//               <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
//               Generate Report
//             </button>
//           </div>
//         </header>

//         {/* WORKSPACE AREA */}
//         <div className="p-10 space-y-8 max-w-[1600px] mx-auto">
//           {wealth ? (
//             <>
//               {/* PRIMARY STATS GRID HEADER */}
//               <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//                 {/* Total Portfolio Card */}
//                 <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 flex items-center gap-4">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
//                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /><path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" /></svg>
//                   </div>
//                   <div>
//                     <p className="text-xs font-medium tracking-wide uppercase text-slate-400">Total Net Worth</p>
//                     <h3 className="text-xl font-bold text-slate-900 mt-1">₹ {wealth.wealthBreakdown.totalWealth.toLocaleString("en-IN")}</h3>
//                   </div>
//                 </div>

//                 {/* Equities Balance Card */}
//                 <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 flex items-center gap-4">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0">
//                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
//                   </div>
//                   <div>
//                     <p className="text-xs font-medium tracking-wide uppercase text-slate-400">Stocks & Equities</p>
//                     <h3 className="text-xl font-bold text-slate-900 mt-1">₹ {wealth.wealthBreakdown.equityValue.toLocaleString("en-IN")}</h3>
//                   </div>
//                 </div>

//                 {/* Mutual Funds Allocation Card */}
//                 <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 flex items-center gap-4">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 shrink-0">
//                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
//                   </div>
//                   <div>
//                     <p className="text-xs font-medium tracking-wide uppercase text-slate-400">Mutual Funds & SIP</p>
//                     <h3 className="text-xl font-bold text-slate-900 mt-1">₹ {wealth.wealthBreakdown.mutualFundValue.toLocaleString("en-IN")}</h3>
//                   </div>
//                 </div>

//                 {/* Real Estate Allocation Card */}
//                 <div className="relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 flex items-center gap-4">
//                   <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 shrink-0">
//                     <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
//                   </div>
//                   <div>
//                     <p className="text-xs font-medium tracking-wide uppercase text-slate-400">Real Estate Assets</p>
//                     <h3 className="text-xl font-bold text-slate-900 mt-1">₹ {wealth.wealthBreakdown.realEstateValue.toLocaleString("en-IN")}</h3>
//                   </div>
//                 </div>
//               </div>

//               {/* SECONDARY GRAPH AND VISUALIZATION SPLIT ROW */}
//               <div className="grid gap-6 lg:grid-cols-3">
//                 {/* Visual Premium Ledger Display Card */}
//                 <div className="lg:col-span-1 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl shadow-blue-600/10 flex flex-col justify-between min-h-[320px]">
//                   <div className="flex items-start justify-between">
//                     <div>
//                       <p className="text-xs tracking-wider text-blue-100 uppercase font-medium">Aggregated Valuation</p>
//                       <h2 className="text-3xl font-extrabold tracking-tight mt-1">₹ {wealth.wealthBreakdown.totalWealth.toLocaleString("en-IN")}</h2>
//                     </div>
//                     <div className="rounded-xl bg-white/10 p-2 backdrop-blur-md">
//                       <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
//                     </div>
//                   </div>
                  
//                   <div className="mt-8 space-y-2">
//                     <p className="text-xs text-blue-100 tracking-wide font-mono">Unified Investor Identifier</p>
//                     <p className="text-sm font-semibold font-mono tracking-widest bg-white/10 px-3 py-1.5 rounded-lg inline-block">{user.unifiedInvestorId || "INV-849204-X"}</p>
//                   </div>

//                   <div className="flex items-center justify-between border-t border-white/10 pt-4 mt-6">
//                     <span className="text-xs text-blue-100 font-medium">Active Connected Accounts</span>
//                     <span className="flex items-center gap-1 text-xs font-bold bg-emerald-500 px-2.5 py-1 rounded-full text-white">
//                       <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse"></span> Synchronized
//                     </span>
//                   </div>
//                 </div>

//                 {/* Portfolio Asset Allocation Donut Segment Breakdown */}
//                 <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
//                   <div>
//                     <h3 className="text-base font-bold text-slate-900">Asset Allocation Breakdown</h3>
//                     <p className="text-xs text-slate-400">Proportional layout configuration of investments.</p>
//                   </div>

//                   <div className="flex items-center justify-center py-4">
//                     {/* SVG Radial Multi-Segment Visualization Ring */}
//                     <div className="relative flex h-36 w-36 items-center justify-center">
//                       <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
//                         {/* Background structural track */}
//                         <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
//                         {/* Equity segment segment */}
//                         <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray={`${equityPct} 100`} strokeDashoffset="0" />
//                         {/* Mutual Funds segment */}
//                         <circle cx="18" cy="18" r="16" fill="none" stroke="#a855f7" strokeWidth="3.5" strokeDasharray={`${mfPct} 100`} strokeDashoffset={`-${equityPct}`} />
//                         {/* Real Estate segment */}
//                         <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray={`${rePct} 100`} strokeDashoffset={`-${equityPct + mfPct}`} />
//                       </svg>
//                       <div className="text-center">
//                         <span className="text-2xl font-black text-slate-800">3</span>
//                         <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">Sectors</p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Allocation Indicators */}
//                   <div className="space-y-2">
//                     <div className="flex items-center justify-between text-xs">
//                       <div className="flex items-center gap-2 font-medium text-slate-600">
//                         <span className="h-2.5 w-2.5 rounded-full bg-emerald-500"></span> Stocks / Equities
//                       </div>
//                       <span className="font-bold text-slate-900">{equityPct}%</span>
//                     </div>
//                     <div className="flex items-center justify-between text-xs">
//                       <div className="flex items-center gap-2 font-medium text-slate-600">
//                         <span className="h-2.5 w-2.5 rounded-full bg-purple-500"></span> Mutual Funds & SIP
//                       </div>
//                       <span className="font-bold text-slate-900">{mfPct}%</span>
//                     </div>
//                     <div className="flex items-center justify-between text-xs">
//                       <div className="flex items-center gap-2 font-medium text-slate-600">
//                         <span className="h-2.5 w-2.5 rounded-full bg-blue-500"></span> Real Estate
//                       </div>
//                       <span className="font-bold text-slate-900">{rePct}%</span>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Interactive Dynamic Asset Allocation Performance Indicators */}
//                 <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
//                   <div>
//                     <h3 className="text-base font-bold text-slate-900">Portfolio Activity Growth</h3>
//                     <p className="text-xs text-slate-400">Relative weight configurations across asset networks.</p>
//                   </div>

//                   <div className="flex items-end justify-between h-36 px-4 pt-4 border-b border-slate-100">
//                     <div className="w-10 bg-slate-100 rounded-t-lg relative flex flex-col justify-end h-full group hover:bg-emerald-50 transition-colors">
//                       <div style={{ height: `${equityPct}%` }} className="bg-emerald-500 rounded-t-lg w-full transition-all duration-500"></div>
//                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">{equityPct}%</span>
//                     </div>
//                     <div className="w-10 bg-slate-100 rounded-t-lg relative flex flex-col justify-end h-full group hover:bg-purple-50 transition-colors">
//                       <div style={{ height: `${mfPct}%` }} className="bg-purple-500 rounded-t-lg w-full transition-all duration-500"></div>
//                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">{mfPct}%</span>
//                     </div>
//                     <div className="w-10 bg-slate-100 rounded-t-lg relative flex flex-col justify-end h-full group hover:bg-blue-50 transition-colors">
//                       <div style={{ height: `${rePct}%` }} className="bg-blue-500 rounded-t-lg w-full transition-all duration-500"></div>
//                       <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">{rePct}%</span>
//                     </div>
//                   </div>

//                   <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 px-2 pt-2">
//                     <span className="w-10 text-center truncate">Stocks</span>
//                     <span className="w-10 text-center truncate">Funds</span>
//                     <span className="w-10 text-center truncate">Property</span>
//                   </div>
//                 </div>
//               </div>

//               {/* LOWER SUB-PORTFOLIOS DETAILED DRILLDOWN SECTION */}
//               <div className="grid gap-6 xl:grid-cols-3">
//                 {/* Investment Vehicles Breakdown Segment (Equities / Stocks / Mutual Funds) */}
//                 <div className="xl:col-span-2 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60">
//                   <div className="flex items-center justify-between mb-6">
//                     <div>
//                       <h3 className="text-base font-bold text-slate-900">Active Investment Holdings</h3>
//                       <p className="text-xs text-slate-400">Detailed overview breakdown tracking equity products, active stocks, and mutual funds portfolios.</p>
//                     </div>
//                     <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">2 Sectors</span>
//                   </div>

//                   <div className="overflow-x-auto">
//                     <table className="w-full text-left text-sm">
//                       <thead>
//                         <tr className="border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400">
//                           <th className="pb-3 font-semibold">Asset Category</th>
//                           <th className="pb-3 font-semibold">Type</th>
//                           <th className="pb-3 font-semibold text-right">Allocation Val</th>
//                           <th className="pb-3 font-semibold text-right">Weight Percentage</th>
//                         </tr>
//                       </thead>
//                       <tbody className="divide-y divide-slate-100">
//                         <tr className="hover:bg-slate-50/50 transition-colors">
//                           <td className="py-3.5 font-semibold text-slate-800 flex items-center gap-2.5">
//                             <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
//                             Direct Equity Portfolios
//                           </td>
//                           <td className="py-3.5 text-xs text-slate-500">Long-Term Stocks</td>
//                           <td className="py-3.5 text-right font-bold text-slate-900">₹ {wealth.wealthBreakdown.equityValue.toLocaleString("en-IN")}</td>
//                           <td className="py-3.5 text-right font-medium text-emerald-600">{equityPct}%</td>
//                         </tr>
//                         <tr className="hover:bg-slate-50/50 transition-colors">
//                           <td className="py-3.5 font-semibold text-slate-800 flex items-center gap-2.5">
//                             <span className="flex h-2 w-2 rounded-full bg-purple-500"></span>
//                             Equity Mutual Funds
//                           </td>
//                           <td className="py-3.5 text-xs text-slate-500">Systematic Investment Plan (SIP)</td>
//                           <td className="py-3.5 text-right font-bold text-slate-900">₹ {wealth.wealthBreakdown.mutualFundValue.toLocaleString("en-IN")}</td>
//                           <td className="py-3.5 text-right font-medium text-purple-600">{mfPct}%</td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>

//                 {/* Real Estate Portfolio Aggregator Node */}
//                 <div className="xl:col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
//                   <div>
//                     <div className="flex items-center justify-between mb-4">
//                       <h3 className="text-base font-bold text-slate-900">Real Estate Assets</h3>
//                       <span className="text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 px-2 py-0.5 rounded-md uppercase">Immovable Property</span>
//                     </div>
//                     <p className="text-xs text-slate-400 leading-relaxed">
//                       Aggregated asset valuations covering residential structures, commercial infrastructure layouts, and raw plots tracking down index markers.
//                     </p>
//                   </div>

//                   <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 my-4 flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                       <div className="h-10 w-10 bg-blue-500 text-white flex items-center justify-center rounded-lg">
//                         <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
//                       </div>
//                       <div>
//                         <p className="text-xs font-semibold text-slate-700">Total Valuation</p>
//                         <p className="text-[11px] text-slate-400">Verified Marketplace Value</p>
//                       </div>
//                     </div>
//                     <span className="text-sm font-bold text-slate-900">₹ {wealth.wealthBreakdown.realEstateValue.toLocaleString("en-IN")}</span>
//                   </div>

//                   <button className="w-full text-center py-2.5 rounded-xl border border-dashed border-slate-200 text-xs font-semibold text-slate-500 hover:bg-slate-50 hover:text-slate-800 hover:border-slate-300 transition-all">
//                     View Real Estate Asset Registry
//                   </button>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center min-h-[400px] bg-white rounded-2xl border border-slate-200/60 p-8 text-center shadow-sm">
//               <div className="h-14 w-14 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mb-4 animate-bounce">
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
//               </div>
//               <h3 className="text-base font-bold text-slate-900">No Wealth Data Records Discovered</h3>
//               <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1.5">We couldn&apos;t trace active investment records mapping under unified investor ID parameter profiles.</p>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }
"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function Dashboard() {
  const { user, loading, logoutUser } = useAuth();
  const [wealth, setWealth] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("dashboard"); // Options: dashboard, stocks, mutual-funds, real-estate

  // Asset States
  const [properties, setProperties] = useState<any[]>([]);
  const [loadingAssets, setLoadingAssets] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State structured exactly around Database schemas
  const [propertyForm, setPropertyForm] = useState({
    property_name: "",
    property_type: "Residential",
    address: "",
    city: "",
    state: "",
    purchase_price: "",
    current_valuation: "",
    purchase_date: "",
    ownership_percentage: "100",
    rental_income_monthly: "0",
    occupancy_status: "Occupied"
  });

  // Load primary aggregate data summary
  const loadWealthSummary = async () => {
    if (!user) return;
    try {
      const res = await api.get(`/wealth/${user.unifiedInvestorId}/summary`);
      setWealth(res.data.data);
    } catch (error) {
      console.error("Failed to load wealth metrics:", error);
    }
  };

  // Load Real Estate Assets using your endpoint: /api/properties/:investorId
  const loadRealEstateData = async () => {
    if (!user) return;
    setLoadingAssets(true);
    try {
      const res = await api.get(`/properties/${user.unifiedInvestorId}`);
      if (res.data && res.data.properties) {
        setProperties(res.data.properties);
      }
    } catch (error) {
      console.error("Failed to load property listings:", error);
    } finally {
      setLoadingAssets(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadWealthSummary();
    }
  }, [user]);

  // Handle active workspace data orchestration updates
  useEffect(() => {
    if (activeTab === "real-estate") {
      loadRealEstateData();
    }
  }, [activeTab]);

  // Form submit handler for new properties
  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const payload = {
        ...propertyForm,
        unified_investor_id: user.unifiedInvestorId,
        purchase_price: parseFloat(propertyForm.purchase_price) || 0,
        current_valuation: parseFloat(propertyForm.current_valuation) || 0,
        ownership_percentage: parseFloat(propertyForm.ownership_percentage) || 100,
        rental_income_monthly: parseFloat(propertyForm.rental_income_monthly) || 0,
        purchase_date: propertyForm.purchase_date || new Date().toISOString().split('T')[0]
      };

      // POST method mapping exactly to realEstateRoutes endpoint rule router.post('/', ...)
      await api.post("/properties", payload);
      
      // Close modal and reset fields cleanly
      setShowAddModal(false);
      setPropertyForm({
        property_name: "",
        property_type: "Residential",
        address: "",
        city: "",
        state: "",
        purchase_price: "",
        current_valuation: "",
        purchase_date: "",
        ownership_percentage: "100",
        rental_income_monthly: "0",
        occupancy_status: "Occupied"
      });

      // INSTANT REFLECT OPTIMIZATION: Optimistically increase state values locally before network round-trip ends
      if (wealth) {
        const addedVal = payload.current_valuation;
        setWealth({
          ...wealth,
          wealthBreakdown: {
            ...wealth.wealthBreakdown,
            realEstateValue: wealth.wealthBreakdown.realEstateValue + addedVal,
            totalWealth: wealth.wealthBreakdown.totalWealth + addedVal
          }
        });
      }

      // Sync perfectly by pulling updated records immediately from DB endpoints
      await Promise.all([loadWealthSummary(), loadRealEstateData()]);
    } catch (error) {
      console.error("Failed to record property asset:", error);
      alert("Error adding property asset. Please check console inputs.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-50 p-4 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm max-w-sm border border-slate-100">
          <p className="text-lg font-semibold text-slate-800 mb-4">Access Denied</p>
          <p className="text-sm text-slate-500 mb-6">Please authenticate into your investor account to view your dashboard.</p>
          <a href="/login" className="block w-full rounded-xl bg-emerald-600 py-3 text-sm font-medium text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors">
            Go to Login
          </a>
        </div>
      </div>
    );
  }

  const totalWealth = wealth?.wealthBreakdown?.totalWealth || 0;
  const equityVal = wealth?.wealthBreakdown?.equityValue || 0;
  const mfVal = wealth?.wealthBreakdown?.mutualFundValue || 0;
  const reVal = wealth?.wealthBreakdown?.realEstateValue || 0;

  const equityPct = totalWealth ? Math.round((equityVal / totalWealth) * 100) : 0;
  const mfPct = totalWealth ? Math.round((mfVal / totalWealth) * 100) : 0;
  const rePct = totalWealth ? Math.round((reVal / totalWealth) * 100) : 0;

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-800 antialiased">
      
      {/* SIDEBAR NAVIGATION PANEL */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col border-r border-slate-200 bg-white px-5 py-6">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900">dompet</span>
        </div>

        <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-3 mb-6 border border-slate-100">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 font-bold text-sm">
            {user.name ? user.name.charAt(0).toUpperCase() : "I"}
          </div>
          <div className="overflow-hidden">
            <h4 className="truncate text-sm font-semibold text-slate-800">{user.name}</h4>
            <p className="truncate text-xs text-slate-400">Investor Account</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          <button 
            onClick={() => setActiveTab("dashboard")}
            className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "dashboard" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H6a2 2 0 01-2-2v-4zM14 16a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" /></svg>
            Dashboard
          </button>
          <button 
            onClick={() => setActiveTab("stocks")}
            className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "stocks" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Stocks & Equities
          </button>
          <button 
            onClick={() => setActiveTab("mutual-funds")}
            className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "mutual-funds" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            Mutual Funds & SIP
          </button>
          <button 
            onClick={() => setActiveTab("real-estate")}
            className={`flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${activeTab === "real-estate" ? "bg-emerald-50 text-emerald-700" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            Real Estate Assets
          </button>
        </nav>

        <div className="pt-4 border-t border-slate-100">
          <button 
            onClick={logoutUser}
            className="flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout Session
          </button>
        </div>
      </aside>

      {/* CORE FRAMEWORK WORKSPACE */}
      <main className="flex-1 pl-64">
        {/* GLOBAL DYNAMIC HEADER */}
        <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-10 sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 uppercase">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "stocks" && "Equities Workspace"}
              {activeTab === "mutual-funds" && "Mutual Funds & SIP Base"}
              {activeTab === "real-estate" && "Real Estate Asset Ledger"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTab === "dashboard" && "Real-time valuation of assets across unified portfolios."}
              {activeTab === "stocks" && "Live performance monitoring tracking localized capital assets."}
              {activeTab === "mutual-funds" && "Systematic compounding configurations and distribution pools."}
              {activeTab === "real-estate" && "Physical estate asset registries queried from persistent databases."}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {activeTab !== "dashboard" && (
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-all"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                {activeTab === "real-estate" ? "Add Property" : "Add Asset Asset"}
              </button>
            )}
          </div>
        </header>

        {/* CONTAINER CONTENT WRAPPER */}
        <div className="p-10 space-y-8 max-w-[1600px] mx-auto">
          
          {/* TOP SUMMARY MINI-DASH LINK (Stays constant across tabs to show balance distribution) */}
          {wealth && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div onClick={() => setActiveTab("dashboard")} className={`cursor-pointer rounded-2xl p-5 border transition-all flex items-center gap-4 ${activeTab === "dashboard" ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/10" : "bg-white border-slate-200/60 shadow-sm opacity-80 hover:opacity-100"}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 shrink-0"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" /></svg></div>
                <div><p className="text-[11px] font-medium text-slate-400 uppercase">Total Worth</p><h3 className="text-base font-bold text-slate-900">₹ {totalWealth.toLocaleString("en-IN")}</h3></div>
              </div>
              <div onClick={() => setActiveTab("stocks")} className={`cursor-pointer rounded-2xl p-5 border transition-all flex items-center gap-4 ${activeTab === "stocks" ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/10" : "bg-white border-slate-200/60 shadow-sm opacity-80 hover:opacity-100"}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 shrink-0"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                <div><p className="text-[11px] font-medium text-slate-400 uppercase">Stocks</p><h3 className="text-base font-bold text-slate-900">₹ {equityVal.toLocaleString("en-IN")}</h3></div>
              </div>
              <div onClick={() => setActiveTab("mutual-funds")} className={`cursor-pointer rounded-2xl p-5 border transition-all flex items-center gap-4 ${activeTab === "mutual-funds" ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/10" : "bg-white border-slate-200/60 shadow-sm opacity-80 hover:opacity-100"}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-600 shrink-0"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2" /></svg></div>
                <div><p className="text-[11px] font-medium text-slate-400 uppercase">Mutual Funds</p><h3 className="text-base font-bold text-slate-900">₹ {mfVal.toLocaleString("en-IN")}</h3></div>
              </div>
              <div onClick={() => setActiveTab("real-estate")} className={`cursor-pointer rounded-2xl p-5 border transition-all flex items-center gap-4 ${activeTab === "real-estate" ? "bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/10" : "bg-white border-slate-200/60 shadow-sm opacity-80 hover:opacity-100"}`}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-600 shrink-0"><svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16" /></svg></div>
                <div><p className="text-[11px] font-medium text-slate-400 uppercase">Real Estate</p><h3 className="text-base font-bold text-slate-900">₹ {reVal.toLocaleString("en-IN")}</h3></div>
              </div>
            </div>
          )}

          {/* DYNAMIC TAB INTERFACE DISPATCHER */}
          
          {/* 1. MAIN OVERVIEW VIEWPORT */}
          {activeTab === "dashboard" && wealth && (
            <div className="grid gap-6 lg:grid-cols-3 animate-fadeIn">
              <div className="lg:col-span-1 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white shadow-xl flex flex-col justify-between min-h-[300px]">
                <div className="flex items-start justify-between">
                  <div><p className="text-xs text-blue-100 uppercase font-medium">Aggregated Valuation</p><h2 className="text-3xl font-extrabold mt-1">₹ {totalWealth.toLocaleString("en-IN")}</h2></div>
                  <div className="rounded-xl bg-white/10 p-2"><svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12V8H3v8z" /></svg></div>
                </div>
                <div><p className="text-xs text-blue-100 font-mono">Unified Investor Identifier</p><p className="text-sm font-semibold font-mono tracking-wider bg-white/10 px-3 py-1 mt-1 rounded-md inline-block">{user.unifiedInvestorId}</p></div>
              </div>

              <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
                <div><h3 className="text-sm font-bold text-slate-900">Asset Allocation Breakdown</h3><p className="text-xs text-slate-400">Proportional allocation configurations.</p></div>
                <div className="flex items-center justify-center py-2">
                  <div className="relative flex h-28 w-28 items-center justify-center">
                    <svg className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#f1f5f9" strokeWidth="3.5" />
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#10b981" strokeWidth="3.5" strokeDasharray={`${equityPct} 100`} strokeDashoffset="0" />
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#a855f7" strokeWidth="3.5" strokeDasharray={`${mfPct} 100`} strokeDashoffset={`-${equityPct}`} />
                      <circle cx="18" cy="18" r="16" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeDasharray={`${rePct} 100`} strokeDashoffset={`-${equityPct + mfPct}`} />
                    </svg>
                    <div className="text-center"><span className="text-xl font-bold text-slate-800">3</span><p className="text-[9px] uppercase font-semibold text-slate-400">Sectors</p></div>
                  </div>
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600"><span className="h-2 w-2 rounded-full bg-emerald-500"></span> Stocks</div>
                    <span className="font-bold text-slate-900">{equityPct}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600"><span className="h-2 w-2 rounded-full bg-purple-500"></span> Mutual Funds</div>
                    <span className="font-bold text-slate-900">{mfPct}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-600"><span className="h-2 w-2 rounded-full bg-blue-500"></span> Real Estate</div>
                    <span className="font-bold text-slate-900">{rePct}%</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1 rounded-2xl bg-white p-6 shadow-sm border border-slate-200/60 flex flex-col justify-between">
                <div><h3 className="text-sm font-bold text-slate-900">Quick Configuration Insights</h3><p className="text-xs text-slate-400">Select an asset tab from the sidebar to inspect specific holdings data rows.</p></div>
                <div className="space-y-2 mt-4">
                  <button onClick={() => setActiveTab("stocks")} className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors"><span>Inspect All Stocks</span><span className="text-emerald-600">→</span></button>
                  <button onClick={() => setActiveTab("mutual-funds")} className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors"><span>Inspect Mutual Funds</span><span className="text-purple-600">→</span></button>
                  <button onClick={() => setActiveTab("real-estate")} className="w-full text-left p-2.5 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between text-xs font-semibold text-slate-700 transition-colors"><span>Inspect Property Registry</span><span className="text-blue-600">→</span></button>
                </div>
              </div>
            </div>
          )}

          {/* 2. STOCKS / EQUITIES SEGMENT WORKSPACE */}
          {activeTab === "stocks" && (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div><h3 className="text-base font-bold text-slate-900">Direct Equity Portfolios</h3><p className="text-xs text-slate-400">Track current valuation updates mapping direct public entity holdings.</p></div>
                <div className="text-sm font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-lg">Allocation: ₹ {equityVal.toLocaleString("en-IN")}</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 uppercase text-slate-400 font-bold tracking-wider"><th className="pb-3">Asset Instrument</th><th className="pb-3">Ticker</th><th className="pb-3 text-right">Valuation Pool</th><th className="pb-3 text-right">Portfolio Weight</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/50"><td className="py-4 font-semibold text-slate-800">Unified Equity Cluster Node</td><td className="py-4 font-mono text-slate-400">EQ-UNIFIED</td><td className="py-4 text-right font-bold text-slate-900">₹ {equityVal.toLocaleString("en-IN")}</td><td className="py-4 text-right font-semibold text-emerald-600">{equityPct}%</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. MUTUAL FUNDS & SIP SEGMENT WORKSPACE */}
          {activeTab === "mutual-funds" && (
            <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <div><h3 className="text-base font-bold text-slate-900">Mutual Fund & SIP Instruments</h3><p className="text-xs text-slate-400">Track pooled indices and scheduled periodic allocation configurations.</p></div>
                <div className="text-sm font-bold bg-purple-50 text-purple-700 px-3 py-1 rounded-lg">Allocation: ₹ {mfVal.toLocaleString("en-IN")}</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 uppercase text-slate-400 font-bold tracking-wider"><th className="pb-3">Fund Group Asset</th><th className="pb-3">Strategy Framework</th><th className="pb-3 text-right">Holding Value</th><th className="pb-3 text-right">Portfolio Weight</th></tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/50"><td className="py-4 font-semibold text-slate-800">Aggregated Mutual Fund Pool</td><td className="py-4 text-slate-400">Systematic Equity Allocation</td><td className="py-4 text-right font-bold text-slate-900">₹ {mfVal.toLocaleString("en-IN")}</td><td className="py-4 text-right font-semibold text-purple-600">{mfPct}%</td></tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 4. REAL ESTATE WORKING ASSET TAB GRID LINKED TO DATABASE */}
          {activeTab === "real-estate" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-white rounded-2xl border border-slate-200/60 p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Registered Property Assets</h3>
                    <p className="text-xs text-slate-400">Real-time mapping of fields returning from the `real_estate_assets` table.</p>
                  </div>
                  <div className="text-sm font-bold bg-blue-50 text-blue-700 px-3 py-1 rounded-lg self-start sm:self-center">
                    Aggregate Assets Value: ₹ {reVal.toLocaleString("en-IN")}
                  </div>
                </div>

                {loadingAssets ? (
                  <div className="py-12 flex justify-center items-center"><div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div></div>
                ) : properties.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs whitespace-nowrap">
                      <thead>
                        <tr className="border-b border-slate-100 uppercase text-slate-400 font-bold tracking-wider">
                          <th className="pb-3">Property Name</th>
                          <th className="pb-3">Category</th>
                          <th className="pb-3">Location Matrix</th>
                          <th className="pb-3 text-right">Purchase Price</th>
                          <th className="pb-3 text-right">Current Valuation</th>
                          <th className="pb-3 text-center">Occupancy State</th>
                          <th className="pb-3 text-right">Monthly Rent</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-slate-700">
                        {properties.map((prop: any, i: number) => (
                          <tr key={prop.id || i} className="hover:bg-slate-50/50">
                            <td className="py-3.5 font-semibold text-slate-900">{prop.property_name}</td>
                            <td className="py-3.5 text-slate-500">{prop.property_type}</td>
                            <td className="py-3.5 text-slate-400">{prop.city ? `${prop.city}, ${prop.state || ''}` : "Not Disclosed"}</td>
                            <td className="py-3.5 text-right font-medium">₹ {Number(prop.purchase_price).toLocaleString("en-IN")}</td>
                            <td className="py-3.5 text-right font-bold text-slate-900">₹ {Number(prop.current_valuation).toLocaleString("en-IN")}</td>
                            <td className="py-3.5 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${prop.occupancy_status === 'Occupied' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                                {prop.occupancy_status || "Occupied"}
                              </span>
                            </td>
                            <td className="py-3.5 text-right font-semibold text-slate-900">₹ {Number(prop.rental_income_monthly).toLocaleString("en-IN")}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 border border-dashed border-slate-100 rounded-xl">
                    <p className="text-sm">No properties assigned underneath Investor Identifier.</p>
                    <button onClick={() => setShowAddModal(true)} className="mt-3 text-xs text-blue-600 font-bold hover:underline">Register Initial Property Row Now</button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* MODAL WINDOW SYSTEM: DYNAMICALLY HANDLES INJECTION TARGETS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-xl max-h-[90vh] overflow-y-auto border border-slate-100">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  {activeTab === "real-estate" ? "Register Real Estate Asset" : "Register General Asset Portfolio Entry"}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Database parameters map securely to live API endpoint matrices.</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-50 transition-colors">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {activeTab === "real-estate" ? (
              <form onSubmit={handleAddProperty} className="space-y-4 text-xs">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-500 mb-1 uppercase tracking-wide">Property / Development Title Name</label>
                    <input required type="text" placeholder="e.g. Prestige Heights Tower A" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={propertyForm.property_name} onChange={e => setPropertyForm({...propertyForm, property_name: e.target.value})} />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 mb-1 uppercase tracking-wide">Structural Category Classification</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={propertyForm.property_type} onChange={e => setPropertyForm({...propertyForm, property_type: e.target.value})}>
                      <option value="Residential">Residential Development</option>
                      <option value="Commercial">Commercial Office Space</option>
                      <option value="Industrial">Industrial Warehouse</option>
                      <option value="Plot">Raw Plot Infrastructure</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 mb-1 uppercase tracking-wide">Occupancy Status</label>
                    <select className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={propertyForm.occupancy_status} onChange={e => setPropertyForm({...propertyForm, occupancy_status: e.target.value})}>
                      <option value="Occupied">Occupied / Leased</option>
                      <option value="Vacant">Vacant / Available</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-500 mb-1 uppercase tracking-wide">Street Address Location</label>
                    <input required type="text" placeholder="e.g. 102 MG Road Sector 4" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={propertyForm.address} onChange={e => setPropertyForm({...propertyForm, address: e.target.value})} />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 mb-1 uppercase tracking-wide">City</label>
                    <input required type="text" placeholder="Mumbai" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={propertyForm.city} onChange={e => setPropertyForm({...propertyForm, city: e.target.value})} />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 mb-1 uppercase tracking-wide">State Territory</label>
                    <input required type="text" placeholder="Maharashtra" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={propertyForm.state} onChange={e => setPropertyForm({...propertyForm, state: e.target.value})} />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 mb-1 uppercase tracking-wide">Purchase Price Cost (INR)</label>
                    <input required type="number" placeholder="4500000" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={propertyForm.purchase_price} onChange={e => setPropertyForm({...propertyForm, purchase_price: e.target.value})} />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 mb-1 uppercase tracking-wide">Current Valuation Index (INR)</label>
                    <input required type="number" placeholder="5200000" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={propertyForm.current_valuation} onChange={e => setPropertyForm({...propertyForm, current_valuation: e.target.value})} />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 mb-1 uppercase tracking-wide">Monthly Generated Rental Income (INR)</label>
                    <input type="number" placeholder="22000" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={propertyForm.rental_income_monthly} onChange={e => setPropertyForm({...propertyForm, rental_income_monthly: e.target.value})} />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-500 mb-1 uppercase tracking-wide">Acquisition Purchase Date</label>
                    <input type="date" className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 font-medium text-slate-800 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                      value={propertyForm.purchase_date} onChange={e => setPropertyForm({...propertyForm, purchase_date: e.target.value})} />
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100 mt-6">
                  <button type="button" onClick={() => setShowAddModal(false)} className="px-5 py-3 rounded-xl border border-slate-200 font-bold text-slate-500 hover:bg-slate-50 transition-colors">Cancel</button>
                  <button type="submit" className="px-6 py-3 rounded-xl bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/10 hover:bg-emerald-700 transition-colors">Commit Asset to DB</button>
                </div>
              </form>
            ) : (
              <div className="py-6 text-center text-slate-500 text-xs">
                <p>Stocks and Mutual Funds asset updating models are securely governed via automated brokerage sync APIs.</p>
                <button onClick={() => setShowAddModal(false)} className="mt-4 px-4 py-2 bg-slate-800 text-white font-bold rounded-xl">Dismiss</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}