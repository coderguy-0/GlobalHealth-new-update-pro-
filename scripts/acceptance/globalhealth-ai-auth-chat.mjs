#!/usr/bin/env node
// §78 acceptance test — ONE GlobalHealth identity, private AI chat history.
//
// Requires the production/dev server to be running:
//   NODE_ENV=production npm run start
//   node scripts/acceptance/globalhealth-ai-auth-chat.mjs
//
// It validates:
//   - User A creates an account, verifies, logs in through /api/auth/*.
//   - A conversation is created and 5 messages persist server-side.
//   - A refresh (GET full conversation) restores the entire history.
//   - Saved chats appear under the saved filter.
//   - Logout destroys the session.
//   - User B logs in and cannot see or open User A's conversations.
const BASE_URL = process.env.BASE_URL || 'http://127.0.0.1:3000';

async function request(path, { method = 'GET', token, body } = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  let json = {};
  try {
    json = await res.json();
  } catch {
    /* non JSON */
  }
  return { status: res.status, ok: res.ok, json };
}

function uniqueEmail(label) {
  return `${label}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@example.com`;
}

function assert(condition, message) {
  if (!condition) throw new Error(`FAIL: ${message}`);
}

async function createVerifiedAccount(label) {
  const email = uniqueEmail(label);
  const password = 'GlobalHealth!1';
  const signup = await request('/api/auth/signup', {
    method: 'POST',
    body: {
      firstName: label,
      lastName: 'Acceptance',
      email,
      password,
      confirmPassword: password,
      termsAccepted: true,
      termsVersion: '1.0',
      privacyVersion: '1.0',
      country: 'India',
      preferredLanguage: 'English',
    },
  });
  assert(signup.status === 201, `${label} signup should succeed`);
  assert(signup.json.verificationRequired, `${label} signup should request verification`);

  const verify = await request('/api/auth/verify-code', {
    method: 'POST',
    body: { userId: signup.json.userId, code: signup.json.devCode || '123456', type: 'email' },
  });
  assert(verify.ok, `${label} email verification should succeed`);

  const login = await request('/api/auth/login', {
    method: 'POST',
    body: { identifier: email, password },
  });
  assert(login.ok && login.json.token, `${label} login should return a session token`);
  assert(login.json.user && login.json.user.id, `${label} login should return the server identity`);

  const me = await request('/api/auth/me', { token: login.json.token });
  assert(me.ok && me.json.user, `${label} token should validate through /api/auth/me`);

  return { email, password, userId: me.json.user.id, token: login.json.token };
}

async function main() {
  console.log(`GlobalHealth §78 acceptance — ${new Date().toISOString()}`);
  console.log(`Using server: ${BASE_URL}`);

  const userA = await createVerifiedAccount('usera');
  console.log(`✓ User A created/verified/logged in: ${userA.email}`);

  const conv = await request('/api/ai/conversations', {
    method: 'POST',
    token: userA.token,
    body: { title: 'Acceptance conversation' },
  });
  assert(conv.status === 201 && conv.json.conversation, 'User A can create a conversation');
  const convId = conv.json.conversation.id;

  for (let i = 1; i <= 5; i += 1) {
    const msg = await request(`/api/ai/conversations/${convId}/messages`, {
      method: 'POST',
      token: userA.token,
      body: { role: 'user', content: `Acceptance message ${i}`, clientMessageId: `accept-a-${i}` },
    });
    assert(msg.ok && msg.json.message, `User A message ${i} should persist`);
  }

  const fullRefresh = await request(`/api/ai/conversations/${convId}`, { token: userA.token });
  assert(fullRefresh.ok && fullRefresh.json.conversation.messages.length === 5, 'Refresh should restore all 5 messages');

  const recent = await request('/api/ai/conversations?filter=recent', { token: userA.token });
  assert(recent.ok && recent.json.conversations.some((c) => c.id === convId), 'Recent list should include the conversation');

  const saved = await request(`/api/ai/conversations/${convId}`, {
    method: 'PUT',
    token: userA.token,
    body: { isSaved: true },
  });
  assert(saved.ok && saved.json.conversation.isSaved === true, 'Saving a conversation should be confirmed by the backend');

  const savedList = await request('/api/ai/conversations?filter=saved', { token: userA.token });
  assert(savedList.ok && savedList.json.conversations.some((c) => c.id === convId), 'Saved filter should include User A chat');

  // Send a 6th message: a later login must restore this full context too.
  const sixth = await request(`/api/ai/conversations/${convId}/messages`, {
    method: 'POST',
    token: userA.token,
    body: { role: 'user', content: 'Continue from my saved history', clientMessageId: 'accept-a-6' },
  });
  assert(sixth.ok, 'User A can continue the conversation');
  const restored = await request(`/api/ai/conversations/${convId}`, { token: userA.token });
  assert(restored.json.conversation.messages.length === 6, 'Continuing restores the full 6-message history');

  await request('/api/auth/logout', { method: 'POST', token: userA.token });
  const afterLogout = await request('/api/auth/me', { token: userA.token });
  assert(afterLogout.status === 401, 'Logout should invalidate User A session');

  const userB = await createVerifiedAccount('userb');
  console.log(`✓ User B created/verified/logged in: ${userB.email}`);

  const userBList = await request('/api/ai/conversations?filter=recent', { token: userB.token });
  assert(userBList.ok, 'User B can read their own empty history');
  assert(!userBList.json.conversations.some((c) => c.id === convId), 'User B must NOT see User A conversations');

  const crossAccess = await request(`/api/ai/conversations/${convId}`, { token: userB.token });
  assert(crossAccess.status === 404, 'User B must NOT be able to open User A conversation');

  await request('/api/auth/logout', { method: 'POST', token: userB.token });

  console.log('\nPASS — §78 one-account AI chat history acceptance test completed.\n');
}

main().catch((err) => {
  console.error(err.message || err);
  process.exitCode = 1;
});
