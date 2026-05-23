"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";
import { Bell, Shield, Globe } from "lucide-react";

export default function PatientSettingsPage() {
  const [notifications, setNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const settings = [
    {
      section: "Notifications",
      icon: Bell,
      items: [
        {
          label: "Email notifications",
          description: "Receive appointment reminders via email",
          checked: notifications,
          onChange: setNotifications,
        },
        {
          label: "SMS alerts",
          description: "Get text messages for urgent updates",
          checked: smsAlerts,
          onChange: setSmsAlerts,
        },
      ],
    },
    {
      section: "Security",
      icon: Shield,
      items: [
        {
          label: "Two-factor authentication",
          description: "Add an extra layer of security to your account",
          checked: twoFactor,
          onChange: setTwoFactor,
        },
      ],
    },
    {
      section: "Preferences",
      icon: Globe,
      items: [
        {
          label: "Language",
          description: "English",
          type: "info",
        },
        {
          label: "Theme",
          description: "Light mode",
          type: "info",
        },
      ],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      {settings.map((s) => {
        const Icon = s.icon;
        return (
          <Card key={s.section}>
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="rounded-lg bg-primary-50 p-2">
                  <Icon className="h-5 w-5 text-primary-500" />
                </div>
                <h2 className="font-semibold">{s.section}</h2>
              </div>
              <div className="space-y-4">
                {s.items.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <Label className="font-medium">{item.label}</Label>
                      <p className="text-sm text-gray-500">
                        {item.description}
                      </p>
                    </div>
                    {"checked" in item ? (
                      <Switch
                        checked={item.checked}
                        onCheckedChange={item.onChange}
                      />
                    ) : (
                      <Button variant="ghost" size="sm">
                        Change
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}

      <div className="flex gap-3">
        <Button className="hover:opacity-80">Save changes</Button>
        <Button variant="outline" className="hover:opacity-80">
          Reset to default
        </Button>
      </div>
    </div>
  );
}
