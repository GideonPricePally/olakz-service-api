// import { betterAuth } from 'better-auth';
// import { phoneNumber, username } from 'better-auth/plugins';
// import { Pool } from 'pg';

// const dataRam = new Map();
// // npx @better-auth/cli generate --config ./src/libs/auth/auth.ts
// export const auth = betterAuth({
//   basePath: '/api/v1/auth',
//   plugins: [
//     username({}),
//     phoneNumber({
//       sendOTP: ({ phoneNumber, code }, request) => {
//         // Implement sending OTP code via SMS
//       },
//     }),
//   ],
//   socialProviders: {
//     apple: {
//       clientId: process.env.APPLE_CLIENT_ID as string,
//       clientSecret: process.env.APPLE_CLIENT_SECRET as string,
//       // Optional
//       appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER as string,
//     },
//     tiktok: {
//       clientId: process.env.TIKTOK_CLIENT_ID as string,
//       clientSecret: process.env.TIKTOK_CLIENT_SECRET as string,
//       clientKey: process.env.TIKTOK_CLIENT_KEY as string,
//     },
//     spotify: {
//       clientId: process.env.SPOTIFY_CLIENT_ID as string,
//       clientSecret: process.env.SPOTIFY_CLIENT_SECRET as string,
//     },
//   },
//   database: new Pool({
//     host: process.env.DATABASE_HOST,
//     port: process.env.DATABASE_PORT ? parseInt(process.env.DATABASE_PORT, 10) : 5432,
//     user: process.env.DATABASE_USERNAME,
//     password: process.env.DATABASE_PASSWORD,
//     database: process.env.DATABASE_NAME,
//   }),
//   secondaryStorage: {
//     get: async (key) => {
//       const value = await dataRam.get(key);
//       return value ? value : null;
//     },
//     set: async (key, value, ttl) => {
//       await dataRam.set(key, value);
//     },
//     delete: async (key) => {
//       await dataRam.delete(key);
//     },
//   },
//   user: {
//     modelName: 'user',
//     fields: {
//       emailVerified: 'email_verified',
//       image: 'thumbnail',
//       createdAt: 'created_at',
//       updatedAt: 'updated_at',
//       displayUsername: 'updated_username',
//     },
//   },
// });
