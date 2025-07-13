"use client";

import { Badge } from "@/components/ui/badge";
import React from "react";

const BillingPage = () => {
  return (
      <div className="flex flex-col gap-5 h-full items-center justify-center">
          
      <Badge variant="secondary" className="text-md shadow-sm shadow-primary">
        Billing will be available as soon as soon as I am able to scale the
        project with more powerful models
      </Badge>

          <Badge variant="secondary" className="text-sm shadow-sm shadow-primary">Thank you for understanding! ❤️❤️❤️</Badge>
          
          <Badge variant="secondary" className="text-sm shadow-sm shadow-primary">Love you all for using Gitwit!</Badge>
    </div>
  );
};

export default BillingPage;
