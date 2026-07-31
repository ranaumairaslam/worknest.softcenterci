import { useEffect, useState } from "react";
import {
  getAllClients,
  createClient,
  updateClient,
  deleteClient,
} from "../services/clientService";

export function useClients() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const data = await getAllClients();
        if (isMounted) setClients(data);
      } catch (err) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const addClient = async (payload) => {
    const client = await createClient(payload);
    setClients((prev) => [client, ...prev]);
    return client;
  };

  const editClient = async (id, updates) => {
    const client = await updateClient(id, updates);
    if (client) {
      setClients((prev) => prev.map((c) => (c.id === id ? client : c)));
    }
    return client;
  };

  const removeClient = async (id) => {
    const deleted = await deleteClient(id);
    if (deleted) {
      setClients((prev) => prev.filter((c) => c.id !== id));
    }
    return deleted;
  };

  return {
    clients,
    loading,
    error,
    addClient,
    editClient,
    removeClient,
  };
}
