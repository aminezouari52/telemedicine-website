# Platform for Real-Time Doctor-Patient Consultations

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

## Screeshots

### Landing Page
![Home](https://github.com/user-attachments/assets/748f9eda-68bf-43ff-99e3-8b7367871bc8)

### Doctor Dashboard
![DoctorDashboard](https://github.com/user-attachments/assets/54626b4f-a8f6-42ca-9235-43862c80c9f6)

### Patient Home Page
![PatientHome](https://github.com/user-attachments/assets/da5046de-94d1-4002-bb79-e438fcb982b7)

### Book a Consultation
![BookConsultation](https://github.com/user-attachments/assets/f6129d08-d9e7-4181-a6f3-8413a33d8b71)

### Real-time Consultation
![Chat](https://github.com/user-attachments/assets/64464b19-a41d-4eb4-8ecb-5473e3bd5201)

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

## Run the project

Clone the repository

```bash
git clone https://github.com/aminezouari52/telemedecine-app.git
```

Create the `.env` files

- navigate to the `apps/backend` and `apps/frontend` folders
- use `.env.example` as an example

Navigate to the directory

```bash
cd telemedecine-app
```

Use the package manager [pnpm](https://pnpm.io/) to install and run the project.

```bash
pnpm install
pnpm dev
```

## Contributing

This project is open-source, and I’m excited to collaborate with developers around the world.

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
