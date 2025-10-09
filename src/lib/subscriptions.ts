import { User } from "@/lib/models";
import { db } from "@/lib/db";
import { Subscription, subscriptions } from "@/lib/schema";
import { eq } from "drizzle-orm";

export const getSubscriptionsByUserId = async (userId: number) => {
  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.user_id, userId));

  return result.map(
    (subscription: Subscription) =>
      JSON.parse(subscription.json) as PushSubscription,
  );
};

export const createSubscription = async (
  user: User,
  subscription: PushSubscription,
) => {
  await db.insert(subscriptions).values({
    user_id: user.id,
    json: JSON.stringify(subscription),
  });
};

export const deleteSubscription = async (subscription: PushSubscription) => {
  await db
    .delete(subscriptions)
    .where(eq(subscriptions.json, JSON.stringify(subscription)));
};
