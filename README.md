# PassBolt

This project is a secure password manager designed to store encrypted vaults containing usernames and passwords. 
The vaults are organized into folders and stored on the cloud. The system is built using Node.js, Express.js, React.js, 
and Redux. It utilizes various encryption and hashing algorithms to ensure the security of user data. 
The database used is MongoDB Atlas.

## Live Demo

Check out the live demo of the Password Manager: [Demo Link](https://passbolt.netlify.app/)

## Features

- User-friendly web interface for managing passwords and credentials.
- Encrypted vaults to store usernames and passwords securely.
- Organize vaults into folders for better organization.
- Utilize strong encryption and hashing algorithms for data security.
- Store data in a MongoDB Atlas database for scalability.
- Implement all security features directly in the client's browser for enhanced privacy.

## Technologies Used

- **Frontend:**
  - React.js
  - Redux

- **Backend:**
  - Node.js
  - Express.js

- **Database:**
  - MongoDB Atlas

## Security Measures

1. **Encryption Algorithms:**
   - AES (Advanced Encryption Standard) for encrypting sensitive data in the vaults.
   - RSA (Rivest–Shamir–Adleman) for securely generating and exchanging encryption keys.

2. **Hashing Algorithm:**
   - SHA-256 (Secure Hash Algorithm 256-bit) for securely hashing passwords.

3. **Client-side Security:**
   - All encryption, hashing, and other security features are implemented in the client's browser to ensure user privacy.

4. **Unique Encryption Keys:**
   - Each user has unique encryption keys for their data, enhancing security.

## Usage

1. Clone the repository.
2. Set up a MongoDB Atlas database instance.
3. Configure the backend to connect to the MongoDB Atlas database.
4. Run the backend using `node app.js` command.
5. Set up the frontend environment and start the React.js app using `npm run start`.
