/**
 * Error Boundary para capturar errores no manejados y evitar pantallas en blanco
 * 
 * React Error Boundary captura errores de renderizado en componentes hijos
 * y muestra una pantalla de error en lugar de dejar la pantalla en blanco
 */
import React, { Component, type ReactNode } from 'react';
import { ErrorPage } from './ErrorPage';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const errorMessage = this.state.error?.message || 'Ocurrió un error inesperado';

      return (
        <ErrorPage
          title="Error de Aplicación"
          message={`${errorMessage}. Por favor, recarga la página o contacta al soporte si el problema persiste.`}
          showUrl={true}
          showBackButton={true}
        />
      );
    }

    return this.props.children;
  }
}

