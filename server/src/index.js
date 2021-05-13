// import http from 'http';
import spdy from 'spdy';

import { app } from './app';
import { insertSeeds } from './seeds';
import { sequelize } from './sequelize';

async function main() {
  const server = spdy.createServer(
    {
      spdy: {
        plain: true,
      },
    },
    app,
  );

  // データベースの初期化をします
  await sequelize.sync({
    force: true,
    logging: false,
  });
  await insertSeeds();

  server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => {
    const address = server.address();
    console.log(`Listening on ${address.address}:${address.port}`);
  });
}

main().catch(console.error);
