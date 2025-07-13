# GitWit

GitWit is a comprehensive tool designed to help developers master any codebase. It provides features such as repository analysis, intelligent Q&A, meeting transcription, and more.

## Features

- **Commit Intelligence**: Automatically track and summarize recent commits with detailed change analysis and impact assessment.
- **Smart Q&A**: Ask questions about your codebase and get intelligent answers with relevant file references.
- **File Mapping**: Comprehensive file analysis and mapping to understand project structure and dependencies.
- **Meeting Transcription**: Upload meeting recordings for AI-powered transcription and topic classification.

## Technologies Used

GitWit is built using the following technologies:

- [Next.js](https://nextjs.org): A React framework for building web applications.
- [Prisma](https://prisma.io): A modern database toolkit.
- [Tailwind CSS](https://tailwindcss.com): A utility-first CSS framework.
- [tRPC](https://trpc.io): End-to-end typesafe APIs.
- [Drizzle](https://orm.drizzle.team): A lightweight ORM.
- [Firebase](https://firebase.google.com): For file storage.
- [Assembly AI](https://www.assemblyai.com): For meeting transcription.

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/spandan-mozumder/gitwit.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory.
   - Add the required variables (e.g., `DATABASE_URL`, `GEMINI_API_KEY`, `NEXT_PUBLIC_FIREBASE_API_KEY`).

4. Start the database:
   ```bash
   ./start-database.sh
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

## Usage Instructions

- **Link a GitHub Repository**: Navigate to the "Create Project" page and enter the repository URL.
- **Ask Questions**: Use the Q&A feature to ask questions about your codebase.
- **View Commit Logs**: Check the commit log for detailed summaries.
- **Upload Meeting Recordings**: Use the "Meetings" section to upload recordings for transcription.

## Deployment

GitWit can be deployed using platforms like [Vercel](https://vercel.com), [Netlify](https://www.netlify.com), or Docker. Refer to the respective deployment guides for more details.

## Learn More

To learn more about the technologies used in GitWit, check out the following resources:

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle Documentation](https://orm.drizzle.team/docs)

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests on the [GitHub repository](https://github.com/spandan-mozumder/gitwit).

## License

This project is licensed under the MIT License.
