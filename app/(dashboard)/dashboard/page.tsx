import prisma from "@/lib/prisma/client";
import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  Zap,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Activity,
  BarChart3,
  PieChart,
  CreditCard,
  ShoppingCart,
  Image as ImageIcon,
  MoreHorizontal,
  Plus,
  Sparkles,
  Layers,
  Flame,
  Diamond,
  Target,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import type { Listing, NFT, Generation, CreditTransaction } from "@prisma/client";
import { StatsOverview } from "@/components/dashboard/stats/stats-overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { PortfolioChart } from "@/components/dashboard/portfolio-chart";
import { QuickActions } from "@/components/dashboard/quick-actions";

type ListingWithNFT = Listing & {
  nft: NFT & { generation: Generation };
};

type TransactionWithType = CreditTransaction & {
  type: "PURCHASE" | "SPEND" | "REFUND" | "BONUS";
};

export default async function DashboardPage() {
  const session = await getIronSession<SessionData>(await cookies(), sessionOptions);
  if (!session.userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    include: {
      listings: {
        where: { status: "ACTIVE" },
        include: {
          nft: {
            include: { generation: true }
          }
        },
        orderBy: { createdAt: "desc" },
        take: 5
      },
      nfts: {
        orderBy: { createdAt: "desc" },
        take: 10
      },
      transactions: {
        orderBy: { createdAt: "desc" },
        take: 10
      }
    }
  });

  if (!user) redirect("/login");

  const activeListings: ListingWithNFT[] = user.listings;
  const recentTransactions = user.transactions as TransactionWithType[];

  // Calculate stats
  const totalSales = user.nfts?.filter(n => n.status === "SOLD").length || 0;
  const listedCount = user.nfts?.filter(n => n.status === "LISTED").length || 0;
  const mintedCount = user.nfts?.filter(n => n.status === "MINTED").length || 0;
  const totalVolume = activeListings.reduce((acc, l) => acc + l.priceSOL, 0);

  // Mock portfolio data
  const portfolioData = [
    { label: "Available Credits", value: user.credits, change: 12.5, isPositive: true, icon: Zap, color: "text-primary" },
    { label: "NFT Collection", value: user.nfts.length, change: 8.2, isPositive: true, icon: Layers, color: "text-secondary" },
    { label: "Active Listings", value: listedCount, change: -2.1, isPositive: false, icon: ShoppingCart, color: "text-amber-400" },
    { label: "Total Sales", value: totalSales, change: 24.8, isPositive: true, icon: TrendingUp, color: "text-green-400" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0D14] pb-8">
      {/* Main Content Container */}
      <div className="container mx-auto px-4 lg:px-6 py-6">
        {/* Welcome Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Overview</p>
            <h1 className="text-2xl font-semibold text-white tracking-tight">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/studio">
              <Button size="sm" className="h-9 px-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg">
                <Plus className="mr-2 h-4 w-4" />
                Create New
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Grid - DeFi Style */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {portfolioData.map((stat, index) => (
            <Card key={index} className="bg-[#13151F] border-white/[0.06] hover:border-white/[0.1] transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground/80 mb-1">{stat.label}</p>
                    <p className={`text-2xl font-semibold ${stat.color} tabular-nums tracking-tight`}>
                      {stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-2 rounded-lg ${stat.color.replace('text-', 'bg-')}/10`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  {stat.isPositive ? (
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  )}
                  <span className={`text-xs font-medium ${stat.isPositive ? 'text-green-400' : 'text-red-400'}`}>
                    {stat.isPositive ? '+' : ''}{stat.change}%
                  </span>
                  <span className="text-xs text-muted-foreground/60">vs last 7d</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left Column - 2/3 */}
          <div className="xl:col-span-2 space-y-6">
            {/* Portfolio Value Chart */}
            <PortfolioChart />

            {/* Active Listings Table */}
            <Card className="bg-[#13151F] border-white/[0.06]">
              <CardHeader className="px-5 py-4 border-b border-white/[0.06] flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  <div>
                    <h3 className="text-sm font-semibold text-white">Active Listings</h3>
                    <p className="text-xs text-muted-foreground/70">{activeListings.length} items for sale</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Floor Price:</span>
                  <span className="text-sm font-semibold text-white tabular-nums">
                    {activeListings.length > 0
                      ? Math.min(...activeListings.map(l => l.priceSOL)).toFixed(2)
                      : '0.00'} SOL
                  </span>
                </div>
              </CardHeader>
              <div className="overflow-x-auto">
                {activeListings.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-white/5 flex items-center justify-center">
                      <ImageIcon className="h-5 w-5 text-white/20" />
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">No active listings</p>
                    <Link href="/my-nfts">
                      <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 text-xs">
                        List NFTs
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/[0.06]">
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">Item</th>
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">Created</th>
                        <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">Price</th>
                        <th className="text-right px-5 py-3 text-xs font-medium text-muted-foreground/70 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.04]">
                      {activeListings.map((listing) => (
                        <tr key={listing.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-lg overflow-hidden border border-white/10">
                                <img
                                  src={listing.nft.generation.imageUrl}
                                  alt={listing.nft.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">{listing.nft.name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                  {listing.nft.generation.prompt.slice(0, 40)}...
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-sm text-muted-foreground">
                              {new Date(listing.createdAt).toLocaleDateString()}
                            </p>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <p className="text-sm font-semibold text-white tabular-nums">{listing.priceSOL} SOL</p>
                            <p className="text-xs text-muted-foreground">~${(listing.priceSOL * 45).toFixed(0)}</p>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <Badge variant="outline" className="text-xs border-green-500/30 text-green-400 bg-green-500/10">
                              Active
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              {activeListings.length > 0 && (
                <div className="px-5 py-3 border-t border-white/[0.06]">
                  <Link href="/my-nfts">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-white">
                      View All Listings
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              )}
            </Card>

            {/* Collection Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Card className="bg-[#13151F] border-white/[0.06]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Minted</span>
                    <Diamond className="h-4 w-4 text-blue-400" />
                  </div>
                  <p className="text-2xl font-semibold text-white tabular-nums">{mintedCount}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">In your wallet</p>
                </CardContent>
              </Card>
              <Card className="bg-[#13151F] border-white/[0.06]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Listed</span>
                    <Target className="h-4 w-4 text-amber-400" />
                  </div>
                  <p className="text-2xl font-semibold text-white tabular-nums">{listedCount}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">On marketplace</p>
                </CardContent>
              </Card>
              <Card className="bg-[#13151F] border-white/[0.06]">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-muted-foreground">Sold</span>
                    <Award className="h-4 w-4 text-green-400" />
                  </div>
                  <p className="text-2xl font-semibold text-white tabular-nums">{totalSales}</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Total sales</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - 1/3 */}
          <div className="space-y-6">
            {/* Credit Balance Card */}
            <Card className="bg-gradient-to-br from-primary/10 via-[#13151F] to-[#13151F] border-primary/20">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-primary/20 border border-primary/30">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Credit Balance</p>
                    <p className="text-2xl font-bold text-white tabular-nums">{user.credits.toLocaleString()}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Available</span>
                    <span className="text-white font-medium">{user.credits}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
                      style={{ width: `${Math.min((user.credits / 1000) * 100, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground/70">~{Math.floor(user.credits / 5)} generations remaining</p>
                </div>
                <Link href="/credits" className="block mt-4">
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-white">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Buy Credits
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <QuickActions />

            {/* Recent Activity */}
            <RecentActivity transactions={recentTransactions} />

            {/* Market Stats */}
            <Card className="bg-[#13151F] border-white/[0.06]">
              <CardHeader className="px-5 py-4 border-b border-white/[0.06]">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-secondary" />
                  <h3 className="text-sm font-semibold text-white">Market Overview</h3>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Total Volume</span>
                  <span className="text-sm font-semibold text-white tabular-nums">{totalVolume.toFixed(2)} SOL</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Floor Price</span>
                  <span className="text-sm font-semibold text-white tabular-nums">
                    {activeListings.length > 0 ? Math.min(...activeListings.map(l => l.priceSOL)).toFixed(2) : '0.00'} SOL
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Listings</span>
                  <span className="text-sm font-semibold text-white tabular-nums">{activeListings.length}</span>
                </div>
                <div className="pt-3 border-t border-white/[0.06]">
                  <Link href="/marketplace">
                    <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-white">
                      Explore Marketplace
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
