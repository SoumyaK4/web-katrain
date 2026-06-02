import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { NotificationToast } from '../src/components/layout/NotificationToast';

describe('NotificationToast', () => {
  it('offers compact copy affordance for error notifications', () => {
    const html = renderToStaticMarkup(
      <NotificationToast
        notification={{ message: 'Analysis error: backend unavailable', type: 'error' }}
        onClose={() => undefined}
      />
    );

    expect(html).toContain('role="alert"');
    expect(html).toContain('data-notification-copy="true"');
    expect(html).toContain('aria-label="Copy notification"');
  });

  it('keeps success and info notifications lightweight', () => {
    const html = renderToStaticMarkup(
      <NotificationToast
        notification={{ message: 'Copied SGF to clipboard.', type: 'success' }}
        onClose={() => undefined}
      />
    );

    expect(html).toContain('role="status"');
    expect(html).not.toContain('data-notification-copy="true"');
  });
});
