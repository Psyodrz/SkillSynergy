import { Capacitor } from '@capacitor/core';
import MobileRoutes from './routes/MobileRoutes';
import WebRoutes from './routes/WebRoutes';
import ErrorBoundary from './components/ErrorBoundary';
import OTAUpdateManager from './components/OTAUpdateManager';

function App() {
  const isNative = Capacitor.isNativePlatform();

  if (isNative) {
    return (
      <ErrorBoundary>
        <OTAUpdateManager />
        <MobileRoutes />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <WebRoutes />
    </ErrorBoundary>
  );
}

export default App;
