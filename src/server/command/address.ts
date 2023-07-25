import _ from 'lodash';
import { escapeShell } from '../shared/shell.js';
import type { IncomingHttpHeaders } from 'http';

export function address(
  headers: IncomingHttpHeaders,
  user: string,
  host: string,
): string {
  const sshHost = headers['x-ssh-host'] || host;

  const match = headers.referer.match('.+/ssh/([^/]+)$');
  if (match) {
    const username = escapeShell(match[1].split('?')[0]);
    return `${username}@${sshHost}`;
  }
  // Check request-header for username
  const remoteUser = headers['remote-user'];
  if (remoteUser) {
    return `${escapeShell(remoteUser)}@${sshHost}`;
  }
  return user ? `${escapeShell(user)}@${sshHost}` : sshHost;
}
