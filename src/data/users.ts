export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  avatarUrl?: string;
}

export const USERS: User[] = [
  { id: "1", name: "Alice Johnson", email: "alice@example.com", role: "Admin", status: "active" },
  { id: "2", name: "Bob Smith", email: "bob@example.com", role: "Editor", status: "active" },
  { id: "3", name: "Carol White", email: "carol@example.com", role: "Viewer", status: "inactive" },
  { id: "4", name: "David Brown", email: "david@example.com", role: "Editor", status: "pending" },
  { id: "5", name: "Eva Martinez", email: "eva@example.com", role: "Viewer", status: "active" },
];
