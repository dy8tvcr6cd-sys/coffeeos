"use client";

import { RoasteryAdminBeanRegistration } from "@/components/RoasteryAdminBeanRegistration";
import { RoasteryAdminGate } from "@/components/RoasteryAdminGate";

export default function NewRoasteryAdminBeanPage() {
  return (
    <RoasteryAdminGate>
      <RoasteryAdminBeanRegistration />
    </RoasteryAdminGate>
  );
}
