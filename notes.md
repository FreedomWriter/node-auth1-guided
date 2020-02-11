# Authentication Notes

## [12 Best Practices For User Account, Authorization and Password Management](https://cloud.google.com/blog/products/gcp/12-best-practices-for-user-account) By Ian Maddox

Authentication/AuthN is when our website verifies the identity of the user
Authorization/AuthZ is when our servers knows who you are, and is determining whether you have permission to access the requested resources.

# Core Principles for Authentication

- requiring strong passwords
- properly storing passwords
- preventing brute force attacks

## hashing

hash("hello world") == "5fauidhay4t89qy4t8qn-4q-84tq4394ugis"
hashing is not encryption, it is a one way, irreversible process. Think of it like a finger print for a small string of data. It's unique.

## examples of hashers (probably not spelled correctly)

MD5
shaw1
shaw256
bcrypt
argon

Red Flag - when an app tries to limit the length of your password. They are likely not hashing. No matter the length of the string, the hash is the same length. They are probably storing it encrypted (bad because it is reversable, if hackers get the secret key they can reverse the encryption) or as plain text.

## Brute Forcing

Attackers attempt to guess a password over and over and over again. They use programs that can do this millions of guesses per seconds.

Hashing alone isn't enough. Hackers create what is known as a Rainbow Table. It is essentially a table with every possible password hashed with the same algorthim the server is using. (there are many other kinds of brute force attacks)

One of the things we can do is to try to intentionally slow down our code. We can introduce a `time complexity`. Essentially hash-ception. This makes the Rainbow Tables take so long, the become unworth the trouble.

100,000,000 hashes at 2 milliseconds per hash = 55 hours
100,000,000 hashes at 2 seconds per hash = 6 years

## Key Derivation Function

Hash + Time = New Hash

[Bcrypt](https://www.npmjs.com/package/bcryptjs) is a key derivation library (Bcrypt is not an encryption library, it is a hashing library).

## Salting

Adding a random string (though it is not truly random because it needs to be able to be reproduced)

# To hash password using bcryptjs in the userModel on post

    npm i bcryptjs
    const bcrypt = require("bcryptjs")

    async function add(user) {
        user.password = await bcrypt.hash(user.password, 16)
        const [id] = await db("users").insert(user);
        return findById(id);
    }

//rounds is 2^16 === 65,536 times, a bit high. optimal is where it takes about 1 second

# To validate a hased password on login

    router.post("/login", async (req, res, next) => {
        try {
            const { username, password } = req.body;

            const user = await usersModel.findBy({ username }).first();

            const passwordValid = await bycrypt.compare(password, user.password);

            if (user && passwordValid) {
            res.status(200).json({ message: `Welcome ${user.username}!` });
            } else {
            res.status(401).json({ message: "Invalid Credentials" });
            }

        } catch (err) {
            next(err);
        }
    });

# Middleware Function that validates a user

    function restricted() {
        const authError = {
            message: "Invalid Credentials"
        };

        return async (req, res, next) => {
            try {
            const { username, password } = req.headers;
            if (!username || !password) {
                return res.status(401).json(authError);
            }
            const user = await usersModel.findBy({ username }).first();
            if (!user) {
                return res.status(401).json(authError);
            }
            const passwordValid = await bycrypt.compare(password, user.password);
            if (!passwordValid) {
                return res.status(401).json(authError);
            }
            // if we reach this point in the code we know that the user is authenticated
            next();
            } catch (err) {
            next(err);
            }
        };
    }
