// Need to be implemented via react
const notifyUser = (msg: string) => {
  return new Promise(function (resolve, reject) {
    let confirmed = window.confirm(msg);
    return confirmed ? resolve(true) : reject(false);
  });
 }

// Проверка того, что наш браузер поддерживает Service Worker API.
export default class ServiceWorkerController {
  worker: ServiceWorker | null | undefined;
  launch() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js')
        .then((req) => {
          // There is no worker before
          if (!navigator.serviceWorker.controller) {
            return;
          }
          // Worker in waiting state
          if (req.waiting) {
            notifyUser('Application has changed, do you want to see it now?').then(() => {
              this.updateWorker();
            })
            this.worker = req.waiting;
          } 
          // Worker is installing
          this.worker = req.installing;
          if (this.worker) {
            this.trackInstalling();
            return;
          }
          // New worker appear
          req.addEventListener('updatefound', () => {
            this.worker = req.installing;
            this.trackInstalling();
          })
          // Reload when controller changed
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload()
          })
        }).catch((err) => console.log(err));
    }
  }
  updateWorker() {
    this.worker?.postMessage({type: 'SKIP_WAITING'})
  }
  trackInstalling() {
    this.worker?.addEventListener('statechange', () => {
      if (this.worker?.state == 'installed') {
        notifyUser('Application has changed, do you want to see it now?').then(() => {
          this.updateWorker();
        })
      }
    })
  }
}