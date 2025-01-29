# AutoLuxe 🚗

AutoLuxe is a modern car selling platform designed to provide users with a seamless experience for browsing, selecting, and purchasing cars. The platform is built with a focus on performance, user experience, and scalability.

👉 **Live Demo:** [https://autoluxe-pink.vercel.app/](https://autoluxe-pink.vercel.app/)

---

## Features ✨

- **Car Listings**: Browse a wide range of cars with detailed information, including specifications, pricing, and images.
- **Search and Filters**: Easily search for cars and apply filters based on make, model, price range, and more.
- **User Authentication**: Secure user authentication for managing orders and preferences.
- **Order Management**: Users can place orders, track their status, and view order history.
- **Admin Dashboard**: Admins can manage cars, orders, and view analytics.
- **Responsive Design**: Fully responsive design for a seamless experience across devices.

---

## Technologies Used 🛠️

- **Frontend**:

  - [React.js](https://reactjs.org/) - Javascript library.
  - [Redux.js](https://nextjs.org/) - Javascript library for state management.
  - [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework for styling.
  - [shadcn/ui](https://ui.shadcn.com/) - Reusable UI components built with Radix UI and Tailwind CSS.
  - [TypeScript](https://www.typescriptlang.org/) - Strongly typed JavaScript for better developer experience.

- **Backend**:

  - [Node.js](https://nodejs.org/) - JavaScript runtime for building the backend.
  - [Express.js](https://expressjs.com/) - Web framework for Node.js.
  - [MongoDB](https://www.mongodb.com/) - NoSQL database for storing data.
  - [Mongoose](https://mongoosejs.com/) - MongoDB object modeling for Node.js.

- **Deployment**:
  - [Vercel](https://vercel.com/) - Platform for deploying frontend and backend server.
  - [Cloudinary](https://cloudinary.com/) - Cloud platform for saving images.

---

## Getting Started 🚀

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shihab-2021/AutoLuxe-Client.git
   git clone https://github.com/shihab-2021/AutoLuxe-Server.git
   ```

2. **Install dependencies**:

   ```bash
   # Install frontend dependencies
   cd AutoLuxe-Client
   npm install

   # Install backend dependencies
   cd AutoLuxe-Server
   npm install
   ```

3. **Set up environment variables**:

   - Create a `.env` file in the `backend` directory and add the following:
     ```env
      PORT=
      DEFAULT_PASS=
      JWT_ACCESS_SECRET=
      JWT_REFRESH_SECRET=
      JWT_ACCESS_EXPIRES_IN=
      JWT_REFRESH_EXPIRES_IN=
      BCRYPT_SALT_ROUNDS=
      SP_ENDPOINT=
      SP_USERNAME=
      SP_PASSWORD=
      SP_PREFIX=
      SP_RETURN_URL=
      DATABASE_URL=
     ```
   - Create a `.env.local` file in the `frontend` directory and add the following:
     ```env
      VITE_SERVER_BASE_URL=
      VITE_CLOUDINARY_PRESET=
      VITE_CLOUDINARY_URI=
     ```

4. **Run the backend server**:

   ```bash
   npm run dev
   ```

5. **Run the frontend development server**:

   ```bash
   npm run dev
   ```

6. **Open the application**:
   - Visit `http://localhost:5173` in your browser to view the frontend.
   - The backend API will be running at `http://localhost:5000`.

---

## Contributing 🤝

Contributions are welcome! If you'd like to contribute to AutoLuxe, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Commit your changes and push to the branch.
4. Submit a pull request.

---

## Contact 📧

For any questions or feedback, feel free to reach out:

- **Email**: shihab77023@gmail.com
- **GitHub**: [shihab-2021](https://github.com/shihab-2021)

---

## Happy coding! 🚀
