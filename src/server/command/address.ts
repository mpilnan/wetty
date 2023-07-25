import _ from 'lodash';
import { escapeShell } from '../shared/shell.js';
import type { IncomingHttpHeaders } from 'http';

export function address(
  headers: IncomingHttpHeaders,
  user: string,
  host: string,
): string {
  let sshHost = headers['x-ssh-host'] || host;
  if (Array.isArray(sshHost)) {
    [sshHost] = sshHost;
  }

  // Check request-header for username
  const remoteUser = headers['remote-user'];
  if (!_.isUndefined(remoteUser) && !Array.isArray(remoteUser)) {
    return `${escapeShell(remoteUser)}@${sshHost}`;
  }
  if (!_.isUndefined(headers.referer)) {
    const match = headers.referer.match('.+/ssh/([^/]+)$');
    if (match) {
      const username = escapeShell(match[1].split('?')[0]);
      return `${username}@${sshHost}`;
    }
  }
  return user ? `${escapeShell(user)}@${sshHost}` : sshHost;
}
