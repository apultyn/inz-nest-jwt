DELETE FROM user_roles;

DELETE FROM reviews;

DELETE FROM books;

DELETE FROM users;

INSERT INTO
    books (author, title)
VALUES
    (
        'J.K. Rowling',
        "Harry Potter and the Philosopher''s Stone"
    ),
    ('George Orwell', '1984'),
    ('J.R.R. Tolkien', 'The Fellowship of the Ring'),
    ('F. Scott Fitzgerald', 'The Great Gatsby'),
    ('Harper Lee', 'To Kill a Mockingbird'),
    ('Jane Austen', 'Pride and Prejudice'),
    ('Mark Twain', 'Adventures of Huckleberry Finn'),
    ('Ernest Hemingway', 'The Sun Also Rises'),
    ('Leo Tolstoy', 'War and Peace'),
    (
        'Gabriel García Márquez',
        'One Hundred Years of Solitude'
    ),
    ('Herman Melville', 'Moby Dick'),
    ('Victor Hugo', 'Les Misérables'),
    ('Mary Shelley', 'Frankenstein'),
    ('Charles Dickens', 'A Christmas Carol'),
    ('Aldous Huxley', 'Brave New World'),
    (
        'C.S. Lewis',
        'The Lion, the Witch and the Wardrobe'
    ),
    ('Homer', 'The Iliad'),
    ('Dante Alighieri', 'The Divine Comedy'),
    ('Franz Kafka', 'The Metamorphosis'),
    ('Miguel de Cervantes', 'Don Quixote');

INSERT INTO
    users (email, password)
VALUES
    (
        'apultyn@example.com',
        '$argon2id$v=19$m=65536,t=3,p=4$Z7SxehmAvO8Vwewvn/0TCA$MDxYmO80md0XmjDA0n6XlFB+145JrT9g7s9DvXimPGA'
    ),
    (
        'mpultyn@example.com',
        '$argon2id$v=19$m=65536,t=3,p=4$Z7SxehmAvO8Vwewvn/0TCA$MDxYmO80md0XmjDA0n6XlFB+145JrT9g7s9DvXimPGA'
    ),
    (
        'bpultyn@example.com',
        '$argon2id$v=19$m=65536,t=3,p=4$Z7SxehmAvO8Vwewvn/0TCA$MDxYmO80md0XmjDA0n6XlFB+145JrT9g7s9DvXimPGA'
    );

INSERT INTO
    reviews (comment, stars, bookid, userid)
VALUES
    (
        'A gripping narrative that kept me turning pages well past midnight.',
        5,
        1,
        1
    ),
    (
        'Solid world-building but the pacing drags in the middle.',
        3,
        1,
        2
    ),
    (
        'Unexpectedly moving—finished it in a single sitting.',
        5,
        2,
        2
    ),
    (
        'Enjoyable pulp adventure; perfect for a lazy weekend.',
        4,
        3,
        3
    ),
    (
        'Concept is intriguing, but characters felt flat.',
        2,
        4,
        1
    ),
    ('Masterful prose; every sentence sings.', 5, 5, 2),
    (
        'Not my cup of tea, but I can see why others rave.',
        3,
        6,
        3
    ),
    ('Quick read with a satisfying twist.', 4, 7, 2),
    (
        'Too predictable; I guessed the ending halfway through.',
        2,
        8,
        2
    ),
    (
        'Beautiful illustrations elevate a mediocre story.',
        3,
        9,
        1
    ),
    (
        'A dense but rewarding philosophical journey.',
        5,
        10,
        1
    ),
    ('Plot holes galore—left me frustrated.', 2, 11, 2),
    (
        'Heart-warming and funny in equal measure.',
        4,
        12,
        1
    ),
    (
        'Ambitious in scope, but fails to stick the landing.',
        3,
        13,
        3
    ),
    (
        'A chilling dystopia that feels all too possible.',
        5,
        14,
        1
    );

INSERT INTO
    user_roles (roleName, userId)
VALUES
    ("BOOK_USER", 1),
    ("BOOK_USER", 2),
    ("BOOK_USER", 3),
    ("BOOK_ADMIN", 1);