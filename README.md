# University Management Server

## Technology Stack

- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Zod
- bcrypt
- JWT

## Requirement Analysis

<div></hr></div>

## [ER-Diagram](https://app.eraser.io/workspace/l9nnVYLCN11RJnDMqaYT?origin=share)

## API Endpoints

### User

- `POST /users/create-student`
- `POST /users/create-faculty`
- `POST /users/create-admin`

### Student

- `GET /students`
- `GET /students/:id`
- `PATCH /students/:id`
- `DELETE /students/:id`
- `GET /students/my-profile`

### Faculty

- `GET /faculties`
- `GET /faculties/:id`
- `PATCH /faculties/:id`
- `DELETE /faculties/:id`
- `GET /faculties/my-profile`

### Admin

- `GET /admins`
- `GET /admins/:id`
- `PATCH /admins/:id`
- `DELETE /admins/:id`
- `GET /admins/my-profile`

### Auth

- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/change-password`
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

## Functional Requirements

### Authentication

#### Student

- Students can log in and log out securely.
- Students can update their password.

#### Faculty

- Faculty can log in and log out securely.
- Faculty can update their password.

#### Admin

- Admin can log in and log out securely.
- Admin can update their password.

### Profile Management

#### Student

- Students can manage and update their profile.
- Students can update certain fields.

#### Faculty

- Faculty can manage and update their profile.
- Faculty can update certain fields.

#### Admin

- Admin can manage and update their profile.
- Admin can update certain fields.

### Academic Process

#### Student

- Students can enroll in offered courses for a specific semester.
- Students can view their class schedule.
- Students can see their grades.
- Students can view notice boards and events.

#### Faculty

- Faculty can manage student grades.
- Faculty can access students’ personal and academic information.

#### Admin

- Admin can manage multiple processes:
  - Semester.
  - Course.
  - Offered Course.
  - Section.
  - Room.
  - Building.

### User Management

#### Admin

- Admins can manage multiple accounts.
- Admin can block/unblock users.
- Admin can change user passwords.

## Data Model

### User

- `_id`
- `id` (generated)
- `password`
- `needsPasswordChange`
- `role`
- `status`
- `isDeleted`
- `createdAt`
- `updatedAt`

### Student

- `_id`
- `id` (generated)
- `name`
- `gender`
- `dateOfBirth`
- `email`
- `contactNo`
- `emergencyContactNo`
- `presentAddress`
- `permanentAddress`
- `guardian`
- `localGuardian`
- `profileImage`
- `admissionSemester`
- `isDeleted`
- `createdAt`
- `updatedAt`

### Faculty

- `_id`
- `id` (generated)
- `designation`
- `name`
- `gender`
- `dateOfBirth`
- `email`
- `contactNo`
- `emergencyContactNo`
- `presentAddress`
- `permanentAddress`
- `profileImage`
- `academicFaculty`
- `academicDepartment`
- `isDeleted`
- `createdAt`
- `updatedAt`

### Admin

- `_id`
- `id` (generated)
- `designation`
- `name`
- `gender`
- `dateOfBirth`
- `email`
- `contactNo`
- `emergencyContactNo`
- `presentAddress`
- `permanentAddress`
- `profileImage`
- `managementDepartment`
- `isDeleted`
- `createdAt`
- `updatedAt`

### Academic Semester

- `_id`
- `name`
- `year`
- `code`
- `startMonth`
- `endMonth`
- `createdAt`
- `updatedAt`

### Academic Faculty

- `_id`
- `name`
- `createdAt`
- `updatedAt`

### Academic Department

- `_id`
- `name`
- `academicFaculty`
- `createdAt`
- `updatedAt`
