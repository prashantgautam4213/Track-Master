# Track Master: Online Train Information and Reservation System

Track Master is a modern, full-featured web application designed to simulate an online train booking platform. It provides users with tools to search for trains, view schedules, get fare estimates, and manage their bookings. The project is built with a cutting-edge tech stack and incorporates AI-powered features for an enhanced user experience.

## ✨ Features

- **Train Search**: Search for trains between major Indian railway stations on a specific date.
- **Detailed Schedules**: View a list of all available trains, including their routes, timings, and duration.
- **Class-based Availability**: See seat availability and pricing for different classes (Economy, Business, First).
- **User Authentication**: A complete, mock authentication system allowing users to register and log in.
- **User Profile**: Registered users can view their profile and a history of all their bookings.
- **AI-Powered Fare Enquiry**: A generative AI tool that provides detailed fare information and potential discounts for any given route.
- **AI-Powered Missed Train Rescheduling**: An intelligent feature that allows users to automatically reschedule a missed train to the next available one.
- **Responsive Design**: A modern, mobile-first interface that works beautifully across all devices.

## 🚀 Tech Stack

This project is built using a modern, component-based web architecture.

- **Framework**: [Next.js](https://nextjs.org/) (with App Router)
- **Markup**: HTML
- **Styling**: CSS, [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [React](https://react.dev/)
- **Component Library**: [ShadCN UI](https://ui.shadcn.com/)
- **AI & Generative Features**: [Google's Genkit](https://firebase.google.com/docs/genkit)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🏁 Getting Started

To get the project up and running on your local machine, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)
- A [Google AI API Key](https://aistudio.google.com/app/apikey).

### Installation & Setup

1.  **Clone the repository:**
    If you haven't already, get the code on your machine.
    ```bash
    git clone https://github.com/your-username/track-master.git
    cd track-master
    ```

2.  **Install dependencies:**
    Open a terminal in your code editor (like VS Code) and run:
    ```bash
    npm install
    ```
    
3.  **Set up environment variables:**
    The AI features in this project use Google's Genkit, which requires an API key for Google AI.
    
    Create a file named `.env` in the root of the project and add your API key:
    ```
    GEMINI_API_KEY=YOUR_API_KEY_HERE
    ```

4.  **Run the development server:**
    To start the app on your local machine, run the following command in your terminal:
    ```bash
    npm run dev
    ```
    The application will be running at [http://localhost:9002](http://localhost:9002). Because this project uses Genkit for its AI features, a second process for the Genkit backend may be required if you modify or extend the AI flows.

## 📁 Project Structure

- **`src/app`**: Contains all the pages and routes for the application, following the Next.js App Router structure.
- **`src/components`**: Contains all reusable React components, including UI components from ShadCN.
- **`src/lib`**: Contains shared utilities, mock data (`data.ts`), and type definitions (`types.ts`).
- **`src/context`**: Holds React context providers, such as the `AuthContext` for managing user sessions.
- **`src/ai`**: Contains the Genkit flows and prompts that power the application's AI features.
- **`public`**: For static assets like images.
