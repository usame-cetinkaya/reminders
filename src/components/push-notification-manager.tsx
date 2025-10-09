import { useEffect, useState } from "react";
import { useSubscriptionsQuery } from "@/lib/react-query";
import { Button } from "@/components/ui/button";
import { Bell, BellOff, Send } from "lucide-react";

export function PushNotificationManager() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );

  const {
    test: testNotification,
    createMutation: subscribe,
    deleteMutation: unsubscribe,
  } = useSubscriptionsQuery();

  useEffect(() => {
    if ("serviceWorker" in navigator && "PushManager" in window) {
      setIsSupported(true);
      registerServiceWorker();
    }
  }, []);

  function urlBase64ToUint8Array(base64String: string) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function registerServiceWorker() {
    const registration = await navigator.serviceWorker.register("/sw.js", {
      scope: "/",
      updateViaCache: "none",
    });
    await registration.update();
    const sub = await registration.pushManager.getSubscription();
    setSubscription(sub);
  }

  async function handleSubscribe() {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      ),
    });
    setSubscription(subscription);
    await subscribe.mutateAsync(subscription);
  }

  async function handleUnsubscribe() {
    if (!subscription) return;
    await subscription.unsubscribe();
    setSubscription(null);
    await unsubscribe.mutateAsync(subscription);
  }

  async function handleTestNotification() {
    await testNotification.refetch();
  }

  if (!isSupported) {
    return <p>Push notifications are not supported in this browser.</p>;
  }

  return (
    <>
      {subscription ? (
        <>
          <Button onClick={handleTestNotification}>
            <Send />
            Send Test
          </Button>
          <Button variant="destructive" onClick={handleUnsubscribe}>
            <BellOff />
            Unsubscribe
          </Button>
        </>
      ) : (
        <>
          <Button onClick={handleSubscribe}>
            <Bell />
            Subscribe
          </Button>
        </>
      )}
    </>
  );
}
