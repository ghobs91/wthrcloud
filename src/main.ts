import { AppView } from './AppView';
import { FlashView } from './FlashView';
import { hydrate } from './params';
import { LocationServicesError } from './errors';
import { registerSW } from 'virtual:pwa-register'

const intervalMS = 10 * 60 * 1000; // 10 minutes

const root = document.querySelector('#forecast');
const flash = FlashView(document.querySelector('#messages'));
const app = AppView(root);

registerSW({
  onRegistered(r) {
    r && setInterval(() => {
      r.update()
      console.log('re-fetching in background');
      app.reload();
    }, intervalMS)
  }
})

window.addEventListener('load', async () => {
  hydrate();
  document.body.classList.add('loading');

  try {
    await app.reload();
  } catch(e) {
    if (e instanceof LocationServicesError) {
      root.classList.add('warning');
      flash.displayAlert('Could not determine location, please enter a valid zipcode');
    } else {
      root.classList.add('error');
      flash.displayAlert(e);
    }
  } finally {
    document.body.classList.remove('loading');
    document.body.classList.remove('installing');
  }
});
