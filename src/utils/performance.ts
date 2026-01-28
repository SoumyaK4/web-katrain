export class PerformanceMonitor {  
  static measurePageLoad(): void {  
    if ('performance' in window) {  
      window.addEventListener('load', () => {  
        const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;  
        console.log('Page Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');  
      });  
    }  
  }  
  
  static measureResourceLoad(): void {  
    if ('PerformanceObserver' in window) {  
      const observer = new PerformanceObserver((list) => {  
        list.getEntries().forEach((entry) => {  
          if (entry.duration > 1000) {  
            console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);  
          }  
        });  
      });  
        
      observer.observe({ entryTypes: ['resource'] });  
    }  
  }  
}