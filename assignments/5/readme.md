# Project 5

Team Members: Zackary Rauzi

Team Responsibilities:  Since I am completing this project without a group, I will be responsible for all features.

## Project:

**Pitch:** An exercise tracking app.  Users can create custom workouts, then use them to track their workouts.  The app will have features to vizualize progress over time.

## How to Use:
To begin using app, start by creating an exercise on the exercises page.
Created excersizes will be stored in the database, and can be updated and deleted.
You can view your created exercises, and even sort them by type.

Next, group your exercises into a routine on the routines page.
You can input a desired amount of sets/reps for each exercise.
Once everything looks good, save the routine so you can use it in the future.

Finally, click "Start Workout" to begin a routine.
Select the desired routine, and hit "Start Workout" to begin.
A timer will start, and a checklist of exercises to do will display.
Check off exercises until the workout is completed.

The workout date and duration will be logged and can be viewed on the history page.

## Features:

### Core:

1. **Create Individual Eercises:**
    - Exercise Name
    - Exercise Type
    - Muscle Group
    - Equipment Needed
    - Notes

2. **Group Exercises into Routines:**
    - Routine name
    - Exersizes
        - Sets/Reps per exercise

3. **Start Workout**
    - Load Routine
    - Checklist of exercises
    - Log Date & Duration

4. **History**
    - Display a log of past completed workouts with timestamps


### Streatch:

1. **Calendar Integration:**
    - Allow scheduling of routines with a calendar
    - Potentially utilize free calendar api for easier deployment

2. **Stat Vizualization**
    - Identify a data vizualization API that would allow routine stats to be easily viewed and analyzed by the user

3. **Authentication**
    - Guest access storing data in cookies
    - Log in access for user to access data through different sessions and devices