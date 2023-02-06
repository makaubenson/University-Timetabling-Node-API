# Timetabling API - (Node.js, Express.js, MongoDB)

## Resources

- Schools
- Departments
- Courses
- Units (TYPE[`Theory,practical`])
- Semesters
- Users [`student`,`lecturer`,`labtechnician`,`chairperson`,`dean`, `admin`]
- Lecture Rooms (`Names,capacities, type[lab,class]`)
- Time Slots

### Problem Statement

`Management of learning activities is a complex venture in institutions of higher learning. Lecture venues and laboratories are essential but scarce resources. Scheduling a class requires one to consider the nature of the class, the number of students, the time of the day, and whether or not the unit is shared across different programs. Manual designing of timetables thus is a complex and time-consuming affair, which contributes to the loss of valuable time, not to forget the complaints from both students and lecturers over errors in the timetables.`

## Intended Solution

`Once all Schools,departments, units,users, rooms(labs,classrooms), and time slots, lecturers can log in and select the units they will be taking for the selected semester. After that, the user designated to generate timetable can generate a timetable. The expected results include:`

- A room allocated for a class at a particular time cannot be assigned another class at the same time.
- A lec having a class at a particular time cannot be allocated other classes at the same time.
- A unit cannot be added twice on the same day/week.
- Time allocation should be fair.

### Some Routes That should exist in this API

![routes1](https://user-images.githubusercontent.com/59168713/216713665-347b0809-699e-4cc1-b27f-3b57a3b823c4.png)

![routes2](https://user-images.githubusercontent.com/59168713/216713787-c5fb2815-df61-4d6c-bc83-9006a93006d7.png)

![routes3](https://user-images.githubusercontent.com/59168713/216713824-d71b2c2b-d191-47b4-b245-6d7723f2f963.png)
