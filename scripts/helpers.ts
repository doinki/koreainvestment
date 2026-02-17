export async function excute<T, U>(
  concurrencyLimit: number,
  items: T[],
  iteratorFn: (item: T) => Promise<U>,
): Promise<U[]> {
  const tasks: Promise<U>[] = [];
  const executingTasks: Promise<U>[] = [];

  for (const item of items) {
    const task = Promise.resolve().then(() => iteratorFn(item));
    tasks.push(task);

    if (concurrencyLimit <= items.length) {
      const executingTask: Promise<U> = task.then((result) => {
        executingTasks.splice(executingTasks.indexOf(executingTask), 1);
        return result;
      });
      executingTasks.push(executingTask);
      if (executingTasks.length >= concurrencyLimit) {
        await Promise.race(executingTasks);
      }
    }
  }

  return Promise.all(tasks);
}

export function normalize(name: string): string {
  return name.trim().replace(/\//g, '_');
}

export function sanitize(text: string): string {
  return text.trim().replace(/[\r\n]+/g, ' ');
}

export function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
