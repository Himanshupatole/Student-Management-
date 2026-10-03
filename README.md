# Student Management App

A React application built with TypeScript, Redux Toolkit, and Vite for managing student records.

## Run locally

```powershell
cd .\student-management-app
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173/`.

## Assignment features

- Student records include name, gender, date of birth, admission year, course, full address, phone, and email.
- Create, view, edit, and delete records. Delete requires confirmation.
- Search by student name, course, or admission year; filter by course or year; sort by name, course, or year; and browse paginated results.
- Open a student row to view the full record in a details modal.
- Required fields and date, year, email, and phone values are validated before saving.
- Redux Toolkit stores student data globally; browser local storage preserves records across reloads.
