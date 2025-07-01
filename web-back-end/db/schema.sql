-- db/schema.sql

-- 1) users tablosu
CREATE TABLE IF NOT EXISTS users (
  id              SERIAL PRIMARY KEY,
  email           TEXT    UNIQUE    NOT NULL,
  password_hash   TEXT              NOT NULL,
  name            TEXT,
  country         TEXT,
  city            TEXT,
  role            TEXT    DEFAULT 'user'    NOT NULL,
  photo_url       TEXT,
  created_at      TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at      TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 2) hotels tablosu
CREATE TABLE IF NOT EXISTS hotels (
  id                  SERIAL PRIMARY KEY,
  name                TEXT                       NOT NULL,
  city                TEXT,
  country             TEXT,
  price_per_night     NUMERIC(10,2)              NOT NULL,
  x_longitude         NUMERIC(9,6),
  y_latitude          NUMERIC(9,6),
  amenities           TEXT[],
  hotel_image_url     TEXT,
  discount_percentage INTEGER   DEFAULT 0        NOT NULL,
  point_value         INTEGER   DEFAULT 0        NOT NULL,
  created_at          TIMESTAMPTZ DEFAULT now()  NOT NULL,
  updated_at          TIMESTAMPTZ DEFAULT now()  NOT NULL
);

-- 3) comments tablosu
CREATE TABLE IF NOT EXISTS comments (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL
                REFERENCES users(id)
                ON DELETE CASCADE,
  hotel_id    INTEGER NOT NULL
                REFERENCES hotels(id)
                ON DELETE CASCADE,
  rating      INTEGER NOT NULL,
  text        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- 4) bookings tablosu
CREATE TABLE IF NOT EXISTS bookings (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL
                 REFERENCES users(id)
                 ON DELETE CASCADE,
  hotel_id     INTEGER NOT NULL
                 REFERENCES hotels(id)
                 ON DELETE CASCADE,
  start_date   DATE    NOT NULL,
  end_date     DATE    NOT NULL,
  guests       INTEGER NOT NULL,
  total_price  NUMERIC(10,2) NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now() NOT NULL
);
