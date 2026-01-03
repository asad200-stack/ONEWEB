import { prisma } from "./prisma";

export interface ActivityLogData {
  storeId: string;
  userId: string;
  userName: string;
  action: "create" | "update" | "delete" | "activate" | "deactivate" | "login" | "logout";
  entity: "product" | "category" | "tag" | "settings" | "user" | "banner" | "image" | "store";
  entityId?: string;
  details?: Record<string, any>;
}

export async function logActivity(data: ActivityLogData) {
  try {
    await prisma.activityLog.create({
      data: {
        storeId: data.storeId,
        userId: data.userId,
        userName: data.userName,
        action: data.action,
        entity: data.entity,
        entityId: data.entityId,
        details: data.details ? JSON.stringify(data.details) : null,
      },
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
    // Don't throw - activity logging should not break the main flow
  }
}

