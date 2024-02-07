CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    creation_time DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    creation_time DATE NOT NULL DEFAULT CURRENT_DATE,
    user_id INT REFERENCES users(id)
);
