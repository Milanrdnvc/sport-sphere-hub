# SportSphere Hub - Project
University of Belgrade, Faculty of Electrical Engineering
Course: Internet Application Programming

Welcome to the repository for my Internet Application Programming project. This project is developed as part of the coursework at the University of Belgrade, Faculty of Electrical Engineering.

## Project Overview

This project involves developing a full-stack web application called **SportSphere Hub** — a platform for reserving sports facilities and courts, scheduling training sessions, purchasing equipment, finding teammates, and managing promotions. The system supports efficient resource, schedule, and user activity management.

There are three types of users: **athlete** (registered user), **facility employee**, and **system administrator**.

## Key Features

* **Authentication & Registration:** Secure login with hashed passwords, role-based access, forgotten password flow with time-limited reset links, and avatar generation via DiceBear.
* **Facility Search:** Search and filter sports facilities by name, city, sport type, and court type (open/closed), with sortable results and detailed facility pages.
* **Reservations & Calendar:** Interactive weekly calendar for court/hall reservations with drag-and-drop support for employees, minimum 1-hour slots, and full reservation history.
* **Teammate Finder:** Post and browse "looking for teammates" ads by sport, city, date, and time, with join request management.
* **Individual Training:** Browse coaches by facility and sport, schedule sessions, and view training history.
* **Equipment Shop:** Browse equipment by sport, manage a shopping cart, place orders (without online payment), and track order status.
* **Promotions:** Create and display time-limited promotions with percentage or fixed discounts per sport type.
* **Statistics & Reports:** Visual dashboards (bar and line charts) for athlete activity, and monthly PDF reports for facility occupancy and equipment turnover.
* **Admin Panel:** Manage user accounts and registration requests, approve facilities, manage coaches, and add new sport types.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular |
| Backend | Node.js + Express |
| Database | MongoDB |
| ORM/ODM | Mongoose |
| File Upload | Multer |
| PDF Generation | Puppeteer |
| Calendar | FullCalendar |
| Avatar | DiceBear |

## Installation

Clone this repository to your local development environment.

### Backend

```bash
cd backend
npm install
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm install
npm start
```

Open your browser at `http://localhost:4200`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## License

[MIT](https://choosealicense.com/licenses/mit/)
