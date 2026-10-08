"use client";

import { useEffect, useState } from "react";

export default function LocalDateTime({ className = "" }) {
  const [localDateTime, setLocalDateTime] = useState("তারিখ ও সময়");

  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("bn-BD", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "Asia/Dhaka",
    });
    const updateDateTime = () => setLocalDateTime(formatter.format(new Date()));

    updateDateTime();
    const intervalId = window.setInterval(updateDateTime, 60_000);
    return () => window.clearInterval(intervalId);
  }, []);

  return <span className={className}>{localDateTime}</span>;
}
