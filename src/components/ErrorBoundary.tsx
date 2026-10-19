import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Catches render-time crashes anywhere in the app and shows a friendly
 * Spanish message instead of a blank screen, with a one-tap recovery.
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-[#101114] p-8 text-center text-white">
          <span className="inline-block h-12 w-12 rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#9a82ff]" />
          <h1 className="text-lg font-bold">Algo salió mal</h1>
          <p className="max-w-sm text-sm text-[#a7abb6]">
            La app encontró un error inesperado. Tus proyectos están guardados en
            este navegador — recargar suele arreglarlo.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-[#7c5cff] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#9a82ff]"
          >
            Recargar la app
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
