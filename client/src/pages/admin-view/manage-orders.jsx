import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllOrdersWithUserInfo,
  fetchOrdersByUser,
  clearUserOrders,
} from "@/store/admin/adminManagement";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ShoppingBag, Eye } from "lucide-react";

const orderStatusColor = {
  confirmed: "bg-green-500",
  rejected: "bg-red-600",
  delivered: "bg-blue-500",
  inShipping: "bg-purple-500",
  inProcess: "bg-orange-400",
  pending: "bg-gray-500",
};

function AdminManageOrders() {
  const dispatch = useDispatch();
  const { allOrders, userOrders, isLoading } = useSelector(
    (state) => state.adminManagement
  );

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [userOrdersOpen, setUserOrdersOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchAllOrdersWithUserInfo());
  }, [dispatch]);

  function handleViewOrder(order) {
    setSelectedOrder(order);
    setDetailsOpen(true);
  }

  function handleViewUserOrders(user) {
    setSelectedUser(user);
    dispatch(fetchOrdersByUser(user._id || user.id));
    setUserOrdersOpen(true);
  }

  const filteredOrders = allOrders.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      o._id.toLowerCase().includes(term) ||
      o.userInfo?.userName?.toLowerCase().includes(term) ||
      o.userInfo?.email?.toLowerCase().includes(term)
    );
  });

  // Build unique users list from allOrders for the "per-user" view
  const uniqueUsers = [];
  const seenIds = new Set();
  allOrders.forEach((o) => {
    if (o.userInfo && o.userId && !seenIds.has(o.userId)) {
      seenIds.add(o.userId);
      uniqueUsers.push({ ...o.userInfo, _id: o.userId });
    }
  });

  return (
    <>
      <div className="space-y-6">
        {/* Users summary card */}
        <Card>
          <CardHeader className="flex flex-row items-center gap-3">
            <ShoppingBag size={22} />
            <CardTitle>Orders by User</CardTitle>
          </CardHeader>
          <CardContent>
            {uniqueUsers.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No orders yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Total Orders</TableHead>
                    <TableHead className="text-right">View</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {uniqueUsers.map((u) => {
                    const count = allOrders.filter((o) => o.userId === u._id).length;
                    return (
                      <TableRow key={u._id}>
                        <TableCell className="font-medium">{u.userName}</TableCell>
                        <TableCell>{u.email}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{count}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewUserOrders(u)}
                          >
                            <Eye size={13} className="mr-1" />
                            Orders
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* All orders table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>All Orders</CardTitle>
            <input
              type="text"
              placeholder="Search by order ID, user, email…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-md px-3 py-1.5 text-sm w-64 bg-background"
            />
            <Badge variant="secondary">{filteredOrders.length} orders</Badge>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-muted-foreground py-8 text-center">Loading...</p>
            ) : filteredOrders.length === 0 ? (
              <p className="text-muted-foreground py-8 text-center">No orders found.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead className="text-right">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.map((order) => (
                    <TableRow key={order._id}>
                      <TableCell className="font-mono text-xs">
                        {order._id.slice(-8)}
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-sm">
                          {order.userInfo?.userName || "—"}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {order.userInfo?.email || ""}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {order.orderDate?.split("T")[0] || "—"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`capitalize ${
                            orderStatusColor[order.orderStatus] || "bg-gray-500"
                          }`}
                        >
                          {order.orderStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        ${order.totalAmount}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewOrder(order)}
                        >
                          <Eye size={13} className="mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order detail dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-y-2">
                <span className="font-medium">Order ID</span>
                <span className="font-mono text-xs">{selectedOrder._id}</span>

                <span className="font-medium">Buyer</span>
                <span>
                  {selectedOrder.userInfo?.userName} (
                  {selectedOrder.userInfo?.email})
                </span>

                <span className="font-medium">Date</span>
                <span>{selectedOrder.orderDate?.split("T")[0]}</span>

                <span className="font-medium">Status</span>
                <Badge
                  className={`w-fit capitalize ${
                    orderStatusColor[selectedOrder.orderStatus] || "bg-gray-500"
                  }`}
                >
                  {selectedOrder.orderStatus}
                </Badge>

                <span className="font-medium">Payment</span>
                <span>{selectedOrder.paymentStatus}</span>

                <span className="font-medium">Total</span>
                <span className="font-bold">${selectedOrder.totalAmount}</span>
              </div>

              <div>
                <p className="font-medium mb-2">Items</p>
                <div className="space-y-1">
                  {selectedOrder.cartItems?.map((item, i) => (
                    <div
                      key={i}
                      className="flex justify-between text-sm border-b pb-1"
                    >
                      <span>{item.title}</span>
                      <span className="text-muted-foreground">
                        x{item.quantity} · ${item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="font-medium mb-1">Shipping Address</p>
                <div className="text-muted-foreground space-y-0.5">
                  <p>{selectedOrder.addressInfo?.address}</p>
                  <p>
                    {selectedOrder.addressInfo?.city},{" "}
                    {selectedOrder.addressInfo?.pincode}
                  </p>
                  <p>{selectedOrder.addressInfo?.phone}</p>
                  {selectedOrder.addressInfo?.notes && (
                    <p className="italic">{selectedOrder.addressInfo?.notes}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* User orders dialog */}
      <Dialog
        open={userOrdersOpen}
        onOpenChange={(open) => {
          setUserOrdersOpen(open);
          if (!open) {
            setSelectedUser(null);
            dispatch(clearUserOrders());
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Orders by {selectedUser?.userName}
            </DialogTitle>
          </DialogHeader>
          {userOrders.length === 0 ? (
            <p className="text-muted-foreground py-6 text-center">
              No orders found for this user.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-mono text-xs">
                      {order._id.slice(-8)}
                    </TableCell>
                    <TableCell>{order.orderDate?.split("T")[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`capitalize ${
                          orderStatusColor[order.orderStatus] || "bg-gray-500"
                        }`}
                      >
                        {order.orderStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${order.totalAmount}</TableCell>
                    <TableCell>{order.cartItems?.length || 0}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminManageOrders;
