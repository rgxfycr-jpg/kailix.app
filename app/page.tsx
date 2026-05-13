"use client";

import React, { useState, useEffect } from "react";
import { DynamicContextProvider, DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { createClient } from "@supabase/supabase-js";
import { PackageOpen, ScrollText } from "lucide-react";

const supabase = createClient(
  "https://mruyjzbongjchijusyof.supabase.co", 
  "sb_publishable_qPsGNqUMMY7_Pq6fimlyHg_asPyaRvk"
);

function Dashboard() {
  const { primaryWallet } = useDynamicContext();
  const [quests, setQuests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"quests" | "history">("quests");

  useEffect(() => {
    const fetchQuests = async () => {
      const { data } = await supabase.from("quests").select("*").eq("is_active", true);
      if (data) setQuests(data);
      setLoading(false);
    };
    fetchQuests();
  }, []);

  return (
    <div className="min-h-screen pb-16">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-purple-600 text-white rounded flex items-center justify-center font-bold">K</div>
          <h1 className="text-xl font-bold">Kalix</h1>
        </div>
        <DynamicWidget />
      </header>

      <main className="max-w-2xl mx-auto mt-10 px-4">
        <div className="flex space-x-4 mb-8 border-b pb-2">
          <button onClick={() => setActiveTab("quests")} className={`pb-2 font-bold ${activeTab === "quests" ? "border-b-2 border-purple-600" : "text-gray-400"}`}>Quests</button>
          <button onClick={() => setActiveTab("history")} className={`pb-2 font-bold ${activeTab === "history" ? "border-b-2 border-purple-600" : "text-gray-400"}`}>History</button>
        </div>

        {loading ? (
          <p className="text-center py-10">Loading...</p>
        ) : quests.length === 0 ? (
          <div className="bg-white border rounded-3xl p-12 text-center shadow-sm">
            <PackageOpen className="mx-auto w-16 h-16 text-gray-200 mb-4" />
            <h3 className="text-lg font-bold">No quests available</h3>
            <p className="text-gray-500">Check back later for new rewards!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {quests.map((q) => (
              <div key={q.id} className="bg-white p-6 rounded-2xl border flex justify-between items-center">
                <div>
                  <h4 className="font-bold">{q.title}</h4>
                  <p className="text-sm text-gray-500">{q.description}</p>
                </div>
                <button className="bg-black text-white px-4 py-2 rounded-xl text-sm">Earn {q.reward_points} Pts</button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <DynamicContextProvider settings={{ environmentId: "1ebbcf69-cefa-4bd9-ac74-2b7da156045a", walletConnectors: [EthereumWalletConnectors] }}>
      <Dashboard />
    </DynamicContextProvider>
  );
}
