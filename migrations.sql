
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  slug TEXT UNIQUE,
  phone TEXT,
  city TEXT,
  description TEXT,
  destacado_until TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  preference_id TEXT,
  amount INTEGER,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
