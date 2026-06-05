import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center">
          <span className="text-5xl">🐾</span>
          <h1 className="text-2xl font-bold text-gray-800">Něco se pokazilo</h1>
          <p className="max-w-md text-gray-500">
            Stránka narazila na chybu. Zkus ji znovu načíst — pokud problém přetrvává, dej nám vědět.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-green-500 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-600"
          >
            Znovu načíst
          </button>
          {import.meta.env.DEV && this.state.error && (
            <pre className="mt-4 max-w-xl overflow-auto rounded-lg bg-gray-100 p-4 text-left text-xs text-red-600">
              {this.state.error.stack}
            </pre>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
