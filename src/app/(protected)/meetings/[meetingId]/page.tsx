import React from "react";

type Props = {
  params: {
    meetingId: string;
  };
};

const MeetingDetailsPage = ({ params }: Props) => {
  const { meetingId } = params;

  return <div>{meetingId}</div>;
};

export default MeetingDetailsPage;
