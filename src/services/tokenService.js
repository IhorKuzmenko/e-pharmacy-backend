import { createHash } from 'node:crypto';

import RevokedToken from '../models/RevokedToken.js';

export const hashToken = (token) => {
  return createHash('sha256').update(token).digest('hex');
};

export const isTokenRevoked = async (token) => {
  const tokenHash = hashToken(token);

  const revokedToken = await RevokedToken.exists({
    tokenHash,
  });

  return Boolean(revokedToken);
};

export const revokeToken = async (token, expiresAt) => {
  const tokenHash = hashToken(token);

  await RevokedToken.updateOne(
    { tokenHash },
    {
      $setOnInsert: {
        tokenHash,
        expiresAt,
      },
    },
    { upsert: true },
  );
};
