import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsers, deleteUserOrSeller } from "@/store/admin/adminManagement";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Users } from "lucide-react";

function AdminManageUsers() {
  const dispatch = useDispatch();
  const { users, isLoading } = useSelector((state) => state.adminManagement);
  const { toast } = useToast();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  function handleDelete(id, name) {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    dispatch(deleteUserOrSeller(id)).then((data) => {
      if (data?.payload?.success) {
        toast({ title: `User "${name}" deleted.` });
      } else {
        toast({ title: "Failed to delete user", variant: "destructive" });
      }
    });
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-3">
        <Users size={22} />
        <CardTitle>All Users</CardTitle>
        <Badge variant="secondary" className="ml-auto">{users.length} total</Badge>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground py-8 text-center">Loading...</p>
        ) : users.length === 0 ? (
          <p className="text-muted-foreground py-8 text-center">No users found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">{user.userName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(user._id, user.userName)}
                    >
                      <Trash2 size={14} className="mr-1" />
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}

export default AdminManageUsers;
