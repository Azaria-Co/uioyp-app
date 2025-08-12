import { useEffect, useState, useCallback } from 'react';
import { getIdUs } from './auth';
import { getPacienteByUsuario } from '../api/pacientes';
import { getProgresos } from '../api/progresos';

const ETAPAS = ['Semilla', 'Una planta', 'Un pequeño árbol', 'Un árbol grande'];

export function useCurrentStage() {
  const [currentStage, setCurrentStage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const id_us = await getIdUs();
      if (!id_us) {
        setCurrentStage(1);
        return;
      }
      const paciente = await getPacienteByUsuario(id_us);
      if (!paciente || !paciente.id) {
        setCurrentStage(1);
        return;
      }
      const progresos = await getProgresos(paciente.id);
      if (!Array.isArray(progresos) || progresos.length === 0) {
        setCurrentStage(1);
        return;
      }
      const sorted = [...progresos].sort((a, b) => {
        const ad = new Date(a.fecha || 0).getTime();
        const bd = new Date(b.fecha || 0).getTime();
        return bd - ad;
      });
      const latest = sorted[0];
      const etapaStr = String(latest.etapa || '');
      const idx = ETAPAS.findIndex((e) => e === etapaStr);
      setCurrentStage(idx >= 0 ? idx + 1 : 1);
    } catch (e) {
      setCurrentStage(1);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { currentStage, loading, reloadCurrentStage: load };
}



