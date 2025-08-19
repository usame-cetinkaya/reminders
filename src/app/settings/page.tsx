"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useMeQuery } from "@/lib/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Eye,
  EyeOff,
  LoaderCircle,
  Save,
  RefreshCw,
  Key,
  Copy,
  Check,
} from "lucide-react";

export default function Settings() {
  const { theme, setTheme } = useTheme();

  const { query, updateMutation, createMutation } = useMeQuery();
  const [pushbulletToken, setPushbulletToken] = useState<string>("");
  const [showPushbulletToken, setShowPushbulletToken] = useState(false);
  const [apiToken, setApiToken] = useState<string>("");
  const [copiedApiToken, setCopiedApiToken] = useState(false);

  useEffect(() => {
    if (query.data) {
      setPushbulletToken(query.data.pb_token || "");
    }
  }, [query.data]);

  const handleSavePushbulletToken = async () => {
    await updateMutation.mutateAsync({ pb_token: pushbulletToken || null });
  };

  const handleCreateApiToken = async () => {
    const { token } = await createMutation.mutateAsync();
    setApiToken(token);
  };

  const handleCopyApiToken = async () => {
    await navigator.clipboard.writeText(apiToken);
    setCopiedApiToken(true);
    setTimeout(() => setCopiedApiToken(false), 2000);
  };

  return (
    <>
      <h1 className="text-xl font-semibold mb-4">Settings</h1>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <label>Theme</label>
          <Select value={theme} onValueChange={(value) => setTheme(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-4 flex-row items-center justify-between">
          <label>API Token</label>
          <div className="flex items-center gap-2">
            {!apiToken ? (
              <Button
                onClick={handleCreateApiToken}
                disabled={query.isLoading || createMutation.isPending}
              >
                {createMutation.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : query.data?.has_api_token ? (
                  <RefreshCw />
                ) : (
                  <Key />
                )}
                {query.data?.has_api_token ? "Rotate" : "Create"} API Token
              </Button>
            ) : (
              <>
                <Input type="text" value={apiToken} readOnly />
                <Button variant="secondary" onClick={handleCopyApiToken}>
                  {copiedApiToken ? <Check /> : <Copy />}
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label>Pushbullet Access Token</label>
          <div className="flex items-center gap-2">
            <Input
              type={showPushbulletToken ? "text" : "password"}
              value={pushbulletToken}
              onChange={(e) => setPushbulletToken(e.target.value)}
              placeholder="Enter your token"
            />
            <Button
              variant="secondary"
              onClick={() => setShowPushbulletToken(!showPushbulletToken)}
            >
              {showPushbulletToken ? <EyeOff /> : <Eye />}
            </Button>
            <Button
              onClick={handleSavePushbulletToken}
              disabled={query.isLoading || updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Save />
              )}
              Save
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
