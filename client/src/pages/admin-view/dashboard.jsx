import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "@/store/admin/adminDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Store,
  Package,
  ShoppingBag,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Clock,
  CheckCircle,
} from "lucide-react";

const orderStatusColor = {
  confirmed: "bg-green-500",
  rejected: "bg-red-500",
  delivered: "bg-blue-500",
  inShipping: "bg-purple-500",
  inProcess: "bg-orange-400",
  pending: "bg-gray-400",
};

// Simple bar chart using CSS
function BarChart({ data }) {
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="flex items-end gap-2 h-36 w-full mt-2">
      {data.map((item, i) => (
        <div key={i} className="flex flex-col items-center flex-1 gap-1">
          <span className="text-xs text-muted-foreground font-medium">
            ${item.revenue >= 1000
              ? (item.revenue / 1000).toFixed(1) + "k"
              : item.revenue}
          </span>
          <div className="w-full flex items-end" style={{ height: "80px" }}>
            <div
              className="w-full rounded-t-md bg-primary transition-all duration-500"
              style={{
                height: `${Math.max((item.revenue / maxRevenue) * 80, item.revenue > 0 ? 4 : 0)}px`,
              }}
            />
          </div>
          <span className="text-xs text-muted-foreground">{item.month}</span>
        </div>
      ))}
    </div>
  );
}

// Stat card
function StatCard({ title, value, subtitle, icon: Icon, iconColor, trend, trendLabel }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-full ${iconColor || "bg-primary/10"}`}>
          <Icon size={16} className={iconColor ? "text-white" : "text-primary"} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
        {trend !== undefined && (
          <div className="flex items-center gap-1 mt-1">
            {trend >= 0 ? (
              <TrendingUp size={13} className="text-green-500" />
            ) : (
              <TrendingDown size={13} className="text-red-500" />
            )}
            <span
              className={`text-xs font-medium ${
                trend >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {trend >= 0 ? "+" : ""}
              {trend}% vs last month
            </span>
          </div>
        )}
        {trendLabel && (
          <p className="text-xs text-muted-foreground mt-1">{trendLabel}</p>
        )}
      </CardContent>
    </Card>
  );
}

function AdminDashboard() {
  const dispatch = useDispatch();
  const { stats, isLoading } = useSelector((state) => state.adminDashboard);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (isLoading || !stats) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
        <Skeleton className="h-48 rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Overview of your store's performance
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          subtitle="Registered buyers"
          icon={Users}
          iconColor="bg-blue-500"
        />
        <StatCard
          title="Total Sellers"
          value={stats.totalSellers.toLocaleString()}
          subtitle={`${stats.approvedSellers} approved · ${stats.pendingSellers} pending`}
          icon={Store}
          iconColor="bg-purple-500"
        />
        <StatCard
          title="Live Products"
          value={stats.totalProducts.toLocaleString()}
          subtitle={`${stats.pendingProducts} awaiting approval`}
          icon={Package}
          iconColor="bg-orange-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders.toLocaleString()}
          subtitle={`${stats.thisMonthOrderCount} orders this month`}
          icon={ShoppingBag}
          iconColor="bg-green-500"
        />
      </div>

      {/* Revenue row */}
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          title="This Month's Revenue"
          value={`$${stats.thisMonthRevenue.toLocaleString()}`}
          icon={DollarSign}
          iconColor="bg-emerald-500"
          trend={stats.revenueChange}
        />
        <StatCard
          title="Last Month's Revenue"
          value={`$${stats.lastMonthRevenue.toLocaleString()}`}
          icon={DollarSign}
          iconColor="bg-slate-500"
          trendLabel="Previous month"
        />
        <StatCard
          title="Total Revenue (All Time)"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          iconColor="bg-yellow-500"
          trendLabel="From all paid orders"
        />
      </div>

      {/* Monthly revenue chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Revenue — Last 6 Months</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
            <BarChart data={stats.monthlyRevenue} />
          ) : (
            <p className="text-muted-foreground text-sm text-center py-8">
              No revenue data yet.
            </p>
          )}
          {/* Legend */}
          <div className="flex gap-6 mt-4 text-xs text-muted-foreground">
            {stats.monthlyRevenue?.map((item, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="font-medium text-foreground">{item.orders}</span>
                <span>orders</span>
                <span>{item.month}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pending approvals quick summary */}
      {(stats.pendingSellers > 0 || stats.pendingProducts > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.pendingSellers > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
              <Clock size={20} className="text-yellow-600 shrink-0" />
              <div>
                <p className="font-semibold text-yellow-800 text-sm">
                  {stats.pendingSellers} seller{stats.pendingSellers > 1 ? "s" : ""} waiting for approval
                </p>
                <p className="text-xs text-yellow-700 mt-0.5">
                  Go to Sellers to review applications
                </p>
              </div>
            </div>
          )}
          {stats.pendingProducts > 0 && (
            <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <Package size={20} className="text-orange-600 shrink-0" />
              <div>
                <p className="font-semibold text-orange-800 text-sm">
                  {stats.pendingProducts} product{stats.pendingProducts > 1 ? "s" : ""} pending approval
                </p>
                <p className="text-xs text-orange-700 mt-0.5">
                  Go to Product Approvals to review
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Orders</CardTitle>
          <Badge variant="secondary">{stats.recentOrders?.length} latest</Badge>
        </CardHeader>
        <CardContent>
          {!stats.recentOrders?.length ? (
            <p className="text-muted-foreground text-center py-6 text-sm">
              No orders yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.recentOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      #{order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">
                        {order.userInfo?.userName || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.userInfo?.email || ""}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {order.orderDate?.split("T")[0] || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize text-white ${
                          orderStatusColor[order.orderStatus] || "bg-gray-400"
                        }`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${order.totalAmount}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

    </div>
  );
}

export default AdminDashboard;
