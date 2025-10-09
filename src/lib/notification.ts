import webpush from "web-push";
import { localDateTime, localTime } from "@/lib/date";
import { Reminder, User } from "@/lib/models";
import { getSubscriptionsByUserId } from "@/lib/subscriptions";

const getTitle = ({ name, period, remind_at }: Reminder) =>
  `Reminder: ${name}  @${period === "once" ? localTime(remind_at) : localDateTime(remind_at)}`;
const getBody = ({ period, created_at }: Reminder) =>
  period === "once"
    ? `Created at ${localTime(created_at)}.`
    : `This is a ${period} reminder.`;

export const notify = async (user: User, reminder: Reminder) => {
  const title = getTitle(reminder);
  const body = getBody(reminder);

  if (user.pb_token) {
    await notifyViaPushbullet(title, body, user.pb_token);
  }
  await notifyViaWebPush(title, body, user.id);
  await notifyViaResend(user.email, title, body);
};

const notifyViaPushbullet = async (
  title: string,
  body: string,
  accessToken: string,
) => {
  const response = await fetch("https://api.pushbullet.com/v2/pushes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Access-Token": accessToken,
    },
    body: JSON.stringify({
      type: "note",
      title,
      body,
    }),
  });

  if (!response.ok) {
    throw new Error(`Pushbullet API error: ${response.statusText}`);
  }
};

const notifyViaResend = async (to: string, subject: string, html: string) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "reminders@usame.link",
      to,
      subject,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend API error: ${response.statusText}`);
  }
};

export const notifyViaWebPush = async (
  title: string,
  body: string,
  userId: number,
) => {
  const subscriptions = (await getSubscriptionsByUserId(
    userId,
  )) as PushSubscription[];

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
  );

  for (const subscription of subscriptions) {
    if (!subscription) continue;

    try {
      await webpush.sendNotification(
        subscription as unknown as webpush.PushSubscription,
        JSON.stringify({
          title,
          body,
          icon: "/icon-192.png",
        }),
      );
    } catch (error) {
      console.error("Error sending push notification:", error);
    }
  }
};
