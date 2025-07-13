"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";

const BillingPage = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-5">
      <Badge variant="secondary" className="text-md shadow-primary shadow-sm">
        Billing will be available as soon as soon as I am able to scale the
        project with more powerful models
      </Badge>

      <Badge variant="secondary" className="shadow-primary text-sm shadow-sm">
        Thank you for understanding! ❤️❤️❤️
      </Badge>

      <Badge variant="secondary" className="shadow-primary text-sm shadow-sm">
        Love you all for using Gitwit!
      </Badge>
    </div>
  );
};

export default BillingPage;
