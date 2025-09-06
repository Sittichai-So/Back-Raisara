const config = {
  app: {
    port: process.env.PORT,
    jwtkey: process.env.JWT_KEY,
  },

  db: {
    mongo: {
      host: process.env.DB_HOST_MONGO,
      port: process.env.DB_PORT_MONGO,
      username: process.env.DB_USER_MONGO,
      password: process.env.DB_PASSWORD_MONGO,
      maxPoolSize: process.env.DB_POOL_SIZE_MONGO,
      database: process.env.DB_NAME_MONGO,
    },
  },
};

export default config;
