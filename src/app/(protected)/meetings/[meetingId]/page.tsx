"use client";

import React from "react";
import IssuesList from "./issues-list";

type Props = {
  params: {
    meetingId: string;
  };
};

const MeetingDetailsPage = async ({ params }: Props) => {
  const { meetingId } = await params;

  return <IssuesList meetingId={meetingId} />;
};

export default MeetingDetailsPage;
