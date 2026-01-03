import { prisma } from "./prisma";
import { requireAuth } from "./auth";

export type UserRole = "Owner" | "Editor" | "Viewer";

export async function getUserStoreRole(storeId: string, userId: string): Promise<UserRole | null> {
  // Check if user is the store owner
  const store = await prisma.store.findFirst({
    where: {
      id: storeId,
      ownerId: userId,
    },
  });

  if (store) {
    return "Owner";
  }

  // Check store member role
  const member = await prisma.storeMember.findUnique({
    where: {
      userId_storeId: {
        userId,
        storeId,
      },
    },
  });

  return (member?.role as UserRole) || null;
}

export async function requireStoreAccess(
  storeId: string,
  requiredRole: UserRole = "Viewer"
): Promise<{ user: any; role: UserRole }> {
  const user = await requireAuth();
  const role = await getUserStoreRole(storeId, user.id);

  if (!role) {
    throw new Error("Access denied: You don't have access to this store");
  }

  const roleHierarchy: Record<UserRole, number> = {
    Owner: 3,
    Editor: 2,
    Viewer: 1,
  };

  if (roleHierarchy[role] < roleHierarchy[requiredRole]) {
    throw new Error(`Access denied: Requires ${requiredRole} role or higher`);
  }

  return { user, role };
}

export async function canEditStore(storeId: string, userId: string): Promise<boolean> {
  const role = await getUserStoreRole(storeId, userId);
  return role === "Owner" || role === "Editor";
}

export async function canViewStore(storeId: string, userId: string): Promise<boolean> {
  const role = await getUserStoreRole(storeId, userId);
  return role !== null;
}

