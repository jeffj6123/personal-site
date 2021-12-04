export function debounced(delay: number, fn: Function) {
    let timerId: NodeJS.Timeout;
    return function (...args) {
      if (timerId) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(() => {
        fn(...args);
        timerId = null;
      }, delay);
    }
  }