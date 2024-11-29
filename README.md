# Telemedecine

This project is an open-source platform designed to facilitate secure, real-time text-based consultations between doctors and patients. With a focus on simplicity and ease of use, the app allows users to engage in private, secure conversations without the need for in-person visits, leveraging modern web technologies.

**Live Website**
You can try the app live at: [Live Website Link](https://bucolic-malabi-07ed64.netlify.app)

## Features

- Real-time Secure Chat: Private, text-based messaging for doctor-patient communication.
- Appointment Scheduling: Patients can book consultations with doctors, ensuring a smooth experience.
- User Profiles: Both doctors and patients have personalized profiles for storing essential information.
- Real-time Notifications: Receive notifications when your consultation is about to begin, or when a doctor is available.
- Open-source Contribution: Actively accepting pull requests for new features, bug fixes, and improvements.
- Responsive Design: Accessible on all devices, ensuring users can connect from anywhere.

## Roadmap

- Implement video consultation functionality (coming soon).
- Integrate payment processing for paid consultations.
- Add multi-language support for international users.

## Technologies Used

- Frontend: React, [ChakraUI](https://chakra-ui.com/)
- Backend: Node.js, Express.js, MongoDB Atlas
- Authentication: Firebase
- Real-time chat: Socket.io
- Real-time notifications: [Node Cron](https://www.npmjs.com/package/node-cron)
- Deployment: Render.com, Netlify

## Installation

Clone the repository

```bash
git clone https://github.com/aminezouari52/telemedecine-app.git
```

Create a `.env` file, use `.env.example` as an example

```bash
cd telemedecine-app
```

Use the package manager [pnpm](https://pnpm.io/) to install and run the project the Telemedecin App.

```bash
pnpm install
pnpm dev
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
