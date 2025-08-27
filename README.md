# 🔔 Reminders

A simple reminders app where you can create reminders and be notified when it's time.

## Features
- Create reminders with a name, and a date to be notified.
- You can create recurring reminders with daily, weekly, monthly, or yearly intervals.
- Notifications will be sent at the time of the reminder via email.
- You can also receive notifications via Pushbullet.
- One-time reminders are deleted after they are triggered.
- Recurring reminders are updated to the next remind date after they are triggered.

## API Documentation

You can get your API token from the [Settings](https://reminders.usame.link/settings) page.

### Get Reminders

```js
fetch('https://reminders.usame.link/api/reminders', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN',
  },
});
```

### Create Reminder

#### Remind At Exact Date
```js
fetch('https://reminders.yourdomain.com/api/reminders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN',
  },
  body: JSON.stringify({
    name: 'Dentist Appointment', // Name of the reminder
    remind_at: '2025-08-20T09:00:00.000Z', // ISO Date String
    period: 'once', // 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  }),
});
```

#### Remind At Certain Minutes Later
```js
fetch('https://reminders.yourdomain.com/api/reminders', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN',
    },
  body: JSON.stringify({
    name: 'Coffe Ready!', // Name of the reminder
    minutes: 10, // Number of minutes after which the reminder should be triggered
  }),
});
```

### Update Reminder

```js
fetch('https://reminders.yourdomain.com/api/reminders', {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN',
  },
  body: JSON.stringify({
    id: 3, // ID of the reminder to be updated
    name: 'Monthly Dentist Appointment', // New name for the reminder
    remind_at: '2025-08-20T10:00:00.000Z', // ISO Date String
    period: 'monthly', // 'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'
  }),
});
```

### Delete Reminder

```js
fetch('https://reminders.yourdomain.com/api/reminders', {
  method: 'DELETE',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_TOKEN',
  },
  body: JSON.stringify({
    id: 3, // ID of the reminder to be deleted
  }),
});
```

## Built With
- [Next.js](https://nextjs.org/)
- [Prettier](https://prettier.io/)
- [Auth.js](https://authjs.dev/)
- [Cloudflare D1](https://developers.cloudflare.com/d1/)
- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Resend](https://resend.com/)
- [Pushbullet](https://www.pushbullet.com/)
- [Shadcn](https://ui.shadcn.com/)
- [TanStack Query](https://tanstack.com/query/)
- [Fav Farm](https://fav.farm/)
