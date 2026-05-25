export type UserRole =
  | "customer"
  | "pro"
  | "pending_roastery"
  | "roastery_owner"
  | "roastery_staff"
  | "admin";

export type UserProfile = {
  id: string;
  email: string;
  displayName?: string;
  role: UserRole;
  createdAt: string;
  updatedAt?: string;
};

export type RoasteryAccessRequest = {
  id: string;
  userId: string;
  roasteryName: string;
  managerName: string;
  email: string;
  contact?: string;
  officialWebsite?: string;
  instagram?: string;
  roleInRoastery: "owner" | "staff" | "bean_manager";
  status: "pending" | "approved" | "rejected";
  createdAt: string;
};
