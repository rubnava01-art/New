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
    versionNumber: versions.length + 1,
    files: files.map((f) => ({ ...f })),
    createdAt,
    changeSummary,
  };
}
