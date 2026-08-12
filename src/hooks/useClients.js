import { useCallback, useEffect, useState } from "react";
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

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllClients();
      setClients(data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
    refresh: load,
  };
}