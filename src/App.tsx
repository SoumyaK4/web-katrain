import { Layout } from './components/Layout';

import { PWAInstallPrompt } from './components/PWAInstallPrompt';  
import { PWAUpdateNotification } from './components/PWAUpdateNotification';  
import { PerformanceMonitor } from './utils/performance'; 

// Initialize performance monitoring  
PerformanceMonitor.measurePageLoad();  
PerformanceMonitor.measureResourceLoad();  

function App() {
  return (
    <>
    <Layout />
    <PWAInstallPrompt />  
    <PWAUpdateNotification /> 
    </>
  );
}

export default App;
