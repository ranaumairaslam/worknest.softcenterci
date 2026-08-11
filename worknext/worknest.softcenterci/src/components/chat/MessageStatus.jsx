import {
  Clock3,
  Check,
  CheckCheck,
} from "lucide-react";

export default function MessageStatus({ status }) {
  switch (status) {
    case "sending":
      return (
        <Clock3
          size={14}
          className="text-slate-400"
        />
      );

    case "sent":
      return (
        <Check
          size={15}
          className="text-slate-400"
        />
      );

    case "delivered":
      return (
        <CheckCheck
          size={15}
          className="text-slate-400"
        />
      );

    case "seen":
      return (
        <CheckCheck
          size={15}
          className="text-sky-400"
        />
      );

    default:
      return null;
  }
}