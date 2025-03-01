// Filename: taskSorter.js
// utility function that ensures sorted tasks list
// - all completed tasks belong at the end of the list
// - when a task is marked complete, it goes to the start of the completed tasks segment
// - when a task is marked incomplete, it goes to the end of the non-completed tasks segment

const taskSorter = (t1, t2) => {
  if (t1.completed && !t2.completed) {
    return 1;
  } else if (!t1.completed && t2.completed) {
    return -1;
  } else {
    return 0;
  }
};

export default taskSorter;
