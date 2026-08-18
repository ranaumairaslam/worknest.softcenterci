import { useCallback, useEffect, useState } from "react";
import {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../services/notificationService";
import { subscribeDataChange } from "../utils/eventBus";
import useRole from "./useRole";

export function useNotifications() {
  const role = useRole();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [list, count] = await Promise.all([
        getNotifications(role),
        getUnreadCount(role),
      ]);
      setNotifications(list);
      setUnreadCount(count);
    } finally {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    load();
    return subscribeDataChange(load);
  }, [load]);

  const markRead = async (id) => {
    await markAsRead(id);
    await load();
  };

  const markAllRead = async (recipientId) => {
    await markAllAsRead(recipientId);
    await load();
  };

  return {
    notifications,
    unreadCount,
    loading,
    markRead,
    markAllRead,
    refresh: load,
  };
}
