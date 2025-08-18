import { Reminder, User } from "@/lib/models";

export const localDateTime = (isoString: string) =>
  new Date(isoString).toLocaleString("tr-TR", {
    timeZone: "Europe/Istanbul",
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

const localTime = (isoString: string) =>
  new Date(isoString).toLocaleTimeString("tr-TR", {
    timeZone: "Europe/Istanbul",
  });

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
