module.exports = {
  apps: [
    {
      name: 'mo-api-gateway',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: 'run start:dev',
    },
    {
      name: 'mo-api-class',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: 'run start:dev',
    },
    {
      name: 'mo-api-auth',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: 'run auth:production',
    },
    {
      name: 'mo-api-attendance',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: 'run start:dev',
    },
    {
      name: 'mo-api-registration',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: 'run  start:dev',
    },
  ],
};
