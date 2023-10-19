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
      name: 'mo-api-auth',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: 'run start:dev auth',
    },
    {
      name: 'mo-api-attendance',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: 'run start:dev attendance',
    },
    {
      name: 'mo-api-registration',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: 'run  start:dev registration',
    },
  ],
};
