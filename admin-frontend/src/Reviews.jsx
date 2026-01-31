import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

/* ================= COLORS ================= */
const BAR_COLORS = ["#ef4444", "#f97316", "#facc15", "#84cc16", "#22c55e"];
const PIE_COLORS = ["#22c55e", "#facc15", "#ef4444"]; // Positive, Neutral, Negative

export default function Reviews() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ================= FETCH ANALYTICS ================= */
  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await fetch(
          "http://localhost:5001/admin/reviews/analytics"
        );
        if (!res.ok) throw new Error("Failed to fetch analytics");
        const data = await res.json();
        setAnalytics(data);
      } catch (err) {
        console.error(err);
        setError("Unable to load review analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  /* ================= STATES ================= */
  if (loading) {
    return <div className="p-10 text-gray-400">Loading customer insights…</div>;
  }

  if (error) {
    return <div className="p-10 text-red-400">{error}</div>;
  }

  if (!analytics) return null;

  

 // SAFE RATING DISTRIBUTION
const ratingDistribution = analytics.ratingDistribution || {};

// ensure keys 1 to 5 exist
const safeDistribution = [1, 2, 3, 4, 5].reduce((acc, star) => {
  acc[star] = Number(ratingDistribution[star] || 0);
  return acc;
}, {});

// BAR CHART DATA
const ratingData = [1, 2, 3, 4, 5].map((r) => ({
  rating: `${r}★`,
  count: safeDistribution[r],
}));

// SENTIMENT DATA
const sentimentData = [
  { name: "Positive", value: safeDistribution[5] + safeDistribution[4] },
  { name: "Neutral", value: safeDistribution[3] },
  { name: "Negative", value: safeDistribution[2] + safeDistribution[1] },
];


  return (
    <div className="p-10 text-white">
      {/* ================= HEADER ================= */}
      <h1 className="text-4xl font-bold text-yellow-400 mb-4">
        Customer Voice Intelligence
      </h1>
      <p className="text-gray-400 max-w-4xl mb-14">
        Reviews are auto-published using safety filters. This dashboard
        converts real customer feedback into high-level business insight.
      </p>

      {/* ================= KPI GRID ================= */}
      <div className="grid md:grid-cols-4 gap-6 mb-16">
        <InsightCard
          title="Average Rating"
          value={`${analytics.avgRating.toFixed(1)} ★`}
          desc="Overall customer satisfaction"
        />
        <InsightCard
          title="Total Reviews"
          value={analytics.totalReviews}
          desc="Real voices collected"
        />
        <InsightCard
          title="Negative Signals"
          value={analytics.flaggedReviews}
          desc="Low ratings & complaints"
          danger
        />
        <InsightCard
          title="Customer Loyalty (NPS)"
          value={`${analytics.nps}%`}
          desc="Referral probability"
        />
      </div>

      {/* ================= CHARTS ================= */}
      <div className="grid md:grid-cols-2 gap-10 mb-16">
        {/* RATING DISTRIBUTION */}
        <ChartPanel title="Rating Distribution">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={ratingData}>
              <XAxis dataKey="rating" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count">
                {ratingData.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        {/* SENTIMENT SHARE */}
        <ChartPanel title="Sentiment Share">
          {sentimentData.length === 0 ? (
            <p className="text-gray-500 text-center mt-20">
              Not enough data to display sentiment
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={sentimentData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {sentimentData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartPanel>
      </div>

      {/* ================= INTERPRETATION ================= */}
      <div className="grid md:grid-cols-2 gap-8">
        <InsightPanel title="Customer Emotion">
          {analytics.avgRating >= 4 ? (
            <p className="text-green-400">
              Customers are highly satisfied. Brand trust is strong.
            </p>
          ) : analytics.avgRating >= 3 ? (
            <p className="text-yellow-400">
              Mixed sentiment detected. Experience consistency can be improved.
            </p>
          ) : (
            <p className="text-red-400">
              Negative sentiment detected. Immediate corrective action required.
            </p>
          )}
        </InsightPanel>

        <InsightPanel title="Strategic Improvement Areas">
          <ul className="list-disc ml-5 text-gray-300 space-y-2">
            <li>Trainer engagement & service quality</li>
            <li>Membership value & pricing clarity</li>
            <li>Facilities, hygiene & equipment upkeep</li>
            <li>Onboarding & early user experience</li>
          </ul>
        </InsightPanel>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-16 text-sm text-gray-500 max-w-4xl">
        Analytics update automatically as new reviews arrive.
        No manual moderation is required — only real customer feedback
        shapes these insights.
      </div>
    </div>
  );
}

/* ================= REUSABLE COMPONENTS ================= */

function InsightCard({ title, value, desc, danger }) {
  return (
    <div
      className={`bg-gradient-to-br from-[#0b0b0b] to-[#111]
      border ${danger ? "border-red-500/40" : "border-yellow-500/30"}
      rounded-3xl p-8 shadow-xl`}
    >
      <p className="text-gray-400 text-sm">{title}</p>
      <p
        className={`text-4xl font-bold mt-4 ${
          danger ? "text-red-400" : "text-yellow-400"
        }`}
      >
        {value}
      </p>
      <p className="text-gray-500 text-sm mt-3">{desc}</p>
    </div>
  );
}

function ChartPanel({ title, children }) {
  return (
    <div className="bg-gradient-to-br from-[#0b0b0b] to-[#111]
      border border-yellow-500/30 rounded-3xl p-8 shadow-xl">
      <h2 className="text-xl font-semibold text-yellow-400 mb-6">
        {title}
      </h2>
      {children}
    </div>
  );
}

function InsightPanel({ title, children }) {
  return (
    <div className="bg-gradient-to-br from-[#0b0b0b] to-[#111]
      border border-yellow-500/30 rounded-3xl p-8 shadow-xl">
      <h2 className="text-xl font-semibold text-yellow-400 mb-4">
        {title}
      </h2>
      {children}
    </div>
  );
}
