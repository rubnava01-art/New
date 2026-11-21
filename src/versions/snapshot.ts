import type { ProjectFile, ProjectVersion } from '../types';
import { newId } from '../types';

/**
 * Comparación de dos estados de archivos por contenido, sin importar el
 * orden ni las marcas de tiempo: dos listas son el mismo estado cuando
 * tienen los mismos archivos con el mismo contenido.
 */
export function filesEqual(a: ProjectFile[], b: ProjectFile[]): boolean {
  if (a.length !== b.length) return false;
  const byPath = new Map(b.map((f) => [f.path, f.content]));
  return a.every((f) => byPath.get(f.path) === f.content);
}

/**
 * Tope del historial de versiones por proyecto.
 *
 * Cada versión guarda una copia COMPLETA de todos los archivos, así que
 * el historial crecía sin límite: cada guardado manual, cada borrado de
 * archivo, cada generación del motor y cada restauración añadían una
 * copia entera al registro del proyecto en IndexedDB. Un proyecto
 * editado a diario acumulaba cientos de copias y el registro engordaba
 * sin que nada lo podara — la misma familia de fallos de durabilidad
 * que las correcciones de noviembre cerraron para guardados y
 * borradores, pero en el otro extremo: aquí no se pierde nada, se
 * acumula todo hasta que el navegador se queda sin cuota.
 *
 * 30 versiones conservan ~un mes de puntos de retorno diarios y acotan
 * el registro a unas pocas decenas de copias de archivos. Las versiones
 * más viejas se descartan en silencio al añadir una nueva; los números
 * de versión NO se reutilizan (ver nextVersionNumber), así que la
 * lista solo deja de empezar en v1 — nunca choca ni se renumera lo
 * que el usuario ya vio en el panel.
 */
export const MAX_VERSIONS = 30;

/**
 * Siguiente número de versión: uno más que la ÚLTIMA versión de la
 * lista, no `length + 1`. Con el tope de arriba la lista deja de
 * crecer, así que `length + 1` repetiría el mismo número en cuanto se
 * descartara la versión más vieja. La lista siempre está ordenada por
 * número ascendente (solo se añade al final), así que el último
 * elemento lleva el número mayor.
 */
export function nextVersionNumber(versions: ProjectVersion[]): number {
  return (versions[versions.length - 1]?.versionNumber ?? 0) + 1;
}

/**
 * Añade una versión al final y poda las más viejas hasta el tope.
 * La lista de entrada nunca se muta.
 */
export function appendVersion(
  versions: ProjectVersion[],
  version: ProjectVersion,
): ProjectVersion[] {
  return [...versions, version].slice(-MAX_VERSIONS);
}

/**
 * Versión a registrar antes de guardar una edición manual, o null cuando
 * no hace falta.
 *
 * Hasta ahora solo el motor dejaba una copia antes de cambiar archivos:
 * una edición manual guardada no creaba versión, así que guardar a mano
 * y luego estropear el archivo no tenía vuelta atrás — pese a que el
 * panel promete que "nada se pierde". La copia guarda el estado PREVIO
 * al guardado (igual que las copias del motor): restaurar esa versión
 * devuelve el archivo a como estaba antes de guardar, y la restauración
 * misma deja una copia de seguridad del estado actual.
 *
 * Se omite la copia cuando la última versión ya contiene exactamente
 * este estado (por ejemplo, guardar un borrador que volvió al contenido
 * ya versionado): duplicarla no aportaría ningún punto de retorno nuevo.
 * La lista de entrada nunca se muta y los archivos se copian, no se
 * comparten por referencia con el proyecto vivo.
 */
export function snapshotBeforeSave(
  files: ProjectFile[],
  versions: ProjectVersion[],
  changeSummary: string,
  createdAt: string,
): ProjectVersion | null {
  const latest = versions[versions.length - 1];
  if (latest && filesEqual(latest.files, files)) return null;
  return {
    id: newId(),
    versionNumber: nextVersionNumber(versions),
    files: files.map((f) => ({ ...f })),
    createdAt,
    changeSummary,
  };
}
