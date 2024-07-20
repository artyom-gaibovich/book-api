CREATE TABLE user_roles (
    user_id INTEGER NOT NULL,
    role_value VARCHAR(5) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (role_value) REFERENCES roles(value) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_value)
);