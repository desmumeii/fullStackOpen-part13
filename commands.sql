
CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author VARCHAR(255),
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES
('Dan Abramov', 'https://reactjs.org/docs/hooks-intro.html', 'On let vs const', 0),
('Laurenz Albe', 'https://www.postgresql.org/docs/current/functions-sequence.html', 'Gaps in sequences in PostgreSQL', 0);
