# Timetabling API - (Node.js, Express.js, MongoDB)

## The Following are all the entities that will be in the Timetabling System

- Schools (e.g Computing and Informatics)
- Departments (e.g Information Technology)
- Courses e.g B.s.c Information Technology)
- Units (TYPE[`Theory,Practical`])
- Semesters (Y1S1, Y2S1 etc)
- Users [`admin`,`Admin(Registrar)`,`Chairperson`,`Lecturer`]
- Lecture Rooms (`Names,capacities, type[lab,standard]`)
- Time Slots

### Problem Statement

`The allocation and management of scarce resources such as lecture venues and laboratories in higher education institutions pose a complex challenge in scheduling classes, resulting in time-consuming manual timetabling processes, potential errors, and dissatisfaction among both students and lecturers.`

## Intended Solution

`Once all Schools,departments, units,users, rooms(labs,classrooms), and time slots are added to the DB, lecturers can log in and select the units they will be taking for the selected semester. After that, the user designated to generate timetable can generate a timetable. The expected results include:`

- A room allocated for a class at a particular time cannot be assigned another class at the same time.
- A lec having a class at a particular time cannot be allocated other classes at the same time.
- A unit cannot be added twice on the same day/week.
- Time allocation should be fair.
