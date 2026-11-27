import { createRoot } from 'react-dom/client';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

function renderStartupFallback(message: string): void {
  const rootEl = document.getElementById('root');
  if (!rootEl || rootEl.childElementCount > 0) {
    return;
  }

  const wrapper = document.createElement('div');
  wrapper.dir = 'rtl';
  wrapper.className =
    'min-h-screen bg-slate-50 text-slate-900 flex items-center justify-center p-6';

  const card = document.createElement('div');
  card.className =
    'w-full max-w-md bg-white border border-red-200 rounded-xl p-6 space-y-3 shadow-xs';

  const title = document.createElement('h1');
  title.className = 'text-base font-bold text-red-800';
  title.textContent = 'تعذر تشغيل منصة مِعيار';

  const detail = document.createElement('pre');
  detail.dir = 'ltr';
  detail.className =
    'p-3 rounded-lg bg-slate-900 text-slate-100 text-xs font-mono whitespace-pre-wrap break-words';
  detail.textContent = message;

  const button = document.createElement('button');
  button.type = 'button';
  button.className =
    'w-full px-4 py-2.5 text-sm font-semibold text-white bg-teal-700 rounded-lg cursor-pointer';
  button.textContent = 'إعادة تحميل الصفحة';
  button.addEventListener('click', () => window.location.reload());

  card.appendChild(title);
  card.appendChild(detail);
  card.appendChild(button);
  wrapper.appendChild(card);
  rootEl.appendChild(wrapper);
}

window.addEventListener('error', (event) => {
  const message =
    event.error instanceof Error
      ? `${event.error.name}: ${event.error.message}`
      : event.message || 'Unknown startup error';
  renderStartupFallback(message);
});

window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message =
    reason instanceof Error
      ? `${reason.name}: ${reason.message}`
      : typeof reason === 'string'
        ? reason
        : 'Unhandled promise rejection during startup';
  renderStartupFallback(message);
});

const rootElement = document.getElementById('root');

if (rootElement) {
  try {
    createRoot(rootElement).render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );
  } catch (err) {
    const message =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    renderStartupFallback(message);
  }
}
