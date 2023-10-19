module.exports = {
  apps: [
    {
      name: 'mo-api-gateway',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: ' start:dev',
    },
    {
      name: 'mo-api-auth',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: ' start:dev auth',
    },
    {
      name: 'mo-api-attendance',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: ' start:dev attendance',
    },
    {
      name: 'mo-api-registration',
      exec_mode: 'fork',
      instances: 1, // Or a number of instances
      script: 'pnpm',
      args: '  start:dev registration',
    },
  ],
};
