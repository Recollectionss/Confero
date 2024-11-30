interface State {
  agenda: string[];
}
interface StateForNextCommand extends State {
  currentIndex: number;
}
export const stateForTodayCommand: State = {
  agenda: [],
};
export const stateForNextCommand: StateForNextCommand = {
  agenda: [],
  currentIndex: 0,
};
